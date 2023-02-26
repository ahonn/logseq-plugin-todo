import 'virtual:windi.css';
import React, { useEffect, useRef } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { AppUserConfigs } from '@logseq/libs/dist/LSPlugin.user';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import TaskInput, { ITaskInputRef } from './components/TaskInput';
import TaskSection, { GroupBy } from './components/TaskSection';
import TaskFilter from './components/TaskFilter';
import { logseq as plugin } from '../package.json';
import { useRecoilCallback, useRecoilState, useRecoilValue } from 'recoil';
import { visibleState } from './state/visible';
import { userConfigsState } from './state/user-configs';
import { themeModeState, themeStyleState } from './state/theme';
import getTodayTaskQuery from './querys/today';
import getScheduledTaskQuery from './querys/scheduled';
import getAnytimeTaskQuery from './querys/anytime';
import { settingsState } from './state/settings';
import * as api from './api';
import Mousetrap from 'mousetrap';
import 'mousetrap-global-bind';
import getNextNDaysTaskQuery from './querys/next-n-days';
import { fixPreferredDateFormat } from './utils';
import './style.css';
import { markerState, priorityState } from './state/filter';
import { TaskPriority } from './models/TaskEntity';

dayjs.extend(advancedFormat);

function ErrorFallback({ error }: FallbackProps) {
  useEffect(() => {
    window.logseq.App.showMsg(`[${plugin.id}]: ${error.message}`, 'error');
  }, [error.message]);

  return (
    <div role="alert" className="text-red-500 font-semibold">
      <p>Todo list failed to render.</p>
      <p>Can you re-index your graph and try again?</p>
    </div>
  );
}

interface IAppProps {
  userConfigs: AppUserConfigs;
}

function App(props: IAppProps) {
  const innerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<ITaskInputRef>(null);
  const visible = useRecoilValue(visibleState);
  const [userConfigs, setUserConfigs] = useRecoilState(userConfigsState);
  const themeStyle = useRecoilValue(themeStyleState);
  const themeMode = useRecoilValue(themeModeState);
  const settings = useRecoilValue(settingsState);
  const marker = useRecoilValue(markerState);
  const priority = useRecoilValue(priorityState);

  const refreshAll = useRecoilCallback(
    ({ snapshot, refresh }) =>
      () => {
        for (const node of snapshot.getNodes_UNSTABLE()) {
          refresh(node);
        }
      },
    [],
  );

  useEffect(() => {
    setUserConfigs(props.userConfigs);
  }, [props.userConfigs, setUserConfigs]);

  useEffect(() => {
    if (!settings.hotkey) {
      return;
    }

    // @ts-ignore
    Mousetrap.bindGlobal(
      settings.hotkey,
      () => window.logseq.hideMainUI(),
      'keydown',
    );
    return () => {
      // @ts-ignore
      Mousetrap.unbindGlobal(settings.hotkey, 'keydown');
    };
  }, [settings.hotkey]);

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
      refreshAll();
      window.logseq.App.getUserConfigs().then(setUserConfigs);

      const keydownHandler = (ev: KeyboardEvent) => {
        if (ev.key === 'Escape') {
          window.logseq.hideMainUI();
          return;
        }
      };
      document.addEventListener('keydown', keydownHandler);
      return () => {
        document.removeEventListener('keydown', keydownHandler);
      };
    }
  }, [visible, refreshAll, setUserConfigs]);

  useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  const handleClickOutside = (e: React.MouseEvent) => {
    if (!innerRef.current?.contains(e.target as unknown as Node)) {
      window.logseq.hideMainUI();
    }
  };

  const createNewTask = async (content: string) => {
    const { preferredDateFormat, preferredTodo } = userConfigs!;
    const { whereToPlaceNewTask } = settings;
    const date = dayjs().format(fixPreferredDateFormat(preferredDateFormat!));
    await api.createNewTask(date, content, {
      marker: marker.value || preferredTodo,
      priority: priority.value as TaskPriority,
      whereToPlaceNewTask,
    });
    refreshAll();
  };

  return (
    <main
      className={`w-screen h-screen ${visible ? 'block' : 'hidden'}`}
      onClick={handleClickOutside}
    >
      <div ref={innerRef} id={plugin.id}>
        <div
          className="absolute p-4 w-90 h-120 -left-13rem bg-white shadow rounded-lg overflow-y-auto border-2"
          style={{
            backgroundColor: themeStyle.primaryBackgroundColor,
            borderColor: themeStyle.secondaryBackgroundColor,
          }}
        >
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <TaskInput ref={inputRef} onCreateTask={createNewTask} />
            <TaskFilter />
            <div>
              <TaskSection title="Today" query={getTodayTaskQuery()} />
              {settings.showNextNDaysTask && (
                <TaskSection
                  title={`Next ${settings.numberOfNextNDays} Days`}
                  query={getNextNDaysTaskQuery(settings.numberOfNextNDays)}
                />
              )}
              <TaskSection
                title="Scheduled"
                query={
                  settings.showNextNDaysTask
                    ? getScheduledTaskQuery(
                        dayjs().add(settings.numberOfNextNDays, 'd'),
                      )
                    : getScheduledTaskQuery()
                }
              />
              <TaskSection
                title="Anytime"
                query={getAnytimeTaskQuery()}
                groupBy={GroupBy.Page}
              />
            </div>
          </ErrorBoundary>
        </div>
      </div>
    </main>
  );
}

export default App;

import { AppUserConfigs } from '@logseq/libs/dist/LSPlugin.user';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { TaskEntityObject } from '../models/TaskEntity';
import getAnytimeTaskQuery from '../querys/anytime';
import getScheduledTaskQuery from '../querys/scheduled';
import getTodayTaskQuery from '../querys/today';
import { DEFAULT_USER_CONFIGS, userConfigsState } from '../state/user-configs';
import useTaskQuery from './useTaskQuery';

export interface IAppState {
  userConfigs: Partial<AppUserConfigs>;
  settings: {
    lightPrimaryBackgroundColor: string;
    lightSecondaryBackgroundColor: string;
    darkPrimaryBackgroundColor: string;
    darkSecondaryBackgroundColor: string;
    sectionTitleColor: string;
  };
  tasks: {
    today: TaskEntityObject[];
    scheduled: TaskEntityObject[];
    anytime: TaskEntityObject[];
  };
  refresh(): void;
}

const DEFAULT_SETTINGS = {
  sectionTitleColor: '#0a0a0a',
  lightPrimaryBackgroundColor: '#ffffff',
  lightSecondaryBackgroundColor: '#f7f7f7',
  darkPrimaryBackgroundColor: '#002B37',
  darkSecondaryBackgroundColor: '#106ba3',
};

const AppStateContext = React.createContext<IAppState>({
  userConfigs: DEFAULT_USER_CONFIGS,
  settings: DEFAULT_SETTINGS,
  tasks: {
    today: [],
    scheduled: [],
    anytime: [],
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  refresh: () => {},
});

const useAppState = () => {
  const appState = useContext(AppStateContext);
  return appState;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const withAppState = <P extends {}>(
  WrapComponent: React.ComponentType<P>,
) => {
  const WithAppState: typeof WrapComponent = (props) => {
    const [settings, setSettings] = useState(
      (logseq.settings as unknown as IAppState['settings']) ?? DEFAULT_SETTINGS,
    );
    const userConfigs = useRecoilValue(userConfigsState);
    const todayTask = useTaskQuery(getTodayTaskQuery());
    const scheduledTask = useTaskQuery(getScheduledTaskQuery());
    const anytimeTask = useTaskQuery(getAnytimeTaskQuery());

    const refresh = useCallback(() => {
      todayTask.mutate();
      scheduledTask.mutate();
      anytimeTask.mutate();
    }, [todayTask, scheduledTask, anytimeTask]);

    const state = useMemo(
      () => ({
        userConfigs,
        settings,
        tasks: {
          today: todayTask.data || [],
          scheduled: scheduledTask.data || [],
          anytime: anytimeTask.data || [],
        },
        refresh,
      }),
      [
        userConfigs,
        settings,
        todayTask.data,
        scheduledTask.data,
        anytimeTask.data,
        refresh,
      ],
    );

    useEffect(() => {
      const unlisten = logseq.onSettingsChanged((newSettings) => {
        setSettings(newSettings);
      });
      return () => unlisten();
    }, []);

    return (
      <AppStateContext.Provider value={state}>
        <WrapComponent {...props} />
      </AppStateContext.Provider>
    );
  };
  return WithAppState;
};

export default useAppState;

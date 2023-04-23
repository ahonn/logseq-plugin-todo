import React, { useEffect, useMemo, useState } from 'react';
import {
  useRecoilCallback,
  useRecoilValue,
  useRecoilValueLoadable,
} from 'recoil';
import { groupBy } from 'lodash-es';
import { TaskEntityObject } from '../models/TaskEntity';
import { filterdTasksState } from '../state/tasks';
import { themeStyleState } from '../state/theme';
import { visibleState } from '../state/visible';
import TaskItem from './TaskItem';
import { settingsState } from '../state/settings';
import { openTask, openTaskPage } from '../api';
import { inputState } from '../state/input';
import { ChevronsRight } from 'tabler-icons-react';

export enum GroupBy {
  Page,
  Tag,
  Namespace,
}

export interface ITaskSectionProps {
  title: string;
  query: string;
  groupBy?: GroupBy;
}

const TaskSection: React.FC<ITaskSectionProps> = (props) => {
  const { title, query } = props;
  const [tasks, setTasks] = useState<TaskEntityObject[]>([]);
  const visible = useRecoilValue(visibleState);
  const tasksLoadable = useRecoilValueLoadable(filterdTasksState(query));
  const themeStyle = useRecoilValue(themeStyleState);
  const { openInRightSidebar } = useRecoilValue(settingsState);
  const input = useRecoilValue(inputState);

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
    switch (tasksLoadable.state) {
      case 'hasValue': {
        const tasks = tasksLoadable.contents.filter(
          (task: TaskEntityObject) => {
            return task.content.toLowerCase().includes(input.toLowerCase());
          },
        );
        setTasks(tasks);
        break;
      }
      case 'hasError':
        throw tasksLoadable.contents;
    }
  }, [tasksLoadable.state, tasksLoadable.contents, input]);

  useEffect(() => {
    if (visible) {
      refreshAll();
    }
  }, [visible, refreshAll]);

  const taskGroups = useMemo(() => {
    switch (props.groupBy) {
      case GroupBy.Page:
        return groupBy(tasks, (task: TaskEntityObject) => task.page.name);
      default:
        return { '': tasks };
    }
  }, [props.groupBy, tasks]);

  const openTaskGroups = React.useCallback(() => {
    tasks.forEach((task) => {
      openTask(task, {
        openInRightSidebar: true,
      });
    });
    window.logseq.hideMainUI();
  }, [tasks]);

  if (tasks.length === 0) {
    return null;
  }

  return (
    <div className="py-1">
      <div className="flex flex-row justify-between items-center">
        <h2
          className="py-1 mr-2 text-blue-400"
          style={{ color: themeStyle.sectionTitleColor }}
        >
          {title}
        </h2>
        <div className="pl-2 pr-1" onClick={openTaskGroups}>
          <ChevronsRight
            size={20}
            className="stroke-gray-300 cursor-pointer"
          />
        </div>
      </div>
      <div>
        {(Object.entries(taskGroups) ?? []).map(([name, tasks]) => {
          const [{ page }] = tasks;
          return (
            <div key={name}>
              {name && (
                <h3
                  className="py-1 text-sm text-gray-400 cursor-pointer"
                  onClick={() => openTaskPage(page, { openInRightSidebar })}
                >
                  {name}
                </h3>
              )}
              {(tasks ?? []).map((task) => (
                <TaskItem key={task.uuid} task={task} onChange={refreshAll} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskSection;

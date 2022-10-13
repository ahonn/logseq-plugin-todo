import React, { useEffect, useMemo, useState } from 'react';
import {
  useRecoilRefresher_UNSTABLE,
  useRecoilValue,
  useRecoilValueLoadable,
} from 'recoil';
import { groupBy } from 'lodash-es';
import { TaskEntityObject } from '../models/TaskEntity';
import { tasksState } from '../state/tasks';
import { themeStyleState } from '../state/theme';
import { visibleState } from '../state/visible';
import TaskItem from './TaskItem';
import { settingsState } from '../state/settings';
import { openTaskPage } from '../api';

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
  const tasksLoadable = useRecoilValueLoadable(tasksState(query));
  const refresh = useRecoilRefresher_UNSTABLE(tasksState(query));
  const themeStyle = useRecoilValue(themeStyleState);
  const { openInRightSidebar } = useRecoilValue(settingsState);

  useEffect(() => {
    switch (tasksLoadable.state) {
      case 'hasValue':
        setTasks(tasksLoadable.contents);
        break;
      case 'hasError':
        throw tasksLoadable.contents;
    }
  }, [tasksLoadable.state, tasksLoadable.contents]);

  useEffect(() => {
    if (visible) {
      refresh();
    }
  }, [visible, refresh]);

  const taskGroups = useMemo(() => {
    switch (props.groupBy) {
      case GroupBy.Page:
        return groupBy(tasks, (task: TaskEntityObject) => task.page.name);
      default:
        return { '': tasks };
    }
  }, [props.groupBy, tasks]);

  if (tasks.length === 0) {
    return null;
  }

  return (
    <div className="py-1">
      <h2
        className="py-1 text-blue-400"
        style={{ color: themeStyle.sectionTitleColor }}
      >
        {title}
      </h2>
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
                <TaskItem key={task.uuid} task={task} onChange={refresh} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskSection;

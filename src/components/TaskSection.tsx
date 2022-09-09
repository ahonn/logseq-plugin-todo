import React, { useEffect, useState } from 'react';
import {
  useRecoilRefresher_UNSTABLE,
  useRecoilValue,
  useRecoilValueLoadable,
} from 'recoil';
import { TaskEntityObject } from '../models/TaskEntity';
import { tasksState } from '../state/tasks';
import { themeStyleState } from '../state/theme';
import { visibleState } from '../state/visible';
import TaskItem from './TaskItem';

export interface ITaskSectionProps {
  title: string;
  query: string;
}

const TaskSection: React.FC<ITaskSectionProps> = (props) => {
  const { title, query } = props;
  const [tasks, setTasks] = useState<TaskEntityObject[]>([]);
  const visible = useRecoilValue(visibleState);
  const tasksLoadable = useRecoilValueLoadable(tasksState(query));
  const refresh = useRecoilRefresher_UNSTABLE(tasksState(query));
  const themeStyle = useRecoilValue(themeStyleState);

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

  if (tasks.length === 0) {
    return null;
  }

  return (
    <div className="py-1">
      <h2
        className="py-1 text-blue-400"
        style={{
          color: themeStyle.sectionTitleColor,
        }}
      >
        {title}
      </h2>
      <div>
        {tasks.map((task) => (
          <TaskItem key={task.uuid} task={task} onChange={refresh} />
        ))}
      </div>
    </div>
  );
};

export default TaskSection;

import React, { useEffect } from 'react';
import { useRecoilRefresher_UNSTABLE, useRecoilValue } from 'recoil';
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
  const visible = useRecoilValue(visibleState);
  const tasks = useRecoilValue(tasksState(query));
  const refresh = useRecoilRefresher_UNSTABLE(tasksState(query));
  const themeStyle = useRecoilValue(themeStyleState);

  useEffect(() => {
    if (visible) {
      refresh();
    }
  }, [visible, refresh])

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
          <TaskItem key={task.uuid} item={task} onChange={refresh} />
        ))}
      </div>
    </div>
  );
};

export default TaskSection;

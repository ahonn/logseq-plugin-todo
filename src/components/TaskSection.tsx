import React from 'react';
import useThemeStyle from '../hooks/useThemeStyle';
import { TaskEntityObject } from '../models/TaskEntity';
import TaskItem from './TaskItem';

export interface ITaskSectionProps {
  title: string;
  tasks: TaskEntityObject[];
}

const TaskSection: React.FC<ITaskSectionProps> = (props) => {
  const { title, tasks } = props;
  const themeStyle = useThemeStyle();

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
          <TaskItem key={task.uuid} item={task} />
        ))}
      </div>
    </div>
  );
};

export default TaskSection;

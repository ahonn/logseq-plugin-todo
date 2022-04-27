import React from 'react';
import { TaskEntityObject } from '../models/TaskEntity';
import TaskItem from './TaskItem';

export interface ITaskSectionProps {
  title: string;
  tasks: TaskEntityObject[];
}

const TaskSection: React.FC<ITaskSectionProps> = (props) => {
  const { title, tasks } = props;

  if (tasks.length === 0) {
    return null;
  }

  return (
    <div className="py-1">
      <h2 className="py-1 text-red-500">{title}</h2>
      <div>
        {tasks.map((task) => (
          <TaskItem
            key={task.uuid}
            item={task}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskSection;

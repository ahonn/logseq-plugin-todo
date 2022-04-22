import React from 'react';
import Task from '../models/Task';
import TaskItem from './TaskItem';

export interface ITaskSectionProps {
  title: string;
  tasks: Task[];
  onTaskChange(task: Task): void;
}

const TaskSection: React.FC<ITaskSectionProps> = (props) => {
  const { title, tasks, onTaskChange } = props;

  return (
    <div>
      <h2 className="py-1 text-red-500 font-semibold">{title}</h2>
      <div>
        {tasks.map((task) => <TaskItem key={task.uuid} item={task} onChange={onTaskChange} />)}
      </div>
    </div>
  );
};

export default TaskSection;

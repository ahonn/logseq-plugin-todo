import React from 'react';
import useTaskQuery from '../hooks/useTaskQuery';
import TaskItem from './TaskItem';

export interface ITaskSectionProps {
  title: string;
  query: string;
}

const TaskSection: React.FC<ITaskSectionProps> = (props) => {
  const { title, query } = props;
  const { data: tasks, mutate } = useTaskQuery(query);

  if (tasks.length === 0) {
    return null;
  }

  const handleTaskChange = () => {
    mutate();
  };

  return (
    <div className="py-2">
      <h2 className="py-1 text-red-500 font-semibold">{title}</h2>
      <div>
        {tasks.map((task) => (
          <TaskItem
            key={task.uuid}
            item={task}
            onChange={handleTaskChange}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskSection;

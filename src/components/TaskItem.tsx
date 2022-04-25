import React from 'react';
import classnames from 'classnames';
import Checkbox from 'rc-checkbox';
import 'rc-checkbox/assets/index.css';
import Task from '../models/Task';

export interface ITaskItemProps {
  item: Task;
  onChange(task: Task): void;
}

const TaskItem: React.FC<ITaskItemProps> = (props) => {
  const { item: task, onChange } = props;
  const [checked, setChecked] = React.useState(task.isDone());

  const handleTaskChange = async () => {
    await task.toggle();
    setChecked(!checked);
    onChange(task);
  };

  const contentClassName = classnames(
    'flex-1 border-b pb-1 text-sm leading-normal',
    {
      'line-through': checked,
      'text-gray-400': checked,
    },
  );

  return (
    <div key={task.uuid} className="flex flex-row pb-1">
      <Checkbox
        checked={checked}
        onChange={handleTaskChange}
        className="py-1 mr-2"
      />
      <div className={contentClassName}>
        {task.content}
      </div>
    </div>
  );
};

export default TaskItem;

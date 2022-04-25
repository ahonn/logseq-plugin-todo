import React, { useEffect } from 'react';
import classnames from 'classnames';
import dayjs from 'dayjs';
import Checkbox from 'rc-checkbox';
import Task from '../models/Task';
import useUserConfigs from '../hooks/useUserConfigs';
import 'rc-checkbox/assets/index.css';

export interface ITaskItemProps {
  item: Task;
  onChange(task: Task): void;
}

const TaskItem: React.FC<ITaskItemProps> = (props) => {
  const { item: task, onChange } = props;
  const [checked, setChecked] = React.useState(task.isDone());
  const { preferredDateFormat } = useUserConfigs();

  const handleTaskChange = async () => {
    await task.toggle();
    setChecked(!checked);
    onChange(task);
  };

  const contentClassName = classnames(
    'flex-1 border-b border-gray-100 pb-2 pt-1 text-sm leading-normal',
    {
      'line-through': checked,
      'text-gray-400': checked,
    },
  );

  return (
    <div key={task.uuid} className="flex flex-row pb-1">
      <div>
        <Checkbox
          checked={checked}
          onChange={handleTaskChange}
          className="pt-1 mr-2"
        />
      </div>
      <div className={contentClassName}>
        <p>{task.content}</p>
        {task.scheduled && (
          <time className="text-xs text-gray-400">
            {dayjs(task.scheduled.toString(), 'YYYYMMDD').format(preferredDateFormat)}
          </time>
        )}
      </div>
    </div>
  );
};

export default TaskItem;

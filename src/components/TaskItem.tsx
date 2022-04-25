import React, { useEffect } from 'react';
import classnames from 'classnames';
import dayjs from 'dayjs';
import Checkbox from 'rc-checkbox';
import Task from '../models/Task';
import { InfoCircle } from 'tabler-icons-react';
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
  const [scheduled, setScheduled] = React.useState<Date | null>(null);

  useEffect(() => {
    task.getScheduledDate().then(setScheduled);
  }, [task]);

  const handleTaskChange = async () => {
    await task.toggle();
    setChecked(!checked);
    onChange(task);
  };

  const openTaskBlock = () => {
    window.logseq.Editor.openInRightSidebar(task.uuid);
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
        <div className="flex justify-between items-center">
          <div className="flex-col">
            <p>{task.content}</p>
            {scheduled && (
              <time className="text-xs text-gray-400">
                {dayjs(scheduled).format(preferredDateFormat)}
              </time>
            )}
          </div>
          <div className="px-1" onClick={openTaskBlock}>
            <InfoCircle size={20} className="stroke-gray-300 cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;

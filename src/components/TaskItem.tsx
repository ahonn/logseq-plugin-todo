import React, { useMemo } from 'react';
import classnames from 'classnames';
import dayjs from 'dayjs';
import Checkbox from 'rc-checkbox';
import { InfoCircle } from 'tabler-icons-react';
import useUserConfigs from '../hooks/useUserConfigs';
import useTask, { Task } from '../hooks/useTask';
import 'rc-checkbox/assets/index.css';

export interface ITaskItemProps {
  item: Task;
  onChange(task: Task): void;
}

const TaskItem: React.FC<ITaskItemProps> = (props) => {
  const { item: task, onChange } = props;
  const { preferredDateFormat } = useUserConfigs();
  const { uuid, isDone, scheduled, content, toggle } = useTask(task);
  const [checked, setChecked] = React.useState(isDone);

  const isExpiredTask = useMemo(() => {
    if (!scheduled) {
      return false;
    }
    const date = dayjs(scheduled.toString(), 'YYYYMMDD');
    return date.isBefore(dayjs(), 'day');
  }, [scheduled]);

  const handleTaskChange = async () => {
    await toggle();
    setChecked(!checked);
    onChange(task);
  };

  const openTaskBlock = () => {
    window.logseq.Editor.openInRightSidebar(uuid);
    window.logseq.hideMainUI();
  };

  const contentClassName = classnames({
    'line-through': checked,
    'text-gray-400': checked,
  });

  return (
    <div key={uuid} className="flex flex-row pb-1" data-uuid={uuid}>
      <div>
        <Checkbox
          checked={checked}
          onChange={handleTaskChange}
          className="pt-1 mr-2"
        />
      </div>
      <div className="flex-1 border-b border-gray-100 pb-2 pt-1 text-sm leading-normal">
        <div className="flex justify-between items-center">
          <div className="flex-col">
            <p className={contentClassName}>{content}</p>
            {scheduled && (
              <time
                className={classnames('text-xs', {
                  'text-gray-400': !isExpiredTask,
                  'text-red-400': isExpiredTask,
                })}
              >
                {dayjs(scheduled.toString(), 'YYYYMMDD').format(preferredDateFormat)}
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

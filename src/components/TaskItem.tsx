import React, { useMemo } from 'react';
import classnames from 'classnames';
import dayjs from 'dayjs';
import Checkbox from 'rc-checkbox';
import { ArrowDownCircle, BrightnessUp } from 'tabler-icons-react';
import useUserConfigs from '../hooks/useUserConfigs';
import useTask from '../hooks/useTask';
import { TaskEntityObject } from '../models/TaskEntity';
import 'rc-checkbox/assets/index.css';

export interface ITaskItemProps {
  item: TaskEntityObject;
}

const TaskItem: React.FC<ITaskItemProps> = (props) => {
  const { item } = props;
  const { preferredDateFormat } = useUserConfigs();
  const task = useTask(item);
  const [checked, setChecked] = React.useState(task.completed);

  const isExpiredTask = useMemo(() => {
    if (!task.scheduled) {
      return false;
    }
    const date = dayjs(task.scheduled.toString(), 'YYYYMMDD');
    return date.isBefore(dayjs(), 'day');
  }, [task.scheduled]);

  const handleTaskChange = async () => {
    await task.toggle();
    setChecked(!checked);
  };

  const openTaskBlock = () => {
    task.openTask();
    window.logseq.hideMainUI();
  };

  const contentClassName = classnames('line-clamp-3 cursor-pointer', {
    'line-through': checked,
    'text-gray-400': checked,
  });

  return (
    <div key={task.uuid} className="flex flex-row pb-1">
      <div>
        <Checkbox
          checked={checked}
          onChange={handleTaskChange}
          className="pt-1 mr-2"
        />
      </div>
      <div className="flex-1 border-b border-gray-100 pb-2 pt-1 text-sm leading-normal break-all">
        <div className="flex justify-between items-center">
          <div className="flex-col">
            <p className={contentClassName} onClick={openTaskBlock}>
              {task.content}
            </p>
            {task.scheduled && (
              <time
                className={classnames('text-xs', {
                  'text-gray-400': !isExpiredTask,
                  'text-red-400': isExpiredTask,
                })}
              >
                {dayjs(task.scheduled.toString(), 'YYYYMMDD').format(
                  preferredDateFormat,
                )}
              </time>
            )}
          </div>
          {task.isTodayScheduled ? (
            <div className="pl-2 pr-1" onClick={() => task.setScheduled(null)}>
              <ArrowDownCircle size={22} className="stroke-gray-300 cursor-pointer" />
            </div>
          ) : (
            <div className="pl-2 pr-1" onClick={() => task.setScheduled(new Date())}>
              <BrightnessUp size={22} className="stroke-gray-300 cursor-pointer" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;

import React, { useMemo } from 'react';
import classnames from 'classnames';
import dayjs from 'dayjs';
import Checkbox from 'rc-checkbox';
import { ArrowDownCircle, BrightnessUp } from 'tabler-icons-react';
import useTaskManager from '../hooks/useTaskManager';
import { TaskEntityObject, TaskMarker } from '../models/TaskEntity';
import 'rc-checkbox/assets/index.css';
import { useRecoilValue } from 'recoil';
import { userConfigsState } from '../state/user-configs';
import { themeStyleState } from '../state/theme';

export interface ITaskItemProps {
  item: TaskEntityObject;
  onChange(): void;
}

const TaskItem: React.FC<ITaskItemProps> = (props) => {
  const themeStyle = useRecoilValue(themeStyleState);
  const task = useTaskManager(props.item, props.onChange);
  const { preferredDateFormat, preferredWorkflow } = useRecoilValue(userConfigsState);
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

  const toggleMarker = () => {
    if (preferredWorkflow === 'now') {
      task.setMarker(
        task.marker === TaskMarker.NOW ? TaskMarker.LATER : TaskMarker.NOW,
      );
      return;
    }
    task.setMarker(
      task.marker === TaskMarker.TODO ? TaskMarker.DOING : TaskMarker.TODO,
    );
  };

  const contentClassName = classnames('mb-1 line-clamp-3 cursor-pointer', {
    'line-through': checked,
    'text-gray-400': checked,
  });

  return (
    <div
      key={task.uuid}
      className={`flex flex-row pb-1 dark:text-gray-100 priority-${task.priority.toLowerCase()}`}
    >
      <div>
        <Checkbox
          checked={checked}
          onChange={handleTaskChange}
          className="pt-1 mr-1"
        />
      </div>
      <div className="flex-1 border-b border-gray-100 dark:border-gray-400 pb-2 pt-1 text-sm leading-normal break-all">
        <div className="flex justify-between items-center">
          <div className="flex-col">
            <div className={contentClassName}>
              <span
                className="py-0.5 px-1 mr-1 text-xs font-gray-300 rounded"
                style={{ backgroundColor: themeStyle.secondaryBackgroundColor }}
                onClick={toggleMarker}
              >
                {task.marker}
              </span>
              <span onClick={openTaskBlock}>{task.content}</span>
            </div>
            <p>
              {task.scheduled && (
                <time
                  className={classnames('text-sm', {
                    'text-gray-400': !isExpiredTask,
                    'text-red-400': isExpiredTask,
                  })}
                >
                  {dayjs(task.scheduled.toString(), 'YYYYMMDD').format(
                    preferredDateFormat,
                  )}
                </time>
              )}
            </p>
          </div>
          {task.isToday ? (
            <div className="pl-2 pr-1" onClick={() => task.setScheduled(null)}>
              <ArrowDownCircle
                size={22}
                className={classnames('stroke-gray-300', {
                  'cursor-pointer': task.page.journalDay !== task.scheduled,
                  'cursor-not-allowed': task.page.journalDay === task.scheduled,
                })}
              />
            </div>
          ) : (
            <div
              className="pl-2 pr-1"
              onClick={() => task.setScheduled(new Date())}
            >
              <BrightnessUp
                size={22}
                className="stroke-gray-300 cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;

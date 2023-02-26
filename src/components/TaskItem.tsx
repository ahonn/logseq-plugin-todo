import React, { useMemo } from 'react';
import classnames from 'classnames';
import dayjs from 'dayjs';
import Checkbox from 'rc-checkbox';
import { ArrowDownCircle, BrightnessUp } from 'tabler-icons-react';
import { TaskEntityObject } from '../models/TaskEntity';
import 'rc-checkbox/assets/index.css';
import { useRecoilValue } from 'recoil';
import { userConfigsState } from '../state/user-configs';
import { themeStyleState } from '../state/theme';
import {
  isTodayTask,
  openTask,
  toggleTaskMarker,
  setTaskScheduled,
  toggleTaskStatus,
} from '../api';
import { settingsState } from '../state/settings';
import { fixPreferredDateFormat } from '../utils';

export interface ITaskItemProps {
  task: TaskEntityObject;
  onChange(): void;
}

const TaskItem: React.FC<ITaskItemProps> = (props) => {
  const { task, onChange } = props;
  const themeStyle = useRecoilValue(themeStyleState);
  const { preferredDateFormat, preferredTodo } = useRecoilValue(userConfigsState);
  const { openInRightSidebar } = useRecoilValue(settingsState);
  const [checked, setChecked] = React.useState(task.completed);

  const isExpiredTask = useMemo(() => {
    if (!task.scheduled) {
      return false;
    }
    const date = dayjs(task.scheduled.toString(), 'YYYYMMDD');
    return date.isBefore(dayjs(), 'day');
  }, [task.scheduled]);

  const openTaskBlock = () => {
    openTask(task, {
      openInRightSidebar,
    });
    window.logseq.hideMainUI();
  };

  const toggleStatus = async () => {
    await toggleTaskStatus(task, { marker: preferredTodo });
    setChecked(!checked);
  };

  const toggleMarker = () => {
    toggleTaskMarker(task, { marker: preferredTodo });
    onChange();
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
          onChange={toggleStatus}
          className="pt-1 mr-1"
        />
      </div>
      <div className="flex-1 border-b border-gray-100 dark:border-gray-400 pb-2 pt-1 text-sm leading-normal break-all">
        <div className="flex justify-between items-center">
          <div className="flex-col">
            <div className={contentClassName}>
              <span
                className="py-0.5 px-1 mr-1 text-xs text-gray-600 dark:text-gray-400 rounded"
                style={{ backgroundColor: themeStyle.secondaryBackgroundColor }}
                onClick={toggleMarker}
              >
                {task.marker}
              </span>
              <span className="text-gray-700 dark:text-gray-300" onClick={openTaskBlock}>
                {task.content}
              </span>
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
                    fixPreferredDateFormat(preferredDateFormat!),
                  )}
                </time>
              )}
            </p>
          </div>
          {isTodayTask(task) ? (
            <div
              className="pl-2 pr-1"
              onClick={() => {
                setTaskScheduled(task, null)
                onChange();
              }}
            >
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
              onClick={() => {
                setTaskScheduled(task, new Date());
                onChange();
              }}
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

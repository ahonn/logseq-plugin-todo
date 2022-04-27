import dayjs from 'dayjs';
import { useCallback, useMemo } from 'react';
import { TaskEntityObject, TaskMarker } from '../models/TaskEntity';
import useAppState from './useAppState';

const useTask = (task: TaskEntityObject) => {
  const { uuid, marker, scheduled, completed, page } = task;
  const { userConfigs, refresh } = useAppState();
  const { preferredTodo } = userConfigs;

  const isTodayScheduled = useMemo(() => {
    if (!scheduled) return false;
    return dayjs(new Date()).format('YYYYMMDD') === scheduled.toString();
  }, [scheduled]);

  const content = useMemo(() => {
    let content = task.content;
    content = content.replace(task.marker, '');
    content = content.replace(/SCHEDULED: <[^>]+>/, '');
    content = content.replace(/DEADLINE: <[^>]+>/, '');
    content = content.replace(/(:LOGBOOK:)|(\*\s.*)|(:END:)|(CLOCK:.*)/gm, '');
    return content.trim();
  }, [task]);

  const toggle = useCallback(async () => {
    const nextMarker = completed ? preferredTodo : TaskMarker.DONE;
    await window.logseq.Editor.updateBlock(
      uuid,
      task.content.replace(marker, nextMarker),
    );
    refresh();
  }, [completed, preferredTodo, task, refresh]);

  const openTask = useCallback(async () => {
    window.logseq.Editor.scrollToBlockInPage(task.page.uuid, uuid);
  }, [uuid]);

  const setScheduled = useCallback(async (date: Date | null) => {
    let nextContent = task.content;
    if (date === null) {
      nextContent = task.content.replace(/SCHEDULED: <[^>]+>/, '');
      await window.logseq.Editor.updateBlock(uuid, nextContent);
      refresh();
      return;
    }

    const scheduledString = `SCHEDULED: <${dayjs(date).format('YYYY-MM-DD ddd')}>`;
    if (task.content.includes('SCHEDULED')) {
      nextContent = task.content.replace(
        /SCHEDULED: <[^>]+>/,
        scheduledString,
      );
    } else {
      const lines = task.content.split('\n');
      lines.splice(1, 0, scheduledString);
      nextContent = lines.join('\n');
    }

    await window.logseq.Editor.updateBlock(uuid, nextContent);
    refresh();
  }, [task, refresh]);

  return {
    uuid,
    marker,
    content,
    scheduled,
    completed,
    page,
    isTodayScheduled,
    toggle,
    openTask,
    setScheduled,
  };
};

export default useTask;

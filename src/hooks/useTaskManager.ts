import dayjs from 'dayjs';
import { useCallback, useMemo } from 'react';
import { TaskEntityObject, TaskMarker } from '../models/TaskEntity';
import useAppState from './useAppState';

const useTaskManager = (task: TaskEntityObject) => {
  const { uuid, marker, scheduled, completed } = task;
  const { userConfigs, refresh } = useAppState();
  const { preferredTodo } = userConfigs;

  const isToday = useMemo(() => {
    if (!scheduled) return false;
    return dayjs(new Date()).format('YYYYMMDD') === scheduled.toString();
  }, [scheduled]);

  const toggle = useCallback(async () => {
    const nextMarker = completed ? preferredTodo : TaskMarker.DONE;
    await window.logseq.Editor.updateBlock(
      uuid,
      task.rawContent.replace(marker, nextMarker),
    );
    refresh();
  }, [completed, preferredTodo, task, refresh]);

  const openTask = useCallback(async () => {
    window.logseq.Editor.scrollToBlockInPage(task.page.uuid, uuid);
  }, [uuid]);

  const setMarker = useCallback(async (newMarker: TaskMarker) => {
    console.log('setMarker', newMarker);
    const nextContent = task.rawContent.replace(new RegExp(`^${marker}`), newMarker);
    await window.logseq.Editor.updateBlock(uuid, nextContent);
    refresh();
  }, [uuid])

  const setScheduled = useCallback(async (date: Date | null) => {
    let nextContent = task.rawContent;
    if (date === null) {
      nextContent = task.rawContent.replace(/SCHEDULED: <[^>]+>/, '');
      await window.logseq.Editor.updateBlock(uuid, nextContent);
      refresh();
      return;
    }

    const scheduledString = `SCHEDULED: <${dayjs(date).format('YYYY-MM-DD ddd')}>`;
    if (task.rawContent.includes('SCHEDULED')) {
      nextContent = task.rawContent.replace(
        /SCHEDULED: <[^>]+>/,
        scheduledString,
      );
    } else {
      const lines = task.rawContent.split('\n');
      lines.splice(1, 0, scheduledString);
      nextContent = lines.join('\n');
    }

    await window.logseq.Editor.updateBlock(uuid, nextContent);
    refresh();
  }, [task, refresh]);

  return {
    ...task,
    isToday,
    toggle,
    openTask,
    setMarker,
    setScheduled,
  };
};

export default useTaskManager;

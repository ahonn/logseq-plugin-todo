import dayjs from 'dayjs';
import { useCallback, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { TaskEntityObject, TaskMarker } from '../models/TaskEntity';
import { userConfigsState } from '../state/user-configs';

const useTaskManager = (task: TaskEntityObject, onChange: () => void) => {
  const { uuid, marker, scheduled, completed } = task;
  const { preferredTodo } = useRecoilValue(userConfigsState);

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
    onChange();
  }, [completed, preferredTodo, task, onChange]);

  const openTask = useCallback(async () => {
    window.logseq.Editor.scrollToBlockInPage(task.page.uuid, uuid);
  }, [uuid]);

  const setMarker = useCallback(async (newMarker: TaskMarker) => {
    const nextContent = task.rawContent.replace(new RegExp(`^${marker}`), newMarker);
    await window.logseq.Editor.updateBlock(uuid, nextContent);
    onChange();
  }, [uuid])

  const setScheduled = useCallback(async (date: Date | null) => {
    let nextContent = task.rawContent;
    if (date === null) {
      nextContent = task.rawContent.replace(/SCHEDULED: <[^>]+>/, '');
      await window.logseq.Editor.updateBlock(uuid, nextContent);
      onChange();
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
    onChange();
  }, [task, onChange]);

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

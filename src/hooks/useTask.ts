import { useCallback, useMemo } from 'react';
import { TaskEntityObject, TaskMarker } from '../models/TaskEntity';
import useUserConfigs from './useUserConfigs';

const useTask = (task: TaskEntityObject) => {
  const { uuid, marker, scheduled, completed } = task;
  const { preferredTodo } = useUserConfigs();

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
  }, [completed, preferredTodo, task]);

  return {
    uuid,
    marker,
    content,
    scheduled,
    completed,
    toggle,
  };
};

export default useTask;

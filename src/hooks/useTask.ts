import { BlockEntity } from '@logseq/libs/dist/LSPlugin.user';
import { useCallback, useMemo } from 'react';
import useUserConfigs from './useUserConfigs';

export type Task = BlockEntity;

export enum TaskMarker {
  LATER = 'LATER',
  NOW = 'NOW',
  TODO = 'TODO',
  DONE = 'DONE',
}

const useTask = (task: Task) => {
  const { uuid, marker, scheduled } = task;
  const { preferredTodo } = useUserConfigs();

  const content = useMemo(() => {
    let content = task.content;
    content = content.replace(task.marker, '');
    content = content.replace(/SCHEDULED: <[^>]+>/, '');
    content = content.replace(/DEADLINE: <[^>]+>/, '');
    content = content.replace(/(:LOGBOOK:)|(\*\s.*)|(:END:)|(CLOCK:.*)/gm, '');
    return content.trim();
  }, [task]);

  const isDone = useMemo(() => task.marker === TaskMarker.DONE, [task]);

  const toggle = useCallback(async () => {
    const nextMarker = isDone ? preferredTodo : TaskMarker.DONE;
    await window.logseq.Editor.updateBlock(
      uuid,
      task.content.replace(task.marker, nextMarker),
    );
  }, [isDone, preferredTodo, task]);

  return {
    uuid,
    marker,
    content,
    scheduled,
    isDone,
    toggle,
  };
};

export default useTask;

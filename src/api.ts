import dayjs from 'dayjs';
import { TaskEntityObject, TaskMarker } from './models/TaskEntity';

export function isTodayTask(task: TaskEntityObject) {
  const { scheduled } = task;
  if (!scheduled) return false;
  return dayjs(new Date()).format('YYYYMMDD') === scheduled.toString();
}

export interface IToggleOptions {
  preferredTodo: string;
}

export async function toggleTaskStatus(
  task: TaskEntityObject,
  options: IToggleOptions,
) {
  const { uuid, completed, marker } = task;
  const nextMarker = completed ? options.preferredTodo : TaskMarker.DONE;
  await window.logseq.Editor.updateBlock(
    uuid,
    task.rawContent.replace(marker, nextMarker),
  );
}

export function openTask(task: TaskEntityObject) {
  const { uuid } = task;
  return window.logseq.Editor.scrollToBlockInPage(task.page.uuid, uuid);
}

export async function toggleTaskMarker(task: TaskEntityObject, options: IToggleOptions) {
  const { uuid, rawContent, marker } = task;
  let newMarker = marker === TaskMarker.TODO ? TaskMarker.DOING : TaskMarker.TODO;
  if (options.preferredTodo === TaskMarker.LATER) {
    newMarker = marker === TaskMarker.LATER ? TaskMarker.NOW : TaskMarker.LATER;
  }
  const newRawContent = rawContent.replace(new RegExp(`^${marker}`), newMarker);
  await window.logseq.Editor.updateBlock(uuid, newRawContent);
}

export async function setTaskScheduled(task: TaskEntityObject, date: Date | null) {
  const { uuid, rawContent } = task;
  let newRawContent = task.rawContent;
  if (date === null) {
    newRawContent = rawContent.replace(/SCHEDULED: <[^>]+>/, '');
    await window.logseq.Editor.updateBlock(uuid, newRawContent);
    return;
  }

  const scheduledString = `SCHEDULED: <${dayjs(date).format('YYYY-MM-DD ddd')}>`;
  if (rawContent.includes('SCHEDULED')) {
    newRawContent = rawContent.replace(
      /SCHEDULED: <[^>]+>/,
      scheduledString,
    );
  } else {
    // FIXME: 多行文本会有问题
    const lines = rawContent.split('\n');
    lines.splice(1, 0, scheduledString);
    newRawContent = lines.join('\n');
  }

  await window.logseq.Editor.updateBlock(uuid, newRawContent);
}

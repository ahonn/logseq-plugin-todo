import { BlockEntity } from '@logseq/libs/dist/LSPlugin.user';
import dayjs from 'dayjs';
import { TaskEntityObject, TaskMarker } from './models/TaskEntity';

export const MARKER_GROUPS: Record<string, TaskMarker[]> = {
  [TaskMarker.TODO]: [TaskMarker.TODO, TaskMarker.DOING, TaskMarker.DONE],
  [TaskMarker.LATER]: [TaskMarker.LATER, TaskMarker.NOW, TaskMarker.DONE],
};

export interface ITaskOptions {
  preferredTodo: string;
  whereToPlaceNewTask?: string;
}

export function isTodayTask(task: TaskEntityObject) {
  const { scheduled } = task;
  if (!scheduled) return false;
  return dayjs(new Date()).format('YYYYMMDD') === scheduled.toString();
}

export async function createNewTask(
  date: string,
  content: string,
  opts: ITaskOptions,
) {
  const { preferredTodo, whereToPlaceNewTask } = opts;
  let page = await window.logseq.Editor.getPage(date);
  if (page === null) {
    page = await window.logseq.Editor.createPage(date, {
      journal: true,
      redirect: false,
    });
  }
  const blocksTree = await window.logseq.Editor.getPageBlocksTree(date);

  if (whereToPlaceNewTask) {
    let parentBlock = blocksTree.find((block: BlockEntity) => block.content === whereToPlaceNewTask);
    if (parentBlock === undefined) {
      parentBlock = (await window.logseq.Editor.appendBlockInPage(
        page!.name,
        whereToPlaceNewTask,
      )) as BlockEntity;
    }
    await window.logseq.Editor.insertBlock(
      parentBlock!.uuid,
      `${preferredTodo} ${content}`,
    );
  } else {
    await window.logseq.Editor.appendBlockInPage(
      page!.name,
      `${preferredTodo} ${content}`,
    );
  }

  if (blocksTree.length === 1 && blocksTree[0].content === '') {
    await window.logseq.Editor.removeBlock(blocksTree[0].uuid);
  }

  window.logseq.Editor.exitEditingMode(true);
}

export async function toggleTaskStatus(
  task: TaskEntityObject,
  options: ITaskOptions,
) {
  const { uuid, completed, marker } = task;
  const nextMarker = completed ? options.preferredTodo : TaskMarker.DONE;
  await window.logseq.Editor.updateBlock(
    uuid,
    task.rawContent.replace(marker, nextMarker),
  );
}

interface IOpenTaskOptions {
  openInRightSidebar?: boolean;
}

export function openTask(task: TaskEntityObject, opts?: IOpenTaskOptions) {
  const { uuid } = task;
  if (opts?.openInRightSidebar) {
    return window.logseq.Editor.openInRightSidebar(uuid);
  }
  return window.logseq.Editor.scrollToBlockInPage(task.page.name, uuid);
}

export function openTaskPage(
  page: TaskEntityObject['page'],
  opts?: IOpenTaskOptions,
) {
  if (opts?.openInRightSidebar) {
    return window.logseq.Editor.openInRightSidebar(page.uuid);
  }
  return window.logseq.Editor.scrollToBlockInPage(page.name, page.uuid);
}

export async function toggleTaskMarker(
  task: TaskEntityObject,
  options: ITaskOptions,
) {
  const { uuid, rawContent, marker } = task;

  let newMarker = marker;
  if (marker === TaskMarker.WAITING) {
    newMarker =
      options.preferredTodo === TaskMarker.LATER
        ? TaskMarker.LATER
        : TaskMarker.TODO;
  } else {
    const markerGroup = MARKER_GROUPS[options.preferredTodo];
    const currentMarkIndex = markerGroup.findIndex((m) => m === marker);
    newMarker = markerGroup[(currentMarkIndex + 1) % markerGroup.length];
  }

  const newRawContent = rawContent.replace(new RegExp(`^${marker}`), newMarker);
  await window.logseq.Editor.updateBlock(uuid, newRawContent);
}

export async function setTaskScheduled(
  task: TaskEntityObject,
  date: Date | null,
) {
  const { uuid, rawContent } = task;
  let newRawContent = task.rawContent;
  if (date === null) {
    newRawContent = rawContent.replace(/SCHEDULED: <[^>]+>/, '');
    await window.logseq.Editor.updateBlock(uuid, newRawContent);
    return;
  }

  const scheduledString = `SCHEDULED: <${dayjs(date).format(
    'YYYY-MM-DD ddd',
  )}>`;
  if (rawContent.includes('SCHEDULED')) {
    newRawContent = rawContent.replace(/SCHEDULED: <[^>]+>/, scheduledString);
  } else {
    const lines = rawContent.split('\n');
    lines.splice(1, 0, scheduledString);
    newRawContent = lines.join('\n');
  }

  await window.logseq.Editor.updateBlock(uuid, newRawContent);
}

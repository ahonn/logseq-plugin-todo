import { BlockEntity, PageEntity } from '@logseq/libs/dist/LSPlugin';
import { selectorFamily } from 'recoil';
import TaskEntity, { TASK_PRIORITY_WEIGHT } from '../models/TaskEntity';
import { getBlockUUID } from '../utils';

async function getTaskEntitiesByQuery(query: string) {
  const collections = await window.logseq.DB.datascriptQuery<BlockEntity[][]>(
    query,
  );
  const tasks = await Promise.all(
    (collections ?? []).map(async ([item]) => {
      const uuid = getBlockUUID(item);
      const block = await window.logseq.Editor.getBlock(uuid, {
        includeChildren: true,
      });
      if (block === undefined) {
        return null;
      }

      const page = await window.logseq.Editor.getPage(
        (block?.page as PageEntity).name,
      );
      return new TaskEntity(block!, page!);
    }),
  );

  return (
    tasks
      // @ts-ignore
      .filter((task) => {
        return task && !task.getPageProperty('todoIgnore');
      })
      .map((task) => task!.toObject())
      .sort((a, b) => {
        if (a.scheduled === b.scheduled) {
          return (
            TASK_PRIORITY_WEIGHT[b.priority] - TASK_PRIORITY_WEIGHT[a.priority]
          );
        }
        return b.scheduled - a.scheduled;
      })
  );
}

export const tasksState = selectorFamily({
  key: 'tasks',
  get: (query: string) => () => getTaskEntitiesByQuery(query),
  cachePolicy_UNSTABLE: {
    eviction: 'most-recent',
  },
});

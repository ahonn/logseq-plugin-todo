import { BlockEntity, PageEntity } from '@logseq/libs/dist/LSPlugin.user';
import useSwr from 'swr';
import TaskEntity, { TASK_PRIORITY_WEIGHT } from '../models/TaskEntity';
import { getBlockUUID } from '../utils';

const useTaskQuery = (query: string) => {
  const { data, error, mutate } = useSwr(query, async (query) => {
    const collections = await window.logseq.DB.datascriptQuery<BlockEntity[][]>(query);
    const tasks = await Promise.all(
      collections.map(async ([item]) => {
        const uuid = getBlockUUID(item);
        const block = await window.logseq.Editor.getBlock(uuid, {
          includeChildren: true,
        });
        const page = await window.logseq.Editor.getPage(
          (block?.page as PageEntity).name,
        );
        return new TaskEntity(block!, page!);
      }),
    );

    return (
      tasks
        // @ts-ignore
        .filter((task) => !task.getPageProperty('todoIgnore'))
        .map((task) => task.toObject())
        .sort((a, b) => {
          console.log(a, b);
          if (a.scheduled === b.scheduled) {
            return TASK_PRIORITY_WEIGHT[b.priority] - TASK_PRIORITY_WEIGHT[a.priority];
          }
          return b.scheduled - a.scheduled;
        })
    );
  });

  return {
    data: data ?? [],
    error,
    mutate,
  };
};

export default useTaskQuery;

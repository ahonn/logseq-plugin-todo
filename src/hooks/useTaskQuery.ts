import { BlockEntity, PageEntity } from '@logseq/libs/dist/LSPlugin.user';
import useSwr from 'swr';
import TaskEntity from '../models/TaskEntity';
import { getBlockUUID } from '../utils';

const useTaskQuery = (query: string) => {
  const { data, error, mutate } = useSwr(query, async (query) => {
    const collections = await window.logseq.DB.datascriptQuery<BlockEntity[][]>(query);
    const tasks = await Promise.all(
      collections.map(async ([item]) => {
        const uuid = getBlockUUID(item);
        const block = await window.logseq.Editor.getBlock(uuid, { includeChildren: true });
        const page = await window.logseq.Editor.getPage((block?.page as PageEntity).name);
        return new TaskEntity(block!, page!);
      }),
    );
    return (
      tasks
        // @ts-ignore
        .filter((task) => !task.getPageProperty('todoIgnore'))
        .sort((a, b) => b.scheduled - a.scheduled)
        .map((task) => task.toObject())
    );
  });

  return {
    data: data ?? [],
    error,
    mutate,
  };
};

export default useTaskQuery;

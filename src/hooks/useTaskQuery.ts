import { BlockEntity, PageEntity } from '@logseq/libs/dist/LSPlugin.user';
import useSwr from 'swr';

export function getBlockUUID(block: BlockEntity) {
  if (typeof block.uuid === 'string') {
    return block.uuid;
  }
  // @ts-ignore
  return block.uuid.$uuid$;
}

const useTaskQuery = (query: string) => {
  const { data, error, mutate } = useSwr(query, async (query) => {
    const collections = await window.logseq.DB.datascriptQuery<BlockEntity[][]>(query);
    const tasks = await Promise.all(
      collections.map(async ([block]) => {
        const uuid = getBlockUUID(block);
        const taskBlock = await window.logseq.Editor.getBlock(uuid, { includeChildren: true });
        const scheduled = taskBlock?.scheduled ?? taskBlock?.deadline ?? (taskBlock?.page as PageEntity)?.journalDay;
        return {
          ...taskBlock,
          scheduled,
        } as BlockEntity;
      }),
    );
    return tasks.sort((a, b) => b.scheduled - a.scheduled);
  });

  return {
    data: data ?? [],
    error,
    mutate,
  };
};

export default useTaskQuery;

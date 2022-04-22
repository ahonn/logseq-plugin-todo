import { BlockEntity } from '@logseq/libs/dist/LSPlugin.user';
import useSwr from 'swr';
import Task from '../models/Task';

const useTaskQuery = (query: string) => {
  const { data, error, mutate } = useSwr(query, async (query) => {
    const collections = await window.logseq.DB.datascriptQuery<BlockEntity[][]>(query);
    return collections.map(([block]) => new Task(block));
  });

  return {
    data: data ?? [],
    error,
    mutate,
  };
};

export default useTaskQuery;

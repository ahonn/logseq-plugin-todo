import dayjs, { Dayjs } from 'dayjs';

export default function getScheduledTaskQuery(
  treatJournalEntriesAsScheduled = true,
  startDate: Dayjs | Date = new Date(),
) {
  const start = dayjs(startDate).format('YYYYMMDD');

  const journalEntryCond = treatJournalEntriesAsScheduled ? `
  (and
         [?p :block/journal? true]
         [?p :block/journal-day ?d])` : '';

  const query = `
    [:find (pull ?b [*])
     :where
     [?b :block/marker ?marker]
     [(contains? #{"NOW" "LATER" "TODO" "DOING"} ?marker)]
     [?b :block/page ?p]
     (or
       (or
         [?b :block/scheduled ?d]
         [?b :block/deadline ?d])
       ${journalEntryCond})
     [(> ?d ${start})]]
  `;

  return query;
}

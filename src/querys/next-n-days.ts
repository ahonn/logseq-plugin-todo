import dayjs from 'dayjs';

export default function getNextNDaysTaskQuery(days: number) {
  const start = dayjs().format('YYYYMMDD');
  const next = dayjs().add(days, 'd').format('YYYYMMDD');

  const query = `
    [:find (pull ?b [*])
     :where
     [?b :block/marker ?marker]
     [(contains? #{"NOW" "LATER" "TODO" "DOING" "WAITING"} ?marker)]
     [?b :block/page ?p]
     (or
       [?b :block/scheduled ?d]
       [?b :block/deadline ?d])
     [(> ?d ${start})]]
     [(> ?d ${next})]]
  `;
  return query;
}

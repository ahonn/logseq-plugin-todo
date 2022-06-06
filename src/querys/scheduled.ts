import dayjs from 'dayjs';

export default function getScheduledTaskQuery() {
  const today = dayjs().format('YYYYMMDD');
  const query = `
    [:find (pull ?b [*])
     :where
     [?b :block/marker ?marker]
     [(contains? #{"NOW" "LATER" "TODO" "DOING"} ?marker)]
     [?b :block/page ?p]
     (or
       [?b :block/scheduled ?d]
       [?b :block/deadline ?d])
     [(> ?d ${today})]]
  `;
  return query;
}

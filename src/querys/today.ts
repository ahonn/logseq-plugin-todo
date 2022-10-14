import dayjs from 'dayjs';

export default function getTodayTaskQuery() {
  const today = dayjs().format('YYYYMMDD');
  const query = `
    [:find (pull ?b [*])
     :where
     [?b :block/marker ?marker]
     [(contains? #{"NOW" "LATER" "TODO" "DOING" "WAITING"} ?marker)]
     [?b :block/page ?p]
     (or
       (and
        [?p :block/journal? true]
        [?p :block/journal-day ?d]
        (not [?b :block/scheduled])
        (not [?b :block/deadline])
        [(<= ?d ${today})])
       (and
        (or
          [?b :block/scheduled ?d]
          [?b :block/deadline ?d])
        [(<= ?d ${today})]))]
  `;
  return query;
}

import dayjs from 'dayjs';

export default function getNextNDaysTaskQuery(
  days: number,
  customMarkers: string[] = [],
) {
  const start = dayjs().format('YYYYMMDD');
  const next = dayjs().add(days, 'd').format('YYYYMMDD');
  const markers = customMarkers.map((m) => '"' + m + '"').join(' ');

  const query = `
    [:find (pull ?b [*])
     :where
     [?b :block/marker ?marker]
     [(contains? #{"NOW" "LATER" "TODO" "DOING" ${markers}} ?marker)]
     [?b :block/page ?p]
     (or
       [?b :block/scheduled ?d]
       [?b :block/deadline ?d])
     [(> ?d ${start})]]
     [(> ?d ${next})]]
  `;
  return query;
}

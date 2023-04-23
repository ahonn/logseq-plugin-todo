import dayjs, { Dayjs } from 'dayjs';

export default function getScheduledTaskQuery(
  startDate: Dayjs | Date = new Date(),
  customMarkers: string[] = [],
) {
  const start = dayjs(startDate).format('YYYYMMDD');
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
  `;

  return query;
}

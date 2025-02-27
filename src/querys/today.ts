import dayjs from 'dayjs';

export default function getTodayTaskQuery(
  customMarkers: string[] = [],
  treatJournalEntriesAsScheduled = true,
) {
  const today = dayjs().format('YYYYMMDD');
  const markers = customMarkers.map((m) => '"' + m + '"').join(' ');

  const journalEntryCond = treatJournalEntriesAsScheduled ? `
   (and
    [(contains? #{"NOW" "LATER" "TODO" "DOING"} ?marker)]
    [?p :block/journal? true]
    [?p :block/journal-day ?d]
    (not [?b :block/scheduled])
    (not [?b :block/deadline])
    [(<= ?d ${today})])
  ` : '';

  const customMarkerCond = customMarkers.length > 0 ? `
   (and
    [(contains? #{${markers}} ?marker)]
    (or
      [?b :block/scheduled ?d]
      [?b :block/deadline ?d])
    [(<= ?d ${today})])
  ` : '';

  const query = `
    [:find (pull ?b [*])
     :where
     [?b :block/marker ?marker]
     [?b :block/page ?p]
     (or
       (and
        [(contains? #{"NOW" "LATER" "TODO" "DOING"} ?marker)]
        (or
          [?b :block/scheduled ?d]
          [?b :block/deadline ?d])
        [(<= ?d ${today})])
       ${journalEntryCond}
       ${customMarkerCond})]
  `;

  return query;
}


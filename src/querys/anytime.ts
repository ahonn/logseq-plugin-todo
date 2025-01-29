export default function getAnytimeTaskQuery(
  customMarkers: string[] = [],
  treatJournalEntriesAsScheduled = true,
) {
  const markers = customMarkers.map((m) => '"' + m + '"').join(' ');
  const excludeJournalEntries = treatJournalEntriesAsScheduled ? `
   (not [?p :block/journal? true])
   (not [?p :block/journalDay])
  ` : '';
  const cond =
    customMarkers.length > 0
      ? `
    (or
     (and
      [(contains? #{"NOW" "LATER" "TODO" "DOING"} ?marker)]
      [?b :block/page ?p]
      ${excludeJournalEntries}
      (not [?b :block/scheduled])
      (not [?b :block/deadline]))
     (and
      [(contains? #{${markers}} ?marker)]
        [?b :block/page ?p]
        ${excludeJournalEntries}
        (not [?b :block/scheduled])
        (not [?b :block/deadline])))
  `
      : `
    [(contains? #{"NOW" "LATER" "TODO" "DOING"} ?marker)]
    [?b :block/page ?p]
    ${excludeJournalEntries}
    (not [?b :block/scheduled])
    (not [?b :block/deadline])
  `;

  const query = `
    [:find (pull ?b [*])
     :where
     [?b :block/marker ?marker]
     ${cond}]
  `;
  return query;
}

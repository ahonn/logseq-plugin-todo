export default function getAnytimeTaskQuery(customMarkers: string[] = []) {
  const markers = customMarkers.map((m) => '"' + m + '"').join(' ');
  const cond =
    customMarkers.length > 0
      ? `
    (or
     (and
      [(contains? #{"NOW" "LATER" "TODO" "DOING"} ?marker)]
      [?b :block/page ?p]
      (not [?p :block/journal? true])
      (not [?p :block/journalDay])
      (not [?b :block/scheduled])
      (not [?b :block/deadline]))
     (and
      [(contains? #{${markers}} ?marker)]
        [?b :block/page ?p]
        (not [?b :block/scheduled])
        (not [?b :block/deadline])))
  `
      : `
    [(contains? #{"NOW" "LATER" "TODO" "DOING"} ?marker)]
    [?b :block/page ?p]
    (not [?p :block/journal? true])
    (not [?p :block/journalDay])
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

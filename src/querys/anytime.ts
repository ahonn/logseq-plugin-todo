export default function getAnytimeTaskQuery() {
  const query = `
    [:find (pull ?b [*])
     :where
     [?b :block/marker ?marker]
     [(contains? #{"NOW" "LATER" "TODO"} ?marker)]
     [?b :block/page ?p]
     (not [?p :block/journal? true])]
     (not [?b :block/scheduled])
     (not [?b :block/deadline])]
  `;
  return query;
}

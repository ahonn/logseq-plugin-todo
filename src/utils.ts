import { BlockEntity } from "@logseq/libs/dist/LSPlugin";

export function getBlockUUID(block: BlockEntity) {
  if (typeof block.uuid === 'string') {
    return block.uuid;
  }
  // @ts-ignore
  return block.uuid.$uuid$;
}

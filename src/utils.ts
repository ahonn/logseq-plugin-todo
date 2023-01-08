import { BlockEntity } from "@logseq/libs/dist/LSPlugin";

export function getBlockUUID(block: BlockEntity) {
  if (typeof block.uuid === 'string') {
    return block.uuid;
  }
  // @ts-ignore
  return block.uuid.$uuid$;
}

export function fixPreferredDateFormat(preferredDateFormat: string) {
  const format = preferredDateFormat
    .replace('yyyy', 'YYYY')
    .replace('dd', 'DD')
    .replace('do', 'Do')
    .replace('EEEE', 'dddd')
    .replace('EEE', 'ddd')
    .replace('EE', 'dd')
    .replace('E', 'dd');
  return format;
}

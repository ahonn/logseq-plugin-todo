import { BlockEntity } from '@logseq/libs/dist/LSPlugin';

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

// https://github.com/logseq/logseq/blob/master/libs/src/helpers.ts#L122
export function isValidUUID(s: string) {
  return (
    typeof s === 'string' &&
    s.length === 36 &&
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi.test(
      s,
    )
  );
}

import { BlockEntity } from '@logseq/libs/dist/LSPlugin';
import dayjs, { Dayjs } from 'dayjs';

export enum TaskMarker {
  LATER = 'LATER',
  NOW = 'NOW',
  TODO = 'TODO',
  DONE = 'DONE',
}

class Task {
  private block: BlockEntity;

  constructor(block: BlockEntity) {
    this.block = block;
  }

  public static getTodayTaskQuery(): string {
    const today = dayjs().format('YYYYMMDD');
    const query = `
      [:find (pull ?b [*])
       :where
       [?b :block/marker ?marker]
       [(contains? #{"NOW" "LATER" "TODO" "DONE"} ?marker)]
       [?b :block/page ?p]
       (or
         (and
          [?p :block/journal? true]
          [?p :block/journal-day ?d]
          (not [?b :block/scheduled])
          (not [?b :block/deadline])
          [(= ?d ${today})])
         (and
          (or
            [?b :block/scheduled ?d]
            [?b :block/deadline ?d])
          [(= ?d ${today})]))]
    `;
    return query;
  }

  public static getExpiredTaskQuery(): string {
    const today = dayjs().format('YYYYMMDD');
    const query = `
      [:find (pull ?b [*])
       :where
       [?b :block/marker ?marker]
       [(contains? #{"NOW" "LATER" "TODO"} ?marker)]
       [?b :block/page ?p]
       (or
         (and
          [?p :block/journal? true]
          [?p :block/journal-day ?d]
          [(< ?d ${today})])
         (and
          (or
            [?b :block/scheduled ?d]
            [?b :block/deadline ?d])
          [(< ?d ${today})]))]
    `;
    return query;
  }

  public static getScheduledTaskQuery(): string {
    const today = dayjs().format('YYYYMMDD');
    const query = `
      [:find (pull ?b [*])
       :where
       [?b :block/marker ?marker]
       [(contains? #{"NOW" "LATER" "TODO"} ?marker)]
       [?b :block/page ?p]
       (or
         [?b :block/scheduled ?d]
         [?b :block/deadline ?d])
       [(> ?d ${today})]]
    `;
    return query;
  }

  public static getNoScheduledTaskQuery(): string {
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

  public get uuid(): string {
    if (typeof this.block.uuid === 'string') {
      return this.block.uuid;
    }
    // @ts-ignore
    return this.block.uuid.$uuid$;
  }

  public get content(): string {
    let content = this.block.content;
    content = content.replace(this.marker, '');
    content = content.replace(/SCHEDULED: <[^>]+>/, '');
    content = content.replace(/DEADLINE: <[^>]+>/, '');
    content = content.replace(/(:LOGBOOK:)|(\*\s.*)|(:END:)|(CLOCK:.*)/gm, '');
    return content.trim();
  }

  public get marker(): TaskMarker {
    return this.block.marker;
  }

  public get scheduled(): Dayjs {
    return this.block.scheduled;
  }

  public isDone(): boolean {
    return this.block.marker === TaskMarker.DONE;
  }

  public async toggle(): Promise<void> {
    const nextMarker = this.isDone() ? TaskMarker.LATER : TaskMarker.DONE;
    await window.logseq.Editor.updateBlock(
      this.uuid,
      this.block.content.replace(this.marker, nextMarker),
    );
  }
}

export default Task;

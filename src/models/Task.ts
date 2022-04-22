import { BlockEntity } from "@logseq/libs/dist/LSPlugin";
import dayjs from "dayjs";

export enum TaskMarker {
  LATER = 'LATER',
  NOW = 'NOW',
  TODO = 'TODO',
  DONE = 'DONE',
}

class Task {
  private block: BlockEntity;
  private markerStack: TaskMarker[] = [];

  constructor(block: BlockEntity) {
    this.block = block;
  }

  public static getTodayTaskQuery(): string {
    const today = dayjs().format('YYYYMMDD');
    const query = `
      [:find (pull ?h [*])
       :where
       [?h :block/marker ?marker]
       [(contains? #{"NOW" "LATER" "TODO" "DONE"} ?marker)]
       [?h :block/page ?p]
       (or
         (and
          [?p :block/journal? true]
          [?p :block/journal-day ?d]
          [(= ?d ${today})])
         (and
          (or
            [?h :block/scheduled ?d]
            [?h :block/deadline ?d])
          [(= ?d ${today})]))]
    `
    return query;
  }

  public get uuid(): string {
    if (typeof this.block.uuid === "string") {
      return this.block.uuid;
    }
    // @ts-ignore
    return this.block.uuid.$uuid$;
  }

  public get content(): string {
    let content = this.block.content;
    content = content.replace(this.marker, '');
    return content.trim();
  }

  public get marker(): TaskMarker {
    return this.block.marker;
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

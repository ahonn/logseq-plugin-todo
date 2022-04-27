import { BlockEntity, PageEntity } from '@logseq/libs/dist/LSPlugin.user';
import { getBlockUUID } from '../utils';

export enum TaskMarker {
  LATER = 'LATER',
  NOW = 'NOW',
  TODO = 'TODO',
  DONE = 'DONE',
}

export interface TaskEntityObject {
  uuid: string;
  content: string;
  marker: TaskMarker;
  scheduled: number;
  completed: boolean;
  page: {
    name: string;
    uuid: string;
  }
}

class TaskEntity {
  private block: BlockEntity;
  private page: PageEntity;

  constructor(block: BlockEntity, page: PageEntity) {
    this.block = block;
    this.page = page;
  }

  public get uuid() {
    return getBlockUUID(this.block);
  }

  public get content() {
    return this.block.content;
  }

  public get marker() {
    return this.block.marker;
  }

  public get scheduled() {
    return this.block.scheduled ?? this.block.deadline ?? this.page.journalDay;
  }

  public get completed() {
    return this.marker === TaskMarker.DONE;
  }

  public getPageProperty(key: string) {
    // @ts-ignore
    return this.page.properties?.[key];
  }

  public toObject(): TaskEntityObject {
    return {
      uuid: this.uuid,
      content: this.content,
      marker: this.marker,
      scheduled: this.scheduled,
      completed: this.completed,
      page: {
        name: this.page.name,
        uuid: this.page.uuid,
      },
    };
  }
}

export default TaskEntity;

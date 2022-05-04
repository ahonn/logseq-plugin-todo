import { BlockEntity, PageEntity } from '@logseq/libs/dist/LSPlugin.user';
import { getBlockUUID } from '../utils';

export enum TaskMarker {
  LATER = 'LATER',
  NOW = 'NOW',
  TODO = 'TODO',
  DONE = 'DONE',
}

export enum TaskPriority {
  HIGH = 'A',
  MEDIUM = 'B',
  LOW = 'C',
  NONE = 'NONE'
}

export const TASK_PRIORITY_WEIGHT = {
  [TaskPriority.HIGH]: 100,
  [TaskPriority.MEDIUM]: 50,
  [TaskPriority.LOW]: 10,
  [TaskPriority.NONE]: 0,
};

export interface TaskEntityObject {
  uuid: string;
  content: string;
  rawContent: string;
  marker: TaskMarker;
  priority: TaskPriority;
  scheduled: number;
  completed: boolean;
  page: {
    name: string;
    uuid: string;
    journal: boolean;
  }
}

class TaskEntity {
  private block: BlockEntity;
  private page: PageEntity;

  constructor(block: BlockEntity, page: PageEntity) {
    this.block = block;
    this.page = page;
  }

  public get uuid(): string {
    return getBlockUUID(this.block);
  }

  public get content(): string {
    let content = this.rawContent;
    content = content.replace(this.block.marker, '');
    content = content.replace(`[#${this.block.priority}]`, '');
    content = content.replace(/SCHEDULED: <[^>]+>/, '');
    content = content.replace(/DEADLINE: <[^>]+>/, '');
    content = content.replace(/(:LOGBOOK:)|(\*\s.*)|(:END:)|(CLOCK:.*)/gm, '');
    return content.trim();
  }

  public get rawContent(): string {
    return this.block.content;
  }

  public get marker(): TaskMarker {
    return this.block.marker;
  }

  public get priority(): TaskPriority {
    return this.block.priority ?? TaskPriority.NONE;
  }

  public get scheduled(): number {
    return this.block.scheduled ?? this.block.deadline ?? this.page.journalDay;
  }

  public get completed(): boolean {
    return this.marker === TaskMarker.DONE;
  }

  public getPageProperty<T>(key: string): T {
    // @ts-ignore
    return this.page.properties?.[key];
  }

  public toObject(): TaskEntityObject {
    return {
      uuid: this.uuid,
      content: this.content,
      rawContent: this.rawContent,
      marker: this.marker,
      priority: this.priority,
      scheduled: this.scheduled,
      completed: this.completed,
      page: {
        name: this.page.name,
        uuid: this.page.uuid,
        journal: this.page['journal?'],
      },
    };
  }
}

export default TaskEntity;

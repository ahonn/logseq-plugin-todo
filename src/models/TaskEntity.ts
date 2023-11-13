import removeMarkdown from 'remove-markdown';
import { BlockEntity, PageEntity } from '@logseq/libs/dist/LSPlugin.user';
import { getBlockUUID } from '../utils';

export enum TaskMarker {
  LATER = 'LATER',
  NOW = 'NOW',
  TODO = 'TODO',
  DOING = 'DOING',
  DONE = 'DONE',
  WAITING = 'WAITING',
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
  scheduled: number | undefined;
  repeated: boolean;
  completed: boolean;
  page: {
    name: string;
    uuid: string;
    journalDay: number | undefined;
    updatedAt: number | undefined;
  }
}

class TaskEntity {
  private block: BlockEntity;
  private page: PageEntity;
  private content: string;

  constructor(block: BlockEntity, page: PageEntity) {
    this.block = block;
    this.page = page;
    this.content = this.rawContent;
  }

  public get uuid(): string {
    return getBlockUUID(this.block);
  }

  public get trimContent(conten: string): string {
    content = content.replace(this.block.marker, '');
    content = content.replace(`[#${this.block.priority}]`, '');
    content = content.replace(/SCHEDULED: <[^>]+>/, '');
    content = content.replace(/DEADLINE: <[^>]+>/, '');
    content = content.replace(/(:LOGBOOK:)|(\*\s.*)|(:END:)|(CLOCK:.*)/gm, '');
    content = content.replace(/id::[^:]+/, '');
    content = removeMarkdown(content);
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

  public get scheduled(): number | undefined {
    return this.block.scheduled ?? this.block.deadline ?? this.page.journalDay;
  }

  public get repeated(): boolean {
    return !!this.block.repeated;
  }

  public get completed(): boolean {
    return this.marker === TaskMarker.DONE;
  }

  public getPageProperty<T>(key: string): T {
    // @ts-ignore
    return this.page.properties?.[key];
  }

  public getContent() {
    return this.trimContent(this.content);
  }

  public setContent(value: string) {
   this.cotnent = value;
  }
  
  public toObject(): TaskEntityObject {
    return {
      uuid: this.uuid,
      content: this.content,
      rawContent: this.rawContent,
      marker: this.marker,
      priority: this.priority,
      scheduled: this.scheduled,
      repeated: this.repeated,
      completed: this.completed,
      page: {
        name: this.page.name,
        uuid: this.page.uuid,
        journalDay: this.page['journalDay'],
        updatedAt: this.page.updatedAt,
      },
    };
  }
}

export default TaskEntity;

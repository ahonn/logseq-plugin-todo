import { atom } from "recoil";
import { TaskPriority } from "../models/TaskEntity";

export const DEFAULT_OPTION = {
  label: 'ALL',
  value: '',
}

export const markerState = atom({
  key: 'filter/marker',
  default: DEFAULT_OPTION,
});


export const PRIORITY_OPTIONS = [
  TaskPriority.HIGH,
  TaskPriority.MEDIUM,
  TaskPriority.LOW,
  TaskPriority.NONE,
];

export const priorityState = atom({
  key: 'filter/priority',
  default: DEFAULT_OPTION,
});

export enum SortType {
  Asc = 'ASC',
  Desc = 'DESC',
}

export const sortState = atom({
  key: 'filter/sort',
  default: {
    label: 'DESC',
    value: SortType.Desc,
  },
});

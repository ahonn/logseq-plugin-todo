import { atom } from "recoil";

export const DEFAULT_OPTION = {
  label: 'ALL',
  value: '',
}

export const markerState = atom({
  key: 'filter/marker',
  default: DEFAULT_OPTION,
});

export const priorityState = atom({
  key: 'filter/priority',
  default: DEFAULT_OPTION,
});

import { atom } from "recoil";

export const DEFAULT_OPTION = {
  label: 'ALL',
  value: '',
}

export const markerFilterState = atom({
  key: 'filter/marker',
  default: DEFAULT_OPTION,
});

export const priorityFilterState = atom({
  key: 'filter/priority',
  default: DEFAULT_OPTION,
});

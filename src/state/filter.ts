import { atom } from "recoil";

export const markerFilterState = atom({
  key: 'filter/marker',
  default: "",
});

export const priorityFilterState = atom({
  key: 'filter/priority',
  default: "",
});

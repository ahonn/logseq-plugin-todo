import { atom, AtomEffect } from 'recoil';
import { TaskMarker, TaskPriority } from '../models/TaskEntity';
import settings from '../settings';

interface IPluginSettings {
  hotkey: string;
  defaultMarker: TaskMarker;
  customMarkers: string;
  defaultPriority: TaskPriority;
  showNextNDaysTask: boolean;
  numberOfNextNDays: number;
  lightPrimaryBackgroundColor: string;
  lightSecondaryBackgroundColor: string;
  darkPrimaryBackgroundColor: string;
  darkSecondaryBackgroundColor: string;
  useDefaultColors: boolean;
  sectionTitleColor: string;
  openInRightSidebar: boolean;
  whereToPlaceNewTask: string;
  treatJournalEntriesAsScheduled: boolean;
}

const settingsChangedEffect: AtomEffect<IPluginSettings> = ({ setSelf }) => {
  setSelf({ ...logseq.settings } as unknown as IPluginSettings);
  const unlisten = logseq.onSettingsChanged((newSettings) => {
    setSelf(newSettings);
  });
  return () => unlisten();
};

export const settingsState = atom<IPluginSettings>({
  key: 'settings',
  default: settings.reduce((result, item) => ({ ...result, [item.key]: item.default }), {}) as IPluginSettings,
  effects: [settingsChangedEffect],
});

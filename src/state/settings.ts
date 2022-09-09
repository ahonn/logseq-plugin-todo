import { atom, AtomEffect } from 'recoil';

interface IPluginSettings {
  lightPrimaryBackgroundColor: string;
  lightSecondaryBackgroundColor: string;
  darkPrimaryBackgroundColor: string;
  darkSecondaryBackgroundColor: string;
  sectionTitleColor: string;
}

const DEFAULT_SETTINGS = {
  sectionTitleColor: '#0a0a0a',
  lightPrimaryBackgroundColor: '#ffffff',
  lightSecondaryBackgroundColor: '#f7f7f7',
  darkPrimaryBackgroundColor: '#002B37',
  darkSecondaryBackgroundColor: '#106ba3',
};

const settingsChangedEffect: AtomEffect<IPluginSettings> = ({ setSelf }) => {
  setSelf(logseq.settings as unknown as IPluginSettings);
  const unlisten = logseq.onSettingsChanged((newSettings) => {
    setSelf(newSettings);
  });
  return () => unlisten();
};

export const settingsState = atom<IPluginSettings>({
  key: 'settings',
  default: DEFAULT_SETTINGS,
  effects: [settingsChangedEffect],
});

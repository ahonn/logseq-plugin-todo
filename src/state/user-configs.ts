import { AppUserConfigs } from '@logseq/libs/dist/LSPlugin';
import { atom, AtomEffect } from 'recoil';
import { logseq as plugin } from '../../package.json';

export const USER_CONFIGS_KEY = `${plugin.id}#userConfigs`;

export const DEFAULT_USER_CONFIGS: Partial<AppUserConfigs> = {
  preferredLanguage: 'en',
  preferredThemeMode: 'light',
  preferredFormat: 'markdown',
  preferredWorkflow: 'now',
  preferredTodo: 'LATER',
  preferredDateFormat: 'MMM do, yyyy',
};

const themeModeChangeEffect: AtomEffect<AppUserConfigs> = ({ onSet }) => {
  onSet(({ preferredThemeMode }) => {
    if (preferredThemeMode === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  });
};

const localStorageEffect: AtomEffect<AppUserConfigs> = ({ setSelf, onSet }) => {
  const savedValue = localStorage.getItem(USER_CONFIGS_KEY);
  if (savedValue != null) {
    setSelf(JSON.parse(savedValue));
  }

  onSet((newValue, _, isReset) => {
    isReset
      ? localStorage.removeItem(USER_CONFIGS_KEY)
      : localStorage.setItem(USER_CONFIGS_KEY, JSON.stringify(newValue));
  });
};

export const userConfigsState = atom<AppUserConfigs>({
  key: 'userConfigs',
  default: DEFAULT_USER_CONFIGS as AppUserConfigs,
  effects: [localStorageEffect, themeModeChangeEffect],
});

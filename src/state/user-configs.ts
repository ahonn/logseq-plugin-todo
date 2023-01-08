import { AppUserConfigs } from '@logseq/libs/dist/LSPlugin';
import { atom, AtomEffect } from 'recoil';

export const DEFAULT_USER_CONFIGS: Partial<AppUserConfigs> = {
  preferredLanguage: 'en',
  preferredThemeMode: 'light',
  preferredFormat: 'markdown',
  preferredWorkflow: 'now',
  preferredTodo: 'LATER',
  preferredDateFormat: 'MMM do, yyyy',
};

const updateUserConfigsEffect: AtomEffect<Partial<AppUserConfigs>> = ({
  setSelf,
  trigger,
}) => {
  if (trigger === 'get') {
    window.logseq.App.getUserConfigs().then(setSelf);
  }
};

export const userConfigsState = atom({
  key: 'userConfigs',
  default: DEFAULT_USER_CONFIGS,
  effects: [updateUserConfigsEffect],
});

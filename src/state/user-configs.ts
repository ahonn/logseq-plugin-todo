import { AppUserConfigs } from '@logseq/libs/dist/LSPlugin';
import { atom, AtomEffect } from 'recoil';
import { visibleState } from './visible';

export const DEFAULT_USER_CONFIGS: Partial<AppUserConfigs> = {
  preferredLanguage: 'en',
  preferredThemeMode: 'light',
  preferredFormat: 'markdown',
  preferredWorkflow: 'now',
  preferredTodo: 'LATER',
  preferredDateFormat: 'MMM do, yyyy',
};

function fixPreferredDateFormat(preferredDateFormat: string) {
  const format = preferredDateFormat
    .replace('yyyy', 'YYYY')
    .replace('dd', 'DD')
    .replace('do', 'Do')
    .replace('EEEE', 'dddd')
    .replace('EEE', 'ddd')
    .replace('EE', 'dd')
    .replace('E', 'dd');
  return format;
}

const updateUserConfigsEffect: AtomEffect<Partial<AppUserConfigs>> = ({
  setSelf,
  trigger,
}) => {
  if (trigger === 'get') {
    window.logseq.App.getUserConfigs()
      .then((configs) => ({
        ...configs,
        preferredDateFormat: fixPreferredDateFormat(
          configs.preferredDateFormat,
        ),
      }))
      .then(setSelf);
  }
};

export const userConfigsState = atom({
  key: 'userConfigs',
  default: DEFAULT_USER_CONFIGS,
  effects: [updateUserConfigsEffect],
});

import { AppUserConfigs } from '@logseq/libs/dist/LSPlugin';
import { atom, AtomEffect } from 'recoil';

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
  default: () => window.logseq.App.getUserConfigs(),
  effects: [updateUserConfigsEffect],
});

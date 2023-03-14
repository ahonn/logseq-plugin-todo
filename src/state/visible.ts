import { atom, AtomEffect, selector } from 'recoil';
import { themeModeState } from './theme';

const visibleChangedEffect: AtomEffect<boolean> = ({ setSelf }) => {
  const eventName = 'ui:visible:changed';
  const listener = ({ visible }: { visible: boolean }) => {
    setSelf(visible);
  };
  logseq.on(eventName, listener);
  return () => {
    logseq.off(eventName, listener);
  };
};

export const visibleState = atom({
  key: 'visible',
  default: logseq.isMainUIVisible,
  effects: [visibleChangedEffect],
});

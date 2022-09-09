import { atom, AtomEffect, selector } from 'recoil';
import { settingsState } from './settings';
import { userConfigsState } from './user-configs';

type ThemeMode = 'dark' | 'light';

const themeModeChangedEffect: AtomEffect<ThemeMode> = ({
  setSelf,
  getPromise,
}) => {
  setTimeout(async () => {
    const userConfigs = await getPromise(userConfigsState);
    setSelf(userConfigs.preferredThemeMode ?? 'light');
  }, 0);

  logseq.App.onThemeModeChanged((evt) => {
    setSelf(evt.mode);
  });
};

export const themeModeState = atom<ThemeMode>({
  key: 'themeMode',
  default: 'light',
  effects: [themeModeChangedEffect],
});

export const themeStyleState = selector({
  key: 'themeStyle',
  get: ({ get }) => {
    const settings = get(settingsState);
    const themeMode = get(themeModeState);

    const isLightMode = themeMode === 'light';

    const primaryBackgroundColor = isLightMode
      ? settings.lightPrimaryBackgroundColor
      : settings.darkPrimaryBackgroundColor;

    const secondaryBackgroundColor = isLightMode
      ? settings.lightSecondaryBackgroundColor
      : settings.darkSecondaryBackgroundColor;

    return {
      primaryBackgroundColor,
      secondaryBackgroundColor,
      sectionTitleColor: settings.sectionTitleColor,
    };
  },
});

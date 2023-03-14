import { selector } from 'recoil';
import { settingsState } from './settings';
import { userConfigsState } from './user-configs';

export const themeModeState = selector({
  key: 'themeMode',
  get: ({ get }) => {
    const userConfigs = get(userConfigsState);
    return userConfigs.preferredThemeMode;
  }
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

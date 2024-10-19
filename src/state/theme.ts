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

const getStyleVariable = (variableName: string) => {
  const rootElement = document.querySelector(":root");
  if (rootElement) {
    return getComputedStyle(rootElement).getPropertyValue(variableName);
  } else {
    return null;
  }
}

export const themeColorsState = selector({
  key: 'themeColors',
  get: () => {
    const themeColors = {
      primaryBackgroundColor: getStyleVariable('--ls-primary-background-color'),
      secondaryBackgroundColor: getStyleVariable('--ls-secondary-background-color'),
      sectionTitleColor: getStyleVariable('--ls-link-text-color'),
    }

    if (Object.values(themeColors).some((value) => value === null)) return null
    return themeColors
  }
});

export const themeStyleState = selector({
  key: 'themeStyle',
  get: ({ get }) => {
    const settings = get(settingsState);
    const themeMode = get(themeModeState);
    const themeColors = get(themeColorsState);

    const isLightMode = themeMode === 'light';

    if (settings.useDefaultColors && themeColors) return themeColors;

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

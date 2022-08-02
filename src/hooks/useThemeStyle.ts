import { useMemo } from 'react';
import useAppState from './useAppState';
import useThemeMode from './useThemeMode';

const useThemeStyle = () => {
  const { settings } = useAppState();
  const { isLightMode } = useThemeMode();

  const primaryBackgroundColor = useMemo(
    () =>
      isLightMode
        ? settings.lightPrimaryBackgroundColor
        : settings.darkPrimaryBackgroundColor,
    [isLightMode, settings],
  );
  const secondaryBackgroundColor = useMemo(
    () =>
      isLightMode
        ? settings.lightSecondaryBackgroundColor
        : settings.darkSecondaryBackgroundColor,
    [isLightMode, settings],
  );

  return {
    primaryBackgroundColor,
    secondaryBackgroundColor,
    sectionTitleColor: settings.sectionTitleColor,
  };
};

export default useThemeStyle;

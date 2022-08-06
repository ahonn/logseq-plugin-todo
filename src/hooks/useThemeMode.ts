import { useEffect, useState } from "react";
import useUserConfigs from "./useUserConfigs";

const useThemeMode = () => {
  const userConfigs = useUserConfigs();
  const [themeMode, setThemeMode] = useState(userConfigs.preferredThemeMode);
  const isLightMode = themeMode === "light";
  const isDarkMode = themeMode === "dark";

  useEffect(() => {
    setThemeMode(userConfigs.preferredThemeMode);
  }, [userConfigs.preferredThemeMode]);

  useEffect(() => {
    logseq.App.onThemeModeChanged((evt) => {
      setThemeMode(evt.mode);
    });
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.add('light');
    }
  }, [isDarkMode]);

  return {
    themeMode,
    isLightMode,
    isDarkMode,
  };
};

export default useThemeMode;

import { AppUserConfigs } from '@logseq/libs/dist/LSPlugin';
import { useEffect, useState } from 'react';
import useAppVisible from './useAppVisible';

export const DEFAULT_USER_CONFIGS: AppUserConfigs = {
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

const useUserConfigs = () => {
  const visible = useAppVisible();
  const [configs, setConfigs] = useState<AppUserConfigs>(DEFAULT_USER_CONFIGS);

  useEffect(() => {
    if (visible) {
      window.logseq.App.getUserConfigs().then((configs) => {
        setConfigs({
          ...configs,
          preferredDateFormat: fixPreferredDateFormat(
            configs.preferredDateFormat,
          ),
        });
      });
    }
  }, [visible]);

  return configs;
};

export default useUserConfigs;

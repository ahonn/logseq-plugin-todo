import React, { useContext } from 'react';
import { AppUserConfigs } from '@logseq/libs/dist/LSPlugin';
import { useEffect, useState } from 'react';
import useAppVisible from './useAppVisible';

const DEFAULT_USER_CONFIGS: AppUserConfigs = {
  preferredLanguage: 'en',
  preferredThemeMode: 'light',
  preferredFormat: 'markdown',
  preferredWorkflow: 'now',
  preferredTodo: 'LATER',
  preferredDateFormat: 'MMM do, yyyy',
};

// @ts-ignore
const UserConfigsContext = React.createContext<AppUserConfigs>(DEFAULT_USER_CONFIGS);

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

export const withUserConfigs = <P extends {}>(
  WrapComponent: React.ComponentType<P>,
) => {
  const WithUserConfigsComponent: typeof WrapComponent = (props) => {
  const visible = useAppVisible();
    const [configs, setConfigs] = useState<AppUserConfigs>(DEFAULT_USER_CONFIGS);

    useEffect(() => {
      if (visible) {
        window.logseq.App.getUserConfigs().then((configs) => {
          setConfigs({
            ...configs,
            preferredDateFormat: fixPreferredDateFormat(configs.preferredDateFormat),
          });
        });
      }
    }, [visible]);

    return (
      <UserConfigsContext.Provider value={configs!}>
        <WrapComponent {...props} />
      </UserConfigsContext.Provider>
    );
  };
  return WithUserConfigsComponent;
};

const useUserConfigs = () => {
  const configs = useContext(UserConfigsContext);
  return configs;
};

export default useUserConfigs;

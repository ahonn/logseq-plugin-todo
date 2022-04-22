import { AppUserConfigs } from '@logseq/libs/dist/LSPlugin';
import { useEffect, useState } from 'react';

const useUserConfigs = () => {
  const [configs, setConfigs] = useState<AppUserConfigs>();

  useEffect(() => {
    window.logseq.App.getUserConfigs().then((configs) => {
      setConfigs(configs);
    });
  }, []);

  return configs;
};

export default useUserConfigs;

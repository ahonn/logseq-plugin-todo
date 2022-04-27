import { AppUserConfigs } from '@logseq/libs/dist/LSPlugin.user';
import React, { useCallback, useContext, useMemo } from 'react';
import { TaskEntityObject } from '../models/TaskEntity';
import getAnytimeTaskQuery from '../querys/anytime';
import getScheduledTaskQuery from '../querys/scheduled';
import getTodayTaskQuery from '../querys/today';
import useTaskQuery from './useTaskQuery';
import useUserConfigs, { DEFAULT_USER_CONFIGS } from './useUserConfigs';

export interface IAppState {
  userConfigs: AppUserConfigs,
  tasks: {
    today: TaskEntityObject[],
    scheduled: TaskEntityObject[],
    anytime: TaskEntityObject[],
  },
  refresh(): void,
}

const AppStateContext = React.createContext<IAppState>({
  userConfigs: DEFAULT_USER_CONFIGS,
  tasks: {
    today: [],
    scheduled: [],
    anytime: [],
  },
  refresh: () => {},
});

const useAppState = () => {
  const appState = useContext(AppStateContext);
  return appState;
};

export const withAppState = <P extends {}>(
  WrapComponent: React.ComponentType<P>,
) => {
  const WithAppState: typeof WrapComponent = (props) => {
    const userConfigs = useUserConfigs();
    const todayTask = useTaskQuery(getTodayTaskQuery());
    const scheduledTask = useTaskQuery(getScheduledTaskQuery());
    const anytimeTask = useTaskQuery(getAnytimeTaskQuery());

    const refresh = useCallback(() => {
      todayTask.mutate();
      scheduledTask.mutate();
      anytimeTask.mutate();
    }, [todayTask, scheduledTask, anytimeTask]);

    const state = useMemo(() => ({
      userConfigs,
      tasks: {
        today: todayTask.data || [],
        scheduled: scheduledTask.data || [],
        anytime: anytimeTask.data || [],
      },
      refresh,
    }), [userConfigs, todayTask, scheduledTask, anytimeTask, refresh]);

    return (
      <AppStateContext.Provider value={state}>
        <WrapComponent {...props} />
      </AppStateContext.Provider>
    );
  };
  return WithAppState;
};

export default useAppState;

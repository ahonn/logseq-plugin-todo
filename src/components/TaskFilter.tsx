import React from 'react';
import Select, { Theme } from 'react-select';
import { useRecoilState, useRecoilValue } from 'recoil';
import { CircleOff } from 'tabler-icons-react';
import { taskMarkersState } from '../state/user-configs';
import {
  DEFAULT_OPTION,
  markerState,
  priorityState,
  PRIORITY_OPTIONS,
  sortState,
  SortType,
} from '../state/filter';
import { themeStyleState } from '../state/theme';
import { settingsState } from '../state/settings';

const TaskFilter: React.FC = () => {
  const [marker, setMarker] = useRecoilState(markerState);
  const [priority, setPriority] = useRecoilState(priorityState);
  const [sort, setSort] = useRecoilState(sortState);
  const taskMarkers = useRecoilValue(taskMarkersState);
  const themeStyle = useRecoilValue(themeStyleState);
  const settings = useRecoilValue(settingsState);

  const markerOptions = React.useMemo(() => {
    return taskMarkers.reduce(
      (options, marker) => {
        return [...options, { label: marker, value: marker }];
      },
      [DEFAULT_OPTION],
    );
  }, [taskMarkers]);

  const priorityOptions = React.useMemo(() => {
    return PRIORITY_OPTIONS.reduce(
      (options, marker) => {
        return [...options, { label: marker, value: marker }];
      },
      [DEFAULT_OPTION],
    );
  }, []);

  const selectClassNames = React.useMemo(
    () => ({
      container: () => 'text-xs',
      control: () => '!h-6 !min-h-6 w-12 !border-none !shadow-none !bg-transparent ',
      valueContainer: () => '!py-0 !px-1 cursor-pointer bg-transparent',
      singleValue: () => `!text-gray-500 !dark:text-gray-300`,
      indicatorsContainer: () => '!hidden',
      menu: () => `!-mt-0.5`,
      option: () => `!py-1 !px-2`,
    }),
    [],
  );

  const selectTheme = React.useCallback(
    (theme: Theme) => ({
      ...theme,
      colors: {
        ...theme.colors,
        primary: themeStyle.sectionTitleColor,
        primary25: themeStyle.secondaryBackgroundColor,
        neutral0: themeStyle.primaryBackgroundColor,
      },
    }),
    [themeStyle],
  );

  React.useEffect(() => {
    const marker = markerOptions.find((marker) => marker.value === settings.defaultMarker);
    if (marker) {
      setMarker(marker);
    }

    const priority = priorityOptions.find(
      (priority) => priority.value === settings.defaultPriority,
    );
    if (priority) {
      setPriority(priority);
    }
  }, [settings, markerOptions, priorityOptions, setMarker, setPriority]);

  const handleReset = () => {
    setMarker(DEFAULT_OPTION);
    setPriority(DEFAULT_OPTION);
  };

  return (
    <div
      className="flex flex-row gap-4 text-gray-500 dark:text-gray-300 px-2 rounded-b-md items-center justify-between"
      style={{
        backgroundColor: themeStyle.secondaryBackgroundColor,
      }}
    >
      <div className="flex flex-row">
        <div className="flex flex-row items-center">
          <span className="text-xs">Marker:</span>
          <Select
            classNames={selectClassNames}
            theme={selectTheme}
            isSearchable={false}
            options={markerOptions}
            value={marker}
            onChange={(option) => setMarker(option!)}
          />
        </div>
        <div className="flex flex-row items-center">
          <span className="text-xs">Priority:</span>
          <Select
            classNames={selectClassNames}
            theme={selectTheme}
            isSearchable={false}
            options={priorityOptions}
            value={priority}
            onChange={(option) => setPriority(option!)}
          />
        </div>
        <div className="flex flex-row items-center">
          <span className="text-xs">Sort:</span>
          <Select
            classNames={selectClassNames}
            theme={selectTheme}
            isSearchable={false}
            options={[
              {
                label: 'Desc',
                value: SortType.Desc,
              },
              {
                label: 'ASC',
                value: SortType.Asc,
              },
            ]}
            value={sort}
            onChange={(option) => setSort(option!)}
          />
        </div>
      </div>
      {(marker.value || priority.value) && (
        <CircleOff
          size={14}
          className="stroke-gray-600 dark:stroke-gray-200"
          onClick={handleReset}
        />
      )}
    </div>
  );
};

export default TaskFilter;

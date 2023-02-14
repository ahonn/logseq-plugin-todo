import React from 'react';
import Select from 'react-select';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userConfigsState } from '../state/user-configs';
import { TaskMarker, TaskPriority } from '../models/TaskEntity';
import { markerFilterState, priorityFilterState } from '../state/filter';

const PRIORITY_OPTIONS = [
  TaskPriority.HIGH,
  TaskPriority.MEDIUM,
  TaskPriority.LOW,
  TaskPriority.NONE,
];

const TaskFilter: React.FC = () => {
  const { preferredWorkflow } = useRecoilValue(userConfigsState);
  const [marker, setMarker] = useRecoilState(markerFilterState);
  const [priority, setPriority] = useRecoilState(priorityFilterState);

  const workflow = React.useMemo(() => {
    return preferredWorkflow === 'now'
      ? [TaskMarker.NOW, TaskMarker.LATER]
      : [TaskMarker.TODO, TaskMarker.DOING];
  }, [preferredWorkflow]);

  const markerOptions = React.useMemo(() => {
    return workflow.reduce(
      (options, marker) => {
        return [...options, { label: marker, value: marker }];
      },
      [{ label: 'ALL', value: '' }],
    );
  }, [workflow]);

  return (
    <div className="flex flex-row">
      <div className="flex flex-row mr-2 items-center">
        <span className="text-xs">Marker:</span>
        <Select
          classNames={{
            container: () => 'text-xs',
            control: () => '!h-6 !min-h-6 w-16 !border-none !shadow-none',
            valueContainer: () => '!py-0 !px-2',
            indicatorsContainer: () => '!hidden',
          }}
          options={markerOptions}
        />
      </div>
    </div>
  );
};

export default TaskFilter;

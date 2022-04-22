import React from 'react';
import { CirclePlus } from 'tabler-icons-react';

export interface ITaskInputProps {
  onCreateTask(content: string): void;
}

const TaskInput: React.FC<ITaskInputProps> = (props) => {
  const [content, setContent] = React.useState('');

  return (
    <div className="flex mb-2">
      <div className="px-2 h-9 flex items-center flex-1 bg-gray-100 inline rounded-lg">
        <CirclePlus size={20} className="stroke-gray-400" />
        <input
          type="text"
          className="flex-1 bg-transparent p-1 outline-none text-sm"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a task and hit enter"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              props.onCreateTask(content);
              setContent('');
            }
          }}
        />
      </div>
    </div>
  );
};

export default TaskInput;

import React, { useImperativeHandle, useRef } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { CirclePlus } from 'tabler-icons-react';
import { inputState } from '../state/input';
import { themeStyleState } from '../state/theme';

export interface ITaskInputRef {
  focus: () => void;
}

export interface ITaskInputProps {
  onCreateTask(content: string): void;
}

const TaskInput: React.ForwardRefRenderFunction<
  ITaskInputRef,
  ITaskInputProps
> = (props, ref) => {
  const [input, setInput] = useRecoilState(inputState);
  const inputRef = useRef<HTMLInputElement>(null);
  const themeStyle = useRecoilValue(themeStyleState);

  const focus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useImperativeHandle(ref, () => ({
    focus,
  }));

  return (
    <div className="flex border-b-1 border-dashed dark:border-gray-400 border-gray-300">
      <div
        className="px-2 h-9 flex items-center flex-1 inline rounded-t-md"
        style={{
          backgroundColor: themeStyle.secondaryBackgroundColor,
        }}
      >
        <CirclePlus size={20} className="stroke-gray-400 dark:stroke-gray-200" />
        <input
          type="text"
          ref={inputRef}
          className="flex-1 bg-transparent p-1 outline-none text-sm dark:text-gray-100"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type to search, enter to create"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              props.onCreateTask(input);
              setInput('');
            }
          }}
        />
      </div>
    </div>
  );
};

export default React.forwardRef(TaskInput);

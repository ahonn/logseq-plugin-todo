import React from 'react';
import {useRecoilValue} from "recoil";
import {themeStyleState} from "../state/theme";

export class TaskCategoryTab {
  constructor(
    public readonly title: string,
    public readonly children: React.ReactNode
  ) {
  }
}

export interface ITaskCategoryTabProps {
  tabs: TaskCategoryTab[];
}

export const TaskCategoryTabSection: React.FC<ITaskCategoryTabProps> = (props) => {
  const [activeTab, setActiveTab] = React.useState(props.tabs[0].title);
  const themeStyle = useRecoilValue(themeStyleState);

  return (
    <div className="flex flex-col" style={{borderRadius: "4px"}}>
      <div className="flex flex-row justify-between">
        {props.tabs.map((tab) => (
          <div key={tab.title} className={`${
            activeTab === tab.title ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'
          }`}
               style={{
                 margin: "2px",
                 padding: "2px",
                 borderRadius: "4px",
                 width: "100%",
                 textAlign: "center",
                 backgroundColor: themeStyle.secondaryBackgroundColor
               }}
               onClick={() => {
                 setActiveTab(tab.title)
               }}>
            {tab.title}
          </div>
        ))}
      </div>
      {
        props.tabs.map((tab) => (
          <div key={tab.title}>
            {activeTab === tab.title && (
              <div>
                {tab.children}
              </div>
            )}
          </div>
        ))
      }
    </div>
  )
    ;
};
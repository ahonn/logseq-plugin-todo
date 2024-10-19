import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin';

const settings: SettingSchemaDesc[] = [
  {
    key: 'hotkey',
    type: 'string',
    title: 'Quick Open Hotkey',
    description: 'Use this hotkey to quickly open the task panel',
    default: 'mod+shift+t',
  },
  {
    key: 'defaultMarker',
    type: 'string',
    title: 'Default Marker',
    description:
      'Assign a default marker to new to-do items and filter your to-do list by markers',
    default: '',
  },
  {
    key: 'customMarkers',
    type: 'string',
    title: 'Custom Markers',
    description: 'Custom Markers, separate multiple tags with commas',
    default: 'WAITING',
  },
  {
    key: 'defaultPriority',
    type: 'string',
    title: 'Default Priority',
    description:
      'Assign a default priority to new to-do items and filter your to-do list by priority',
    default: '',
  },
  {
    key: 'whereToPlaceNewTask',
    type: 'string',
    title: 'Where to Place New Tasks',
    description: 'Choose where new task will be placed on the journal page',
    default: '',
  },
  {
    key: 'showNextNDaysTask',
    type: 'boolean',
    title: 'Show Next N Days Task Section',
    description: 'Display a section for the next N days of tasks after today',
    default: false,
  },
  {
    key: 'numberOfNextNDays',
    type: 'number',
    title: 'Number of Next N Days Tasks',
    description:
      'Set the number of days in the "Next N Days" section of the task list',
    default: 14,
  },
  {
    key: 'openInRightSidebar',
    type: 'boolean',
    title: 'Open Task in Right Sidebar',
    description: 'Open task in the right sidebar',
    default: false,
  },
  {
    key: 'useDefaultColors',
    type: 'boolean',
    title: 'Use Default Colors',
    description: 'Use the colors from your current Logseq theme',
    default: false,
  },
  {
    key: 'sectionTitleColor',
    type: 'string',
    title: 'Section Title Color',
    description: 'Set the color of task section titles',
    default: '#106ba3',
    inputAs: 'color',
  },
  {
    key: 'lightPrimaryBackgroundColor',
    type: 'string',
    title: 'Light Mode Primary Background Color',
    description: 'Set the primary background color for light mode',
    default: '#ffffff',
    inputAs: 'color',
  },
  {
    key: 'lightSecondaryBackgroundColor',
    type: 'string',
    title: 'Light Mode Secondary Background Color',
    description: 'Set the secondary background color for light mode',
    default: '#f7f7f7',
    inputAs: 'color',
  },
  {
    key: 'darkPrimaryBackgroundColor',
    type: 'string',
    title: 'Dark Mode Primary Background Color',
    description: 'Set the primary background color for dark mode',
    default: '#023643',
    inputAs: 'color',
  },
  {
    key: 'darkSecondaryBackgroundColor',
    type: 'string',
    title: 'Dark Mode Secondary Background Color',
    description: 'Set the secondary background color for dark mode',
    default: '#002B37',
    inputAs: 'color',
  },
];

export default settings;

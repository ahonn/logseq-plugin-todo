import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin";

const settings: SettingSchemaDesc[] = [
  {
    key: 'hotkey',
    type: 'string',
    title: 'Quick open hotkey',
    description: 'quick open task panel',
    default: 'mod+shift+t',
  },
  {
    key: 'whereToPlaceNewTask',
    type: 'string',
    title: 'where to place new task',
    description: 'Where to place new task on journal page',
    default: '',
  },
  {
    key: 'showNextNDaysTask',
    type: 'boolean',
    title: 'show next n days task section',
    description: 'Show next N days task section after today',
    default: false,
  },
  {
    key: 'numberOfNextNDays',
    type: 'number',
    title: 'how many number of days task',
    description: 'How many number of days task show in section',
    default: 14,
  },
  {
    key: 'openInRightSidebar',
    type: 'boolean',
    title: 'Open task in right sidebar',
    description: '👉 open task in the right sidebar',
    default: false,
  },
  {
    key: 'sectionTitleColor',
    type: 'string',
    title: 'The title color',
    description: 'color of task section title!',
    default: '#106ba3',
    inputAs: 'color'
  },
  {
    key: 'lightPrimaryBackgroundColor',
    type: 'string',
    title: 'The primary background color (light mode)',
    description: '🌝 primary color of light mode!',
    default: '#ffffff',
    inputAs: 'color'
  },
  {
    key: 'lightSecondaryBackgroundColor',
    type: 'string',
    title: 'The secondary background color (light mode)',
    description: '🌝 secondray color of light mode!',
    default: '#f7f7f7',
    inputAs: 'color'
  },
  {
    key: 'darkPrimaryBackgroundColor',
    type: 'string',
    title: 'The primary background color (dark mode)',
    description: '🌚  primary color of dark mode!',
    default: '#023643',
    inputAs: 'color'
  },
  {
    key: 'darkSecondaryBackgroundColor',
    type: 'string',
    title: 'The secondary background color (dark mode)',
    description: '🌚  secondary color of dark mode!',
    default: '#002B37',
    inputAs: 'color'
  },
];

export default settings;

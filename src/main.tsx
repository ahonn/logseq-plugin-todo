import '@logseq/libs';
import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { logseq as plugin } from '../package.json';
import App from './App';
import settings from './settings';

async function openTaskPanel() {
  const rect = await logseq.App.queryElementRect('#' + plugin.id);
  const taskPanel = document.querySelector('#' + plugin.id)!;

  // @ts-ignore
  Object.assign(taskPanel.style, {
    position: 'fixed',
  // @ts-ignore
    top: `${rect.top + 40}px`,
    // @ts-ignore
    left: rect.left + 'px',
  });

  logseq.showMainUI();
}

function createModel() {
  return {
    openTaskPanel,
  };
}

const registeredHotKeySet = new Set();
function registerHotKey(binding: string) {
  if (!binding || registeredHotKeySet.has(binding)) {
    return;
  }

  logseq.App.registerCommandShortcut({ binding }, openTaskPanel);
  registeredHotKeySet.add(binding);
}

function main() {
  try {
    logseq.setMainUIInlineStyle({
      position: 'fixed',
      zIndex: 11,
    });

    logseq.App.registerUIItem('toolbar', {
      key: plugin.id,
      template: `
        <a id="${plugin.id}" data-on-click="openTaskPanel" data-rect class="button">
          <i class="ti ti-checkbox" style="font-size: 20px"></i>
        </a>
      `,
    });

    if (logseq.settings?.hotkey) {
      registerHotKey(logseq.settings?.hotkey);
    }
    logseq.onSettingsChanged((settings) => {
      registerHotKey(settings?.hotkey);
    });

    logseq.App.registerCommandPalette(
      {
        key: 'logseq-plugin-todo',
        label: 'Open todo list',
      },
      () => {
        openTaskPanel();
      },
    );

    logseq.App.getUserConfigs().then((configs) => {
      const root = ReactDOM.createRoot(document.getElementById('app')!);
      root.render(
        <React.StrictMode>
          <RecoilRoot>
            <App userConfigs={configs} />
          </RecoilRoot>
        </React.StrictMode>,
      );
    })
  } catch (e: any) {
    logseq.App.showMsg(e.message, 'error');
  }
}

logseq
  .useSettingsSchema(settings)
  .ready(createModel())
  .then(main)
  .catch(console.error);

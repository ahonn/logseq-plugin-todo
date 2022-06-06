import '@logseq/libs';
import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { logseq as plugin } from '../package.json';
import App from './App';

async function openTaskPanel() {
  const rect = await logseq.App.queryElementRect('#' + plugin.id);
  const taskPanel = document.querySelector('#' + plugin.id)!;

  // @ts-ignore
  Object.assign(taskPanel.style, {
    position: 'fixed',
    top: `${rect.top + 40}px`,
    left: rect.left + 'px',
  });

  logseq.showMainUI();
}

function createModel() {
  return {
    openTaskPanel,
  };
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

    logseq.App.registerCommandPalette(
      {
        key: 'logseq-plugin-todo',
        label: 'Quick open task panel',
        keybinding: {
          binding: "mod+shift+t",
        },
      },
      () => {
        if (logseq.isMainUIVisible) {
          logseq.hideMainUI();
        } else {
          openTaskPanel();
        }
      },
    );

    const root = ReactDOM.createRoot(document.getElementById('app')!);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  } catch (e: any) {
    logseq.App.showMsg(e.message, 'error');
  }
}

logseq.ready(createModel()).then(main).catch(console.error);

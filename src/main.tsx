import '@logseq/libs';
import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { logseq as plugin } from '../package.json';
import App from './App';

function createModel() {
  return {
    openTaskPanel: (e: any) => {
      const { rect } = e;
      const taskPanel = document.querySelector('#' + plugin.id)!;

      // @ts-ignore
      Object.assign(taskPanel.style, {
        position: 'fixed',
        top: `${rect.top + 40}px`,
        right: window.screen.width - rect.right + (rect.width / 2) + 'px',
      });

      logseq.showMainUI();
    },
  };
}

function main() {
  logseq.setMainUIInlineStyle({
    position: 'fixed',
    zIndex: 11,
  });

  logseq.App.registerUIItem('toolbar', {
    key: plugin.id,
    template: `
      <a data-on-click="openTaskPanel" data-rect class="button">
        <i class="ti ti-checkbox" style="font-size: 20px"></i>
      </a>
    `,
  });

  const root = ReactDOM.createRoot(document.getElementById('app')!);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

logseq.ready(createModel()).then(main).catch(console.error);

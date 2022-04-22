import '@logseq/libs';
import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { logseq as plugin } from '../package.json';
import App from './App';

function createModel() {
  return {
    openTaskPanel: (e: any) => {
      const { rect } = e;
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
      <a data-on-click="openTaskPanel" class="button" id="logseq-plugin-tasks-icon">
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

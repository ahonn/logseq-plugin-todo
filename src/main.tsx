import '@logseq/libs';
import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { logseq as plugin } from '../package.json';
import App from './App';
import settings from './settings';

type Rect = {
  top: number;
  right: number;
  left: number;
  bottom: number;
};

let cachedRect: Rect | undefined = undefined;

async function openTaskPanel(e?: { rect: Rect }) {
  const taskPanel = document.querySelector('#' + plugin.id)!;
  let rect = e?.rect ?? cachedRect;

  if (!rect) {
    try {
      const elRect = await logseq.UI.queryElementRect('#' + plugin.id);
      if (elRect) {
        rect = elRect;
        cachedRect = elRect;
      }
    } catch (e) {
      console.error(e);
    }
  }

  if (rect) {
    cachedRect = rect;
  }

  const position = rect
    ? {
      top: `${rect.top + 40}px`,
      left: rect.left + 'px',
    }
    : {
      top: '40px',
      right: '200px',
    };

  // @ts-ignore
  Object.assign(taskPanel.style, {
    position: 'fixed',
    ...position,
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
    registerHotKey(logseq.settings?.hotkey as string);
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

  const root = ReactDOM.createRoot(document.getElementById('app')!);
  root.render(
    <React.StrictMode>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </React.StrictMode>,
  );
}

logseq.useSettingsSchema(settings).ready(createModel()).then(main).catch(console.error);

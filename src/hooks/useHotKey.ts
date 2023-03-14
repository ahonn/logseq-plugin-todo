import { useEffect } from "react";
import Mousetrap from 'mousetrap';
import 'mousetrap-global-bind';

export function useHotKey(hotkey: string) {
  useEffect(() => {
    if (!hotkey) {
      return;
    }

    // @ts-ignore
    Mousetrap.bindGlobal(
      hotkey,
      () => window.logseq.hideMainUI(),
      'keydown',
    );

    // @ts-ignore
    Mousetrap.bindGlobal(
      'Esc',
      () => window.logseq.hideMainUI(),
      'keydown',
    );

    return () => {
      // @ts-ignore
      Mousetrap.unbindGlobal(hotkey, 'keydown');
      // @ts-ignore
      Mousetrap.unbindGlobal('Esc', 'keydown');
    };
  }, [hotkey]);
}

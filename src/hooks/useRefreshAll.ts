import { useRecoilCallback } from "recoil";

export function useRefreshAll() {
  const refreshAll = useRecoilCallback(
    ({ snapshot, refresh }) =>
      () => {
        for (const node of snapshot.getNodes_UNSTABLE()) {
          refresh(node);
        }
      },
    [],
  );

  return refreshAll;
}

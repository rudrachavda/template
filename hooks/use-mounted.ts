import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * True only after client hydration. Prefer this over a `useState` +
 * `useEffect(() => setMounted(true), [])` guard — that pattern trips the
 * `react-hooks/set-state-in-effect` lint rule; `useSyncExternalStore` gets
 * the same one-render-after-hydration behavior without calling setState
 * inside an effect.
 */
export function useMounted() {
	return useSyncExternalStore(subscribe, () => true, () => false);
}

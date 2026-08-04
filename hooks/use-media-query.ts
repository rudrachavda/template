import { useCallback, useSyncExternalStore } from "react";

/**
 * True when `query` currently matches. Same `useSyncExternalStore` shape as
 * `useMounted` — subscribes to the media query's own change event instead of
 * reading it once in an effect + `setState`, so there's no
 * `react-hooks/set-state-in-effect` cascading-render footgun. Returns
 * `false` on the server and for the first client render before hydration
 * (no viewport to measure yet), same one-render-after-hydration tradeoff
 * `useMounted` already makes.
 *
 * `subscribe`/`getSnapshot` are `useCallback`-memoized on `query` rather than
 * inline arrow functions — passing a new function identity on every render
 * makes React tear down and rebuild the subscription every render instead of
 * once, which was enough to keep this permanently stuck on the server
 * snapshot instead of picking up the real client value after hydration.
 */
export function useMediaQuery(query: string) {
	const subscribe = useCallback(
		(onChange: () => void) => {
			const mql = window.matchMedia(query);
			mql.addEventListener("change", onChange);
			return () => mql.removeEventListener("change", onChange);
		},
		[query],
	);
	const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
	const getServerSnapshot = useCallback(() => false, []);

	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

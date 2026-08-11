import { useEffect, useRef } from "react";
import { createScope } from "animejs";

/**
 * Runs an anime.js setup callback inside a Scope rooted at the returned ref.
 * Everything the callback creates is torn down by a single scope.revert(),
 * and the callback re-runs whenever a media query flips — so `matches.reduced`
 * and `matches.isMobile` can be branched on directly instead of wiring up
 * resize listeners by hand.
 */
export const useAnimeScope = (setup) => {
  const rootRef = useRef(null);
  // Captured once on mount. The scope re-runs this callback itself whenever a
  // media query flips, so it must not be reassigned during render — and none
  // of the callers close over changing props or state.
  const setupRef = useRef(setup);

  useEffect(() => {
    if (!rootRef.current) return;

    const scope = createScope({
      root: rootRef.current,
      mediaQueries: {
        reduced: "(prefers-reduced-motion: reduce)",
        isMobile: "(max-width: 768px)",
      },
    }).add((self) => setupRef.current(self));

    return () => scope.revert();
  }, []);

  return rootRef;
};

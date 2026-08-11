import { engine } from "animejs";

const reducedMotionQuery =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;

export const prefersReducedMotion = () => !!reducedMotionQuery?.matches;

/**
 * Every reveal on the site passes an explicit duration, so engine.defaults
 * can't switch them off — defaults only apply when a duration is omitted.
 * Raising the engine's playback rate instead makes each timed animation land
 * on its end state within a frame: content still arrives, it just doesn't
 * travel. Looping decorative work would strobe at that rate, so those
 * components bail out on prefersReducedMotion() rather than relying on this.
 */
export const initMotionPreferences = () => {
  if (!reducedMotionQuery) return () => {};

  const apply = () => {
    engine.speed = reducedMotionQuery.matches ? 100 : 1;
  };

  apply();
  reducedMotionQuery.addEventListener("change", apply);
  return () => reducedMotionQuery.removeEventListener("change", apply);
};

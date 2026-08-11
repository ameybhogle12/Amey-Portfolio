import { animate, createMotionPath, onScroll, svg } from "animejs";
import { useAnimeScope } from "../hooks/useAnimeScope";

// A winding rail pinned to the right edge of the viewport. The comet's
// position along it is locked to how far down the document you've scrolled,
// so it doubles as a reading-progress indicator.
//
// The comet lives inside the same <svg> as the path, which is what makes this
// exact: createMotionPath returns coordinates in the path's user units, and a
// sibling element translated by those units lands on the curve no matter how
// the viewBox is scaled to the screen.
const PATH_D =
  "M50,4 C6,110 94,210 50,320 C6,430 94,530 50,640 C6,750 94,850 50,996";

// Spans the whole document: enters at the very top of the page and leaves at
// the very bottom, so progress maps 1:1 onto total scroll.
const pageScroll = () =>
  onScroll({
    target: document.documentElement,
    enter: "top top",
    leave: "bottom bottom",
    sync: true,
  });

export const ScrollComet = () => {
  const rootRef = useAnimeScope((self) => {
    // No rail at all for reduced motion or on phones, where it would just be
    // one more thing painting over a narrow screen.
    if (self.matches.reduced || self.matches.isMobile) return;

    const path = self.root.querySelector("#comet-path");
    const comet = self.root.querySelector("#comet");
    const trail = self.root.querySelector("#comet-trail");
    if (!path || !comet || !trail) return;

    const motion = createMotionPath(path);

    animate(comet, {
      translateX: motion.translateX,
      translateY: motion.translateY,
      rotate: motion.rotate,
      ease: "linear",
      autoplay: pageScroll(),
    });

    // The trail draws itself in behind the comet as you descend.
    const [drawable] = svg.createDrawable(trail);
    animate(drawable, {
      draw: "0 1",
      ease: "linear",
      autoplay: pageScroll(),
    });
  });

  // The md breakpoint deliberately matches the scope's isMobile query (768px).
  // If the rail were display:none while the scope still ran, createMotionPath
  // would be measuring an unrendered path.
  return (
    <svg
      ref={rootRef}
      viewBox="0 0 100 1000"
      aria-hidden="true"
      className="fixed right-5 top-1/2 -translate-y-1/2 w-[60px] h-[600px] z-[2] pointer-events-none hidden md:block"
    >
      <defs>
        <linearGradient id="comet-grad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="1000">
          <stop offset="0%" stopColor="var(--color-primary)" />
          <stop offset="100%" stopColor="var(--color-purple-500, #a855f7)" />
        </linearGradient>
        <filter id="comet-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Unlit rail */}
      <path
        id="comet-path"
        d={PATH_D}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-foreground/10"
      />

      {/* Lit portion, drawn in on scroll */}
      <path
        id="comet-trail"
        d={PATH_D}
        fill="none"
        stroke="url(#comet-grad)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Head + tail, rotated to face along the curve */}
      <g id="comet" filter="url(#comet-glow)">
        <ellipse cx="-9" cy="0" rx="11" ry="2.5" fill="url(#comet-grad)" opacity="0.45" />
        <circle cx="0" cy="0" r="5" fill="var(--color-primary)" />
        <circle cx="0" cy="0" r="2" fill="#fff" opacity="0.9" />
      </g>
    </svg>
  );
};

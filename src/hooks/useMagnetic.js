import { useEffect, useRef } from "react";
import { createAnimatable, utils } from "animejs";
import { prefersReducedMotion } from "../lib/motion";

/**
 * Makes an element lean toward the cursor while it's hovered and spring back
 * on exit. Attach the returned ref to any button or link.
 *
 * createAnimatable keeps a live eased chase toward whatever value we set,
 * which is what separates this from a CSS transform — the element is always
 * catching up to the pointer rather than snapping between states.
 */
export const useMagnetic = (strength = 0.3) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Pointless on touch (no hover) and unwanted under reduced motion.
    if (prefersReducedMotion()) return;
    if (window.matchMedia("(hover: none)").matches) return;

    const magnet = createAnimatable(el, {
      translateX: 350,
      translateY: 350,
      ease: "out(3)",
    });

    const onMouseMove = (e) => {
      const { left, top, width, height } = el.getBoundingClientRect();
      const dx = e.clientX - (left + width / 2);
      const dy = e.clientY - (top + height / 2);

      // Clamp so a wide button can't fling itself across the layout.
      magnet.translateX(utils.clamp(dx * strength, -18, 18));
      magnet.translateY(utils.clamp(dy * strength, -14, 14));
    };

    const onMouseLeave = () => {
      magnet.translateX(0);
      magnet.translateY(0);
    };

    el.addEventListener("mousemove", onMouseMove, { passive: true });
    el.addEventListener("mouseleave", onMouseLeave);

    return () => {
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
      magnet.revert();
    };
  }, [strength]);

  return ref;
};

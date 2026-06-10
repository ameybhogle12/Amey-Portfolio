import { useEffect, useRef } from "react";
import { animate, onScroll, splitText, stagger, utils } from "animejs";

/**
 * Splits a heading into characters and waves them in when it scrolls
 * into view. Attach the returned ref to the heading element.
 */
export const useSplitHeading = () => {
  const headingRef = useRef(null);

  useEffect(() => {
    if (!headingRef.current) return;

    const split = splitText(headingRef.current, { chars: true });
    // Transforms only apply to inline-block elements
    utils.set(split.chars, { display: "inline-block", opacity: 0 });

    const anim = animate(split.chars, {
      opacity: [0, 1],
      translateY: ["0.7em", 0],
      duration: 750,
      delay: stagger(28),
      ease: "outBack",
      autoplay: onScroll({
        target: headingRef.current,
        enter: "bottom-=40 top",
      }),
    });

    return () => {
      anim.revert();
      split.revert();
    };
  }, []);

  return headingRef;
};

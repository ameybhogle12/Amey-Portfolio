import { useEffect, useRef } from 'react';
import { animate } from 'animejs';

/**
 * A custom hook to use anime.js with React.
 * @param {Object} options Anime.js animation options.
 * @param {Array} dependencies Optional dependencies to re-trigger the animation.
 * @returns {import('react').RefObject<any>} The ref to attach to the target element.
 */
export const useAnime = (options, dependencies = []) => {
  const elementRef = useRef(null);

  useEffect(() => {
    if (elementRef.current) {
      const animation = animate(elementRef.current, {
        ...options,
      });

      return () => {
        // Cleanup: pause/cancel animation on unmount
        if (animation && typeof animation.pause === 'function') {
          animation.pause();
        }
      };
    }
  }, dependencies);

  return elementRef;
};

/**
 * A hook that triggers an anime.js animation when the element enters the viewport.
 */
export const useInViewAnime = (options, threshold = 0.1) => {
  const elementRef = useRef(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animatedRef.current) {
          animate(elementRef.current, options);
          animatedRef.current = true;
        }
      },
      { threshold }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [options, threshold]);

  return elementRef;
};

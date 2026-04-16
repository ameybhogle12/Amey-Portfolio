import { useEffect, useRef } from "react";
import { animate } from "animejs";

export const FloatingShapes = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Floating movement for multiple blobs
    animate(".blob", {
      translateX: () => Math.random() * 100 - 50,
      translateY: () => Math.random() * 100 - 50,
      rotate: () => Math.random() * 360,
      duration: () => Math.random() * 10000 + 10000,
      delay: (el, i) => i * 500,
      direction: 'alternate',
      loop: true,
      ease: 'easeInOutQuad'
    });

    // Morphing effect for the paths (changing border-radius or transform)
    // For true path morphing we'd need multiple paths, but for now 
    // we can simulate complex motion with scale and skew
    animate(".blob", {
      scale: [1, 1.2, 0.9, 1.1, 1],
      skewX: [0, 5, -5, 2, 0],
      duration: () => Math.random() * 8000 + 5000,
      loop: true,
      ease: 'easeInOutSine',
      direction: 'alternate'
    });

  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] opacity-30 dark:opacity-20">
      {/* Large Purple Blob */}
      <div className="blob absolute top-[10%] left-[5%] w-64 h-64 bg-primary/20 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] blur-3xl" />
      
      {/* Blue Blob */}
      <div className="blob absolute top-[60%] left-[70%] w-96 h-96 bg-blue-500/10 rounded-[60%_40%_30%_70%/50%_60%_40%_50%] blur-3xl" />
      
      {/* Pink/Indigo Blob */}
      <div className="blob absolute top-[40%] left-[20%] w-80 h-80 bg-purple-500/10 rounded-[30%_70%_70%_30%/50%_60%_40%_50%] blur-3xl" />
      
      {/* Small accent blobs */}
      <div className="blob absolute top-[80%] left-[10%] w-32 h-32 bg-primary/30 rounded-full blur-2xl" />
      <div className="blob absolute top-[15%] left-[85%] w-40 h-40 bg-secondary/20 rounded-full blur-2xl" />
    </div>
  );
};

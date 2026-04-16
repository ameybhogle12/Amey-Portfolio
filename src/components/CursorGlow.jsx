import { useEffect, useRef } from "react";
import { animate, spring } from "animejs";

export const CursorGlow = () => {
    const glowRef = useRef(null);
    const mousePos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            mousePos.current = { x: e.clientX, y: e.clientY };
            
            // We use anime.js to animate to the new position with a spring
            // This creates the "lag" or "inertia" effect
            animate(glowRef.current, {
                left: mousePos.current.x,
                top: mousePos.current.y,
                duration: 600,
                ease: spring({ mass: 1, stiffness: 100, damping: 20 })
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div
            ref={glowRef}
            className="fixed w-[600px] h-[600px] pointer-events-none z-[1] -translate-x-1/2 -translate-y-1/2 opacity-30 dark:opacity-20 mix-blend-plus-lighter"
            style={{
                background: "radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)",
                filter: "blur(80px)",
                left: "-1000px", // Start off-screen
                top: "-1000px",
                borderRadius: "50%",
            }}
        />
    );
};

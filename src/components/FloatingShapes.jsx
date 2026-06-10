import { useEffect, useRef } from "react";
import { animate, createAnimatable, svg, utils } from "animejs";

// Each blob is a real SVG <path> that morphs between two hand-drawn shapes
// (same command structure) via svg.morphTo, plus a slow random drift.
const blobs = [
  {
    id: "blob-a",
    d: "M200,58 C288,50 352,118 338,202 C324,286 262,348 178,334 C94,320 50,248 70,166 C90,84 112,66 200,58 Z",
    alt: "M200,80 C268,38 348,104 342,192 C336,280 286,352 196,342 C106,332 58,270 64,182 C70,94 132,122 200,80 Z",
    transform: "translate(20, 40) scale(0.85)",
    fill: "var(--color-primary)",
    opacity: 0.22,
  },
  {
    id: "blob-b",
    d: "M204,30 C310,40 372,128 356,216 C340,304 268,372 176,356 C84,340 28,260 44,168 C60,76 98,20 204,30 Z",
    alt: "M196,52 C284,18 366,96 368,196 C370,296 296,366 196,362 C96,358 36,286 40,190 C44,94 108,86 196,52 Z",
    transform: "translate(940, 440) scale(1.2)",
    fill: "#3b82f6",
    opacity: 0.12,
  },
  {
    id: "blob-c",
    d: "M198,66 C280,46 350,110 344,196 C338,282 274,344 188,338 C102,332 54,262 62,176 C70,90 116,86 198,66 Z",
    alt: "M204,44 C292,56 344,132 330,214 C316,296 248,356 166,336 C84,316 44,240 64,158 C84,76 116,32 204,44 Z",
    transform: "translate(220, 280) scale(1.0)",
    fill: "#a855f7",
    opacity: 0.12,
  },
];

export const FloatingShapes = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    const animations = [];

    // True path morphing between each blob and its alternate shape
    blobs.forEach((blob, i) => {
      animations.push(
        animate(`#${blob.id}`, {
          d: svg.morphTo(`#${blob.id}-alt`),
          duration: 9000 + i * 2500,
          alternate: true,
          loop: true,
          ease: "inOutSine",
        })
      );
    });

    // Slow random drift on every shape
    animations.push(
      animate(".drift-shape", {
        translateX: () => utils.random(-60, 60),
        translateY: () => utils.random(-60, 60),
        rotate: () => utils.random(-30, 30),
        duration: () => utils.random(12000, 22000),
        delay: (el, i) => i * 400,
        alternate: true,
        loop: true,
        ease: "inOutQuad",
      })
    );

    // Whole layer drifts opposite the cursor for parallax depth
    const follower = createAnimatable(svgRef.current, {
      translateX: 900,
      translateY: 900,
      ease: "out(2)",
    });
    const onMouseMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      follower.translateX(nx * -24);
      follower.translateY(ny * -18);
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      follower.revert();
      animations.forEach((a) => a.revert());
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none z-[-1] opacity-30 dark:opacity-20"
    >
      <defs>
        {blobs.map((blob) => (
          <path key={blob.id} id={`${blob.id}-alt`} d={blob.alt} />
        ))}
      </defs>

      {blobs.map((blob) => (
        <g key={blob.id} transform={blob.transform}>
          <path
            id={blob.id}
            className="drift-shape"
            d={blob.d}
            fill={blob.fill}
            fillOpacity={blob.opacity}
            style={{
              filter: "blur(60px)",
              transformBox: "fill-box",
              transformOrigin: "center",
            }}
          />
        </g>
      ))}

      {/* Small accent shapes — drift only */}
      <circle
        className="drift-shape"
        cx="180"
        cy="760"
        r="60"
        fill="var(--color-primary)"
        fillOpacity="0.3"
        style={{ filter: "blur(40px)", transformBox: "fill-box", transformOrigin: "center" }}
      />
      <circle
        className="drift-shape"
        cx="1240"
        cy="140"
        r="70"
        fill="#a855f7"
        fillOpacity="0.15"
        style={{ filter: "blur(40px)", transformBox: "fill-box", transformOrigin: "center" }}
      />
    </svg>
  );
};

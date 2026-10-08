import { cn } from "@/lib/utils";
import { focusLines } from "./shapes";

/**
 * Hand-lettered sound effect: heavy display type with a knock-out stroke
 * so it reads over art or screentone. `jp` switches to the kana face.
 */
export const Sfx = ({ children, jp = false, tone = "ink", rotate = -8, className }) => {
    const fill = { ink: "var(--ink)", red: "var(--primary)", paper: "var(--card)" }[tone];
    const stroke = tone === "paper" ? "var(--ink)" : "var(--card)";
    return (
        <span
            data-sfx
            aria-hidden="true"
            className={cn("inline-block leading-none select-none", jp ? "font-jp" : "font-sfx", className)}
            style={{
                color: fill,
                WebkitTextStroke: `0.12em ${stroke}`,
                paintOrder: "stroke fill",
                rotate: `${rotate}deg`,
            }}
        >
            {children}
        </span>
    );
};

/**
 * Focus lines (集中線) filling their positioned parent. `frames` > 1 renders
 * extra variants of the burst (hidden, tagged data-frame) that a hover can
 * flip between to make the lines crackle.
 */
export const FocusLines = ({ seed, cx, cy, clear, frames = 1, className, color = "var(--ink)" }) => (
    <svg
        data-lines
        aria-hidden="true"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className={cn("absolute inset-0 w-full h-full pointer-events-none", className)}
    >
        {Array.from({ length: frames }, (_, i) => (
            <path
                key={i}
                data-frame
                d={focusLines(seed + i * 101, 110, cx, cy, clear - (i % 2) * 4)}
                fill={color}
                opacity={i === 0 ? 1 : 0}
            />
        ))}
    </svg>
);

/**
 * Crops a region out of a full avatar render, like a manga close-up.
 * `x`/`y` are background-position percentages; `zoom` is the image width
 * relative to the panel width. `flip` mirrors the crop, so one render can
 * play two camera angles across neighbouring panels.
 */
export const ArtCrop = ({ src, x = 50, y = 30, zoom = 250, flip = false, className, label }) => (
    <div
        role={label ? "img" : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : "true"}
        className={cn("absolute inset-0 bg-no-repeat", flip && "-scale-x-100", className)}
        style={{
            backgroundImage: `url("${src}")`,
            backgroundSize: `${zoom}% auto`,
            backgroundPosition: `${x}% ${y}%`,
        }}
    />
);

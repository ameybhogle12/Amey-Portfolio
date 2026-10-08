import { cn } from "@/lib/utils";
import { starburst } from "./shapes";

// Tail wedges: positioned to overlap the bubble body so the shared
// ink-outline filter wraps both as one silhouette.
const TAILS = {
    "bottom-left": { box: "left-[20%] -bottom-6", clip: "polygon(0 0, 100% 0, 8% 100%)" },
    "bottom-right": { box: "right-[20%] -bottom-6", clip: "polygon(0 0, 100% 0, 92% 100%)" },
    "top-left": { box: "left-[20%] -top-6", clip: "polygon(8% 0, 100% 100%, 0 100%)" },
    "top-right": { box: "right-[20%] -top-6", clip: "polygon(92% 0, 100% 100%, 0 100%)" },
};

/**
 * Manga dialogue. Variants:
 *  - speech:  rounded balloon with a tail
 *  - shout:   jagged starburst (pass `seed` to vary the spikes)
 *  - thought: balloon trailing small circles
 *  - caption: square narration box (`dark` for an inverted box)
 * Every bubble carries data-bubble so a section can pop them in on scroll.
 */
export const Bubble = ({
    variant = "speech",
    tail = "bottom-left",
    seed = 1,
    dark = false,
    className,
    textClassName,
    children,
}) => {
    if (variant === "caption") {
        return (
            <div
                data-bubble
                className={cn(
                    "inline-block border-2 border-ink px-3 py-1.5 font-letter font-bold uppercase text-sm leading-snug text-left",
                    dark ? "bg-ink text-card" : "bg-card text-ink",
                    className,
                )}
            >
                {children}
            </div>
        );
    }

    if (variant === "shout") {
        return (
            <div data-bubble className={cn("relative inline-block ink-outline", className)}>
                <div
                    className={cn(
                        "bg-card text-ink px-14 py-12 font-sfx uppercase tracking-wide text-center leading-none",
                        textClassName,
                    )}
                    style={{ clipPath: starburst(seed) }}
                >
                    {children}
                </div>
            </div>
        );
    }

    const t = TAILS[tail];
    return (
        <div data-bubble className={cn("relative inline-block ink-outline", className)}>
            <div
                className={cn(
                    "relative z-10 bg-card text-ink rounded-[50%] px-8 py-5 font-letter font-bold uppercase text-center leading-tight text-base md:text-lg",
                    textClassName,
                )}
            >
                {children}
            </div>
            {variant === "thought" ? (
                <>
                    <span className="absolute -bottom-4 left-[24%] w-4 h-4 rounded-full bg-card" />
                    <span className="absolute -bottom-8 left-[18%] w-2.5 h-2.5 rounded-full bg-card" />
                </>
            ) : (
                t && <span className={cn("absolute w-6 h-8 bg-card", t.box)} style={{ clipPath: t.clip }} />
            )}
        </div>
    );
};

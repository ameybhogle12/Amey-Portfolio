import { createTimeline, onScroll, spring, stagger, utils } from "animejs";

/**
 * The standard manga panel entrance, played once when the panel scrolls
 * into view: the frame wipes in left-to-right, SFX slam down, then bubbles
 * pop in reading order. Call inside an anime.js scope so it's reverted
 * with everything else.
 */
export const revealPanel = (panel) => {
    const sfx = panel.querySelectorAll("[data-sfx]");
    const bubbles = panel.querySelectorAll("[data-bubble]");

    if (sfx.length) utils.set(sfx, { opacity: 0, scale: 2.2 });
    if (bubbles.length) utils.set(bubbles, { opacity: 0, scale: 0.5 });
    utils.set(panel, { clipPath: "inset(0% 100% 0% 0%)" });

    const tl = createTimeline({
        autoplay: onScroll({ target: panel, enter: "bottom-=80 top", repeat: false }),
    }).add(panel, {
        clipPath: ["inset(0% 100% 0% 0%)", "inset(0% 0% 0% 0%)"],
        duration: 650,
        ease: "inOutQuart",
    });

    if (sfx.length) {
        tl.add(sfx, { opacity: [0, 1], scale: [2.2, 1], duration: 450, delay: stagger(120), ease: "outExpo" }, "-=250");
    }
    if (bubbles.length) {
        tl.add(bubbles, {
            opacity: [0, 1],
            scale: [0.5, 1],
            delay: stagger(260),
            ease: spring({ stiffness: 220, damping: 14 }),
        }, "-=200");
    }
    return tl;
};

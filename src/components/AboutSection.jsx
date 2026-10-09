import { createTimeline, createTimer, onScroll, spring, stagger, utils } from "animejs";
import { useAnimeScope } from "../hooks/useAnimeScope";
import { useSplitHeading } from "../hooks/useSplitHeading";
import { Bubble } from "./manga/Bubble";
import { ArtCrop, FocusLines, Sfx } from "./manga/Sfx";
import { revealPanel } from "./manga/reveal";
import { lightning, tornEdge } from "./manga/shapes";

const COLOR = "/hero/avatar.webp";

// Splash art is 1024×1536; the summon is choreographed in those pixel
// coordinates through an SVG overlay sharing the same viewBox.
const HAND = { x: 300, y: 835 };
const HAND_PCT = `${((HAND.x / 1024) * 100).toFixed(1)}% ${((HAND.y / 1536) * 100).toFixed(1)}%`;
const BLADE = { x1: 360, y1: 852, x2: 1008, y2: 1226 };
const BOLTS = lightning(13, HAND.x, HAND.y, 9, 170, 360);

const builds = [
    { title: "CRM ×2", stamp: "Shipped", text: "Two modules built end to end: React, Node and SQL stored procedures." },
    { title: "Play Store", stamp: "Live", text: "A Flutter finance app, offline-first and in real users' hands." },
    { title: "RAG Agent", stamp: "Deployed", text: "Multi-step intent detection automating real business workflows." },
];

const stats = [
    { value: 9.1, decimals: 1, label: "MCA CGPA" },
    { value: 2, label: "Internships" },
    { value: 7, label: "Projects" },
];

const format = (n, decimals) => (decimals ? n.toFixed(decimals) : String(Math.round(n)));

/**
 * About, told as a one-page manga chapter. Panels ink in left-to-right as
 * they scroll into view: frame wipes in, SFX slam down, then bubbles pop
 * in reading order. The splash lands with a screen shake, then he summons
 * the blade — and clicking the splash summons it again.
 */
export const AboutSection = () => {
    const headingRef = useSplitHeading();

    const rootRef = useAnimeScope((self) => {
        const root = self.root;
        const counters = root.querySelectorAll("[data-count]");
        const publish = (el, n) => {
            el.textContent = format(n, Number(el.dataset.decimals || 0));
        };

        // Reduced motion: show the finished page — sword drawn, numbers final
        if (self.matches.reduced) {
            counters.forEach((el) => publish(el, Number(el.dataset.count)));
            return;
        }

        const page = root.querySelector("[data-page]");
        const shake = (strength) => ({
            translateX: [0, -strength, strength * 0.8, -strength * 0.6, strength * 0.4, 0],
            translateY: [0, strength * 0.6, -strength * 0.5, strength * 0.3, -strength * 0.2, 0],
            duration: 380,
            ease: "linear",
        });

        root.querySelectorAll("[data-panel]:not([data-panel='splash'])").forEach(revealPanel);

        // --- Splash: land, speak, then summon the blade -------------------
        const splash = root.querySelector("[data-panel='splash']");
        const q = (sel) => splash.querySelectorAll(sel);
        const sword = q("[data-sword]");
        const bolts = q("[data-bolt]");
        const ring = q("[data-ring]");
        const glint = q("[data-glint]");
        const flash = q("[data-flash]");
        const shout = q("[data-bubble]");
        const shakin = q("[data-sfx]");

        utils.set(splash, { opacity: 0, scale: 1.08 });
        utils.set(shout, { opacity: 0, scale: 0.5 });
        utils.set(shakin, { opacity: 0, scale: 2.4 });
        utils.set(sword, { clipPath: `circle(0% at ${HAND_PCT})` });
        utils.set([bolts, ring, glint, flash], { opacity: 0 });

        // Energy gathers at the empty hand, then a shockwave ring bursts
        // out and the sword-drawn render is revealed inside it. The ring's
        // radius tracks the clip circle, hiding the seam between renders.
        const summon = createTimeline({ autoplay: false })
            .set(sword, { clipPath: `circle(0% at ${HAND_PCT})` })
            .set(shakin, { opacity: 0 })
            .add(bolts, {
                opacity: [0, 1, 0.4, 1],
                strokeDashoffset: [1, 0],
                duration: 520,
                delay: stagger(50),
                ease: "inOutQuad",
            })
            .add(flash, { opacity: [0, 0.9, 0], duration: 260, ease: "outQuad" }, "-=60")
            .add(sword, {
                clipPath: [`circle(0% at ${HAND_PCT})`, `circle(130% at ${HAND_PCT})`],
                duration: 700,
                ease: "outCubic",
            }, "<<+=40")
            .add(ring, {
                r: [0, 1700],
                strokeWidth: [28, 4],
                opacity: [1, 0],
                duration: 700,
                ease: "outCubic",
            }, "<<")
            .add(bolts, { opacity: 0, duration: 260 }, "<<+=120")
            .add(page, shake(9), "<<")
            .add(shakin, { opacity: [0, 1], scale: [2.4, 1], duration: 420, ease: "outExpo" }, "<<+=180")
            .add(glint, {
                opacity: [0, 1, 1, 0],
                strokeDashoffset: [0, -1.1],
                duration: 620,
                ease: "inOutSine",
            }, "<<+=120");

        createTimeline({
            autoplay: onScroll({ target: splash, enter: "bottom-=120 top", repeat: false }),
        })
            .add(splash, { opacity: [0, 1], scale: [1.08, 1], duration: 420, ease: "outExpo" })
            .add(page, shake(10), "-=140")
            .add(shout, { opacity: [0, 1], scale: [0.5, 1], ease: spring({ stiffness: 220, damping: 14 }) }, "-=100")
            .call(() => summon.restart(), "+=350");

        const replay = () => {
            if (!summon.paused && !summon.completed) return;
            summon.restart();
        };
        splash.addEventListener("click", replay);

        // Profile stats count up when the databook panel arrives
        counters.forEach((el) => {
            const target = Number(el.dataset.count);
            publish(el, 0);
            createTimer({
                duration: 1400,
                autoplay: onScroll({ target: el, enter: "bottom-=80 top", repeat: false }),
                onUpdate: (timer) => publish(el, target * timer.progress),
                onComplete: () => publish(el, target),
            });
        });

        return () => splash.removeEventListener("click", replay);
    });

    return (
        <section id="about" ref={rootRef} className="relative py-20 md:py-24 px-4">
            {/* Torn edge where the dark hero gives way to the paper pages */}
            <div
                aria-hidden="true"
                className="absolute inset-x-0 -top-5 h-6 bg-background"
                style={{ clipPath: tornEdge(3) }}
            />

            <header className="max-w-5xl mx-auto mb-8 md:mb-10 flex items-end justify-between gap-4 border-b-[3px] border-ink pb-3">
                <div className="text-left">
                    <p className="font-letter font-bold uppercase text-xs md:text-sm tracking-[0.2em] text-primary">
                        About me · Chapter 01
                    </p>
                    <h2 ref={headingRef} className="text-5xl md:text-7xl">The Strain</h2>
                </div>
                <span aria-hidden="true" className="font-jp text-5xl md:text-6xl text-primary leading-none">壱</span>
            </header>

            <div data-page className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-4">
                {/* P1 — establishing shot */}
                <div data-panel className="manga-panel col-span-2 md:col-span-6 aspect-[16/9] md:aspect-[21/8] bg-ink">
                    <img
                        src="/about/desk.webp"
                        alt="Late at night in Mumbai, Amey studies code on a monitor beside a window full of city lights"
                        width="1600"
                        height="900"
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover object-[50%_45%]"
                    />
                    <Bubble variant="caption" className="absolute top-4 left-4">Mumbai. 2:47 AM.</Bubble>
                    <Sfx tone="paper" rotate={-6} className="absolute bottom-4 md:bottom-6 left-[6%] text-3xl md:text-6xl">
                        tak tak tak
                    </Sfx>
                </div>

                {/* P2 — push in on the same 2:47 AM moment (P2 + P3 share a row on phones) */}
                <div data-panel className="manga-panel md:col-span-4 h-64 md:h-80 bg-ink">
                    <img
                        src="/about/desk-face.webp"
                        alt="Close on Amey's face, lit by the monitor, hand at his chin"
                        width="1360"
                        height="646"
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover object-[45%_50%]"
                    />
                    <Bubble
                        variant="thought"
                        className="absolute top-3 right-2 md:top-4 md:right-5 max-w-[90%] md:max-w-[15rem]"
                        textClassName="px-4 py-2.5 text-xs sm:text-sm md:px-8 md:py-5 md:text-lg"
                    >
                        Hour three.<br />Same bug.
                    </Bubble>
                </div>

                {/* P3 — reverse angle: mirrored and tighter */}
                <div data-panel className="manga-panel md:col-span-2 h-64 md:h-80 bg-ink">
                    <img
                        src="/about/desk-face-tight.webp"
                        alt=""
                        aria-hidden="true"
                        width="720"
                        height="720"
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover object-[60%_50%]"
                    />
                    <Bubble
                        tail="bottom-right"
                        className="absolute top-3 left-2 md:top-4 md:left-3"
                        textClassName="px-4 py-2.5 text-sm sm:text-base md:px-7 md:py-4 md:text-xl"
                    >
                        ...Found you.
                    </Bubble>
                </div>

                {/* P4 — the panic of 2022 */}
                <div data-panel className="manga-panel tone-dark col-span-2 md:col-span-3 h-72">
                    <Bubble variant="caption" className="absolute top-4 left-4 z-10">2022.</Bubble>
                    <Bubble variant="shout" seed={11} textClassName="px-10 py-8 text-lg md:text-xl" className="absolute top-[13%] left-[10%] -rotate-3">
                        AI will replace devs!
                    </Bubble>
                    <Bubble variant="shout" seed={23} textClassName="px-9 py-7 text-base md:text-lg" className="absolute top-[40%] right-[3%] rotate-2">
                        Jobs are gone.
                    </Bubble>
                    <Bubble variant="shout" seed={37} textClassName="px-10 py-8 text-lg md:text-xl" className="absolute bottom-[3%] left-[4%] rotate-1">
                        It's over for us!
                    </Bubble>
                    <Sfx jp tone="paper" rotate={8} className="absolute top-3 right-5 text-3xl md:text-4xl">ざわ</Sfx>
                    <Sfx jp tone="paper" rotate={-6} className="absolute bottom-5 right-[30%] text-2xl md:text-3xl">ざわ</Sfx>
                </div>

                {/* P5 — the turn: sunglasses come down, eyes only */}
                <div data-panel className="manga-panel col-span-2 md:col-span-3 aspect-[7/4] md:aspect-auto md:h-72 bg-ink">
                    <img
                        src="/about/eyes.webp"
                        alt="Extreme close-up: Amey lowers his sunglasses, eyes locked on the viewer"
                        width="1470"
                        height="840"
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <Bubble variant="thought" className="absolute top-3 left-3" textClassName="px-5 py-2.5 text-sm">
                        ...Fight it?
                    </Bubble>
                    <Bubble tail="top-left" className="absolute bottom-3 right-3" textClassName="px-7 py-3 text-xl">
                        No.
                    </Bubble>
                </div>

                {/* P6 — splash: the summon. Tall panel; the build panels stack beside it */}
                <div
                    data-panel="splash"
                    title="Summon again"
                    className="relative col-span-2 md:col-span-3 md:row-span-3 aspect-[2/3] border-[3px] border-ink bg-card cursor-pointer"
                >
                    <div className="absolute inset-0 overflow-hidden">
                        <img
                            src="/about/splash.webp"
                            alt="Amey stands with a towering AI guardian at his back"
                            width="1024"
                            height="1536"
                            loading="lazy"
                            className="absolute inset-0 w-full h-full select-none"
                        />
                        <img
                            data-sword
                            src="/about/splash-sword.webp"
                            alt=""
                            aria-hidden="true"
                            width="1024"
                            height="1536"
                            loading="lazy"
                            className="absolute inset-0 w-full h-full select-none"
                        />
                        <svg aria-hidden="true" viewBox="0 0 1024 1536" className="absolute inset-0 w-full h-full pointer-events-none">
                            <defs>
                                <filter id="summon-glow" x="-50%" y="-50%" width="200%" height="200%">
                                    <feGaussianBlur stdDeviation="6" result="blur" />
                                    <feMerge>
                                        <feMergeNode in="blur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>
                            <g filter="url(#summon-glow)" stroke="var(--primary)" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                {BOLTS.map((d, i) => (
                                    <path key={i} data-bolt d={d} pathLength="1" strokeDasharray="1" strokeDashoffset="1" strokeWidth="8" />
                                ))}
                                <circle data-ring cx={HAND.x} cy={HAND.y} r="0" strokeWidth="28" />
                            </g>
                            <line
                                data-glint
                                {...BLADE}
                                pathLength="1"
                                strokeDasharray="0.18 2"
                                stroke="white"
                                strokeWidth="14"
                                strokeLinecap="round"
                                filter="url(#summon-glow)"
                                opacity="0"
                            />
                        </svg>
                        <div data-flash className="absolute inset-0 bg-white pointer-events-none opacity-0" />
                    </div>

                    <Bubble variant="shout" seed={42} textClassName="px-11 py-10 md:px-12 md:py-11 text-xl md:text-3xl" className="absolute top-[2%] -left-2 md:-left-6 -rotate-6 z-10">
                        I'll make it<br />my ally.
                    </Bubble>
                    <Sfx jp tone="red" rotate={-8} className="absolute bottom-[3%] right-[3%] text-5xl md:text-7xl z-10">
                        シャキン
                    </Sfx>
                </div>

                {/* P7 — what he built */}
                {builds.map((b, i) => (
                    <div key={b.title} data-panel className="manga-panel col-span-2 md:col-span-3 p-5 pt-6 text-left flex flex-col justify-center">
                        {i === 0 && (
                            <Bubble variant="caption" dark className="absolute top-0 left-0 border-0">
                                And then, he built.
                            </Bubble>
                        )}
                        <h3 className="text-3xl md:text-4xl mt-6">{b.title}</h3>
                        <p className="mt-2 text-muted-foreground">{b.text}</p>
                        <Sfx tone="red" rotate={-10} className="mt-4 self-start border-[3px] border-primary px-2 pt-1 text-2xl [-webkit-text-stroke:0]">
                            {b.stamp}
                        </Sfx>
                    </div>
                ))}

                {/* P8 — character profile, databook style */}
                <div data-panel className="manga-panel col-span-2 md:col-span-4 text-left">
                    <div className="bg-ink text-card px-4 py-2 flex items-center justify-between">
                        <span className="font-display uppercase tracking-wider text-lg">Character Profile</span>
                        <span className="font-jp text-sm opacity-80">キャラ紹介</span>
                    </div>
                    <div className="p-5 grid sm:grid-cols-[7rem_1fr] gap-5">
                        <div className="relative w-28 h-28 border-[3px] border-ink bg-secondary overflow-hidden">
                            <ArtCrop src={COLOR} x={56} y={23} zoom={256} label="Portrait of Amey Bhogle" />
                        </div>
                        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
                            <dt className="font-letter font-bold uppercase text-muted-foreground">Name</dt>
                            <dd className="font-bold">Amey Bhogle</dd>
                            <dt className="font-letter font-bold uppercase text-muted-foreground">Class</dt>
                            <dd>Full-Stack Developer</dd>
                            <dt className="font-letter font-bold uppercase text-muted-foreground">Base</dt>
                            <dd>Mumbai, India</dd>
                            <dt className="font-letter font-bold uppercase text-muted-foreground">Abilities</dt>
                            <dd>React · Node.js · Express · Flutter · RAG &amp; LLM tooling</dd>
                            <dt className="font-letter font-bold uppercase text-muted-foreground">Weakness</dt>
                            <dd>Can't leave a bug unsolved</dd>
                        </dl>
                    </div>
                    <div className="grid grid-cols-3 border-t-[3px] border-ink">
                        {stats.map((s, i) => (
                            <div key={s.label} className={i ? "border-l-[3px] border-ink p-3 text-center" : "p-3 text-center"}>
                                <div data-count={s.value} data-decimals={s.decimals ?? 0} className="font-display text-3xl md:text-4xl text-primary tabular-nums">
                                    {format(s.value, s.decimals)}
                                </div>
                                <div className="font-letter font-bold uppercase text-xs text-muted-foreground">{s.label}</div>
                            </div>
                        ))}
                    </div>
                    <div className="px-5 pb-5 pt-1">
                        <a href="/AmeyBhogle_Resume.pdf" download className="ink-button-ghost w-full sm:w-auto">
                            Download CV
                        </a>
                    </div>
                </div>

                {/* P9 — the challenge */}
                <div data-panel className="manga-panel col-span-2 md:col-span-2 min-h-80 flex flex-col items-center justify-center gap-5 p-5">
                    <FocusLines seed={9} cx={50} cy={40} clear={30} className="opacity-90" />
                    <Bubble variant="shout" seed={77} textClassName="px-12 py-11 text-4xl md:text-5xl">
                        Try me.
                    </Bubble>
                    <Bubble variant="caption" className="relative text-center text-xs">
                        Open to work: full-time roles · freelance projects
                    </Bubble>
                    <a href="#contact" className="ink-button relative">Get In Touch</a>
                </div>
            </div>
        </section>
    );
};

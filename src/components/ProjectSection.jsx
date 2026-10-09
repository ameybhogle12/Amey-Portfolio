import { useEffect, useRef, useState } from "react";
import { ArrowRight, ExternalLink, Github, Lock, X } from "lucide-react";
import { animate, createTimeline, spring, stagger, utils } from "animejs";
import { cn } from "../lib/utils";
import { useAnimeScope } from "../hooks/useAnimeScope";
import { Bubble } from "./manga/Bubble";
import { FocusLines } from "./manga/Sfx";
import { revealPanel } from "./manga/reveal";
import { tornEdge } from "./manga/shapes";

// The art that opens the domain, shown as a tilted manga panel.
const SIGN = "/projects/domain/hand-sign.webp";

const canon = [
    {
        id: 1,
        title: "Trip & Track",
        tagline: "Offline-first finance app: multi-wallet ledgers, budgets, split-expense settling. Live on Google Play.",
        description:
            "An offline-first personal finance app built with Provider for state management and Hive for local persistence. Features a multi-wallet ledger, budget tracking, automated EMI and subscription logging via WorkManager, a split-expense settlement engine, savings goals, fl_chart analytics, biometric authentication, and CSV export.",
        image: "/projects/trip-and-track.webp",
        tags: ["Flutter", "Dart", "Provider", "Hive"],
        githubUrl: null,
        liveUrl: "https://play.google.com/store/apps/details?id=com.ameybhogle.expensetracker",
        liveLabel: "Live on Google Play",
    },
    {
        id: 2,
        title: "MYCROFT",
        subtitle: "Offline AI Voice Assistant",
        tagline: "Wake word, local LLM and neural TTS. Fully offline.",
        description:
            "A fully local voice assistant with wake-word detection, speech-to-text, a self-hosted LLM (Mistral via Ollama) for intent-to-action mapping, and neural TTS. Executes system commands with VAD-based listening and a live desktop UI — entirely offline, no cloud calls.",
        image: null,
        tags: ["Python", "Ollama", "Mistral", "Neural TTS"],
        githubUrl: null,
        // Personal assistant running on my own machine — source stays private
        repoPrivate: true,
        // Runs entirely in the terminal, so the card shows a stylised session
        // instead of a screenshot.
        terminalPreview: [
            "$ python mycroft.py",
            "● listening for wake word...",
            '▸ "mycroft, open my notes"',
            "✓ intent: open_app -> executing",
        ],
    },
    {
        id: 3,
        title: "AgriCare",
        tagline: "On-device crop inference plus LLM guidance, built for low connectivity.",
        description:
            "An offline-first Flutter app for rural connectivity, built as part of a research paper. Integrates TensorFlow Lite for on-device crop inference alongside an LLM for conversational farming and healthcare guidance, with a low-power UI designed for low-connectivity rural accessibility.",
        image: "/projects/agricare.webp",
        tags: ["Flutter", "Dart", "TensorFlow Lite"],
        githubUrl: "https://github.com/ameybhogle12/agricare_flutter_app.git",
    },
];

const sideStories = [
    {
        id: 4,
        title: "Admission Enquiry ChatBot",
        tagline: "Automates institute admission queries.",
        description:
            "A web-based chatbot that automates institute admission queries using a React frontend and Node.js backend.",
        image: "/projects/chatbot.webp",
        tags: ["React", "Node.js", "NLP"],
        githubUrl: null,
    },
    {
        id: 5,
        title: "One Piece Quiz App",
        tagline: "Android quiz with score tracking.",
        description:
            "An Android quiz application featuring interactive questions, score tracking, and smooth user navigation.",
        image: "/projects/quiz-app.webp",
        tags: ["Kotlin", "XML", "Android Studio"],
        githubUrl: "https://github.com/ameybhogle12/QuizApp.git",
    },
    {
        id: 6,
        title: "Tetris",
        tagline: "Classic Tetris from scratch: collisions and scoring.",
        description:
            "A classic Android Tetris game built from scratch, focusing on core game mechanics, collision logic, and scoring.",
        image: "/projects/tetris.webp",
        tags: ["Java", "Android Studio", "XML"],
        githubUrl: "https://github.com/ameybhogle12/Tetris.git",
    },
    {
        id: 7,
        title: "Weather Website",
        tagline: "Real-time weather in a JSP web app.",
        description:
            "A dynamic Java-based web application that displays real-time weather data using JSP and API integration.",
        image: "/projects/weather.webp",
        tags: ["Java", "JSP", "HTML/CSS"],
        githubUrl: "https://github.com/ameybhogle12/Weather-Website.git",
    },
];

// Screenshots sit in manga greyscale under a halftone screen, and bloom
// into full colour when their card is hovered or focused.
const HALFTONE =
    "transition-[filter,scale] duration-500 [filter:grayscale(1)_contrast(1.15)] group-hover:[filter:none] group-focus-visible:[filter:none] group-hover:scale-105";

// `bare` drops the manga screen, for the full-colour view in the modal.
const ProjectThumb = ({ project, bare = false }) => {
    if (project.image) {
        return (
            <div className="absolute inset-0 overflow-hidden">
                <img
                    src={project.image}
                    alt={`${project.title} screenshot`}
                    loading="lazy"
                    className={cn("w-full h-full object-cover", !bare && HALFTONE)}
                />
                {!bare && (
                    <div className="tone absolute inset-0 opacity-25 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-0 group-focus-visible:opacity-0" />
                )}
            </div>
        );
    }

    return (
        <div className="absolute inset-0 bg-[oklch(0.12_0.006_60)] p-4 flex flex-col gap-3 overflow-hidden select-none text-left">
            <div className="flex gap-1.5 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-primary/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-foreground/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-foreground/20" />
            </div>
            <div className="font-mono text-[11px] md:text-xs leading-6 space-y-0.5 min-w-0">
                {project.terminalPreview.map((line, i) => (
                    <p key={i} className={cn("truncate", i === 0 ? "text-primary" : "text-foreground/60")}>
                        {line}
                    </p>
                ))}
                <span className="inline-block w-1.5 h-3.5 bg-primary/80 align-middle animate-pulse" />
            </div>
        </div>
    );
};

const CanonCard = ({ project, index, flagship, onOpen }) => (
    <button
        type="button"
        data-card
        onClick={() => onOpen(project)}
        className={cn(
            "group relative manga-panel panel-hover flex flex-col text-left cursor-pointer min-h-0",
            "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary",
            flagship ? "col-span-2 md:col-span-3 md:row-span-2" : "md:col-span-2",
        )}
    >
        <div className="relative flex-1 min-h-0 border-b-[3px] border-ink">
            <ProjectThumb project={project} />
            {project.liveUrl && (
                <span className="absolute top-3 right-3 -rotate-6 border-[3px] border-primary bg-background/80 px-2 pt-0.5 font-sfx text-base md:text-xl text-primary">
                    Live!
                </span>
            )}
        </div>
        <div className="p-3 md:p-4 shrink-0">
            <p className="font-letter font-bold uppercase text-[0.65rem] md:text-xs tracking-[0.2em] text-primary">
                Canon {String(index + 1).padStart(2, "0")}
                {flagship && " · Flagship"}
            </p>
            <h3 className={cn("mt-0.5 leading-none", flagship ? "text-2xl md:text-5xl" : "text-xl md:text-3xl")}>
                {project.title}
            </h3>
            <p className={cn("mt-2 text-sm text-muted-foreground", flagship ? "hidden sm:block" : "hidden md:block")}>
                {project.tagline}
            </p>
            <ul className="mt-2 hidden md:flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                    <li key={tag} className="border border-ink/40 px-1.5 py-0.5 font-letter font-bold uppercase text-[0.65rem]">
                        {tag}
                    </li>
                ))}
            </ul>
        </div>
    </button>
);

const ProjectModal = ({ project, onClose }) => {
    const panelRef = useRef(null);

    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        const anim = animate(panelRef.current, {
            opacity: [0, 1],
            scale: [0.9, 1],
            rotate: [-2, 0],
            ease: spring({ mass: 1, stiffness: 160, damping: 15 }),
        });
        return () => {
            window.removeEventListener("keydown", onKey);
            anim.revert();
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
            <div className="absolute inset-0 bg-[oklch(0.1_0.006_60/0.75)] backdrop-blur-sm" />
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label={project.title}
                className="paper-page relative w-full max-w-3xl max-h-[90svh] overflow-y-auto border-[3px] border-ink shadow-[8px_8px_0_0_var(--primary)] text-left"
                style={{ opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-3 right-3 z-10 grid place-items-center w-10 h-10 bg-card border-2 border-ink hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="group relative h-60 md:h-auto md:min-h-[24rem] border-b-[3px] md:border-b-0 md:border-r-[3px] border-ink bg-ink">
                        <ProjectThumb project={project} bare />
                    </div>
                    <div className="p-6 md:p-8">
                        <Bubble variant="caption" dark>{project.subtitle ?? "Project file"}</Bubble>
                        <h3 className="mt-3 text-4xl md:text-5xl leading-none">{project.title}</h3>
                        <ul className="mt-4 flex flex-wrap gap-2">
                            {project.tags.map((tag) => (
                                <li key={tag} className="border-2 border-ink bg-card px-2 py-0.5 font-letter font-bold uppercase text-xs">
                                    {tag}
                                </li>
                            ))}
                        </ul>
                        <p className="mt-4 text-muted-foreground leading-relaxed">{project.description}</p>

                        <div className="mt-6 flex flex-col sm:flex-row items-stretch gap-3">
                            {project.liveUrl && (
                                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex-1 ink-button text-sm">
                                    {project.liveLabel ?? "View Live"} <ExternalLink size={16} />
                                </a>
                            )}
                            {project.githubUrl ? (
                                <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn("flex-1 text-sm", project.liveUrl ? "ink-button-ghost" : "ink-button")}
                                >
                                    View on GitHub <Github size={16} />
                                </a>
                            ) : project.repoPrivate ? (
                                <span className="flex-1 flex items-center justify-center gap-2 text-sm px-6 py-3 border-2 border-dashed border-ink text-muted-foreground select-none">
                                    Private project <Lock size={16} />
                                </span>
                            ) : (
                                !project.liveUrl && (
                                    <span className="flex-1 flex items-center justify-center gap-2 text-sm px-6 py-3 border-2 border-dashed border-ink text-muted-foreground select-none">
                                        Repo coming soon <Github size={16} />
                                    </span>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Projects as Chapter 04: the Domain Expansion. When the stage reaches the
 * top of the screen on the way down, scrolling locks while it plays: the
 * hand sign pops, "Domain Expansion" slams in, everything falls into the void,
 * and the canon projects fly out from behind it. Scrolling unlocks once
 * they land, and it re-arms when you scroll back up past it.
 */
export const ProjectsSection = () => {
    const [selected, setSelected] = useState(null);

    const rootRef = useAnimeScope((self) => {
        const root = self.root;
        root.querySelectorAll("[data-side]").forEach(revealPanel);
        if (self.matches.reduced) return;

        const stage = root.querySelector("[data-stage]");
        const q = (sel) => stage.querySelectorAll(sel);
        const sign = q("[data-sign]");
        const call = q("[data-domain-call]");
        const titles = q("[data-domain-title]");
        const lines = q("[data-lines]");
        const core = q("[data-core]");
        const cards = [...q("[data-card]")];
        const header = q("[data-stage-header]");

        // Cards launch from the stage's centre — measured before any
        // transform is applied, so the offsets are the true layout deltas.
        const s = stage.getBoundingClientRect();
        const deltas = cards.map((card) => {
            const r = card.getBoundingClientRect();
            return {
                x: s.left + s.width / 2 - (r.left + r.width / 2),
                y: s.top + s.height / 2 - (r.top + r.height / 2),
            };
        });

        utils.set(sign, { opacity: 0, scale: 0.4, rotate: -12 });
        utils.set(call, { opacity: 0, scale: 2.6 });
        utils.set(titles, { opacity: 0, translateY: 24 });
        utils.set(lines, { opacity: 0, scale: 0.6 });
        utils.set(core, { opacity: 0, scale: 0.2 });
        utils.set(header, { opacity: 0, translateY: -16 });
        cards.forEach((card, i) => {
            utils.set(card, { opacity: 0, translateX: deltas[i].x, translateY: deltas[i].y, scale: 0.15, rotate: (i - 1) * 18 });
        });

        const skipBtn = stage.querySelector("[data-skip]");
        let lockY = null;
        // idle | armed | playing | done — see check() below
        let state;
        const prevent = (e) => e.preventDefault();
        const SCROLL_KEYS = new Set([" ", "PageDown", "PageUp", "ArrowDown", "ArrowUp", "Home", "End"]);
        const onKey = (e) => {
            if (e.key === "Escape") skip();
            else if (SCROLL_KEYS.has(e.key)) e.preventDefault();
        };
        // Wheel, touch and keys are blocked; anything that still slips
        // through (a scrollbar drag) is held in place. A nav link click is
        // a clear "get me out", so it skips and lets the link go.
        const onLockedScroll = () => {
            if (lockY !== null && Math.abs(window.scrollY - lockY) > 2) {
                window.scrollTo({ top: lockY, behavior: "instant" });
            }
        };
        const onNavClick = (e) => {
            if (e.target.closest('a[href^="#"]')) skip();
        };
        const lock = () => {
            lockY = window.scrollY;
            window.addEventListener("wheel", prevent, { passive: false });
            window.addEventListener("touchmove", prevent, { passive: false });
            window.addEventListener("keydown", onKey);
            window.addEventListener("scroll", onLockedScroll, { passive: true });
            document.addEventListener("click", onNavClick, true);
            utils.set(skipBtn, { display: "inline-flex" });
        };
        const unlock = () => {
            if (lockY === null) return;
            lockY = null;
            window.removeEventListener("wheel", prevent);
            window.removeEventListener("touchmove", prevent);
            window.removeEventListener("keydown", onKey);
            window.removeEventListener("scroll", onLockedScroll);
            document.removeEventListener("click", onNavClick, true);
            utils.set(skipBtn, { display: "none" });
        };

        const tl = createTimeline({
            autoplay: false,
            onComplete: () => {
                state = "done";
                unlock();
            },
        })
            // 1 — the void opens and the sign pops
            .add(core, { opacity: [0, 1], scale: [0.2, 1], duration: 600, ease: "outQuad" }, 0)
            .add(lines, { opacity: [0, 0.3], scale: [0.6, 1], duration: 700, ease: "outQuad" }, 0)
            .add(sign, { opacity: [0, 1], scale: [0.4, 1.08, 1], rotate: [-14, -3], duration: 700, ease: "outBack(1.8)" }, 150)
            // 2 — "Domain Expansion" slams in, then the name
            .add(call, { opacity: [0, 1], scale: [2.6, 1], duration: 450, ease: "outExpo" }, 800)
            .add(titles, { opacity: [0, 1], translateY: [24, 0], duration: 500, ease: "outQuad" }, 1350)
            // 3 — hold, then everything falls away into the void
            .add([...sign, ...call, ...titles], { opacity: 0, scale: 1.6, duration: 450, ease: "inQuad" }, 2350)
            .add(lines, { opacity: 0.1, scale: 1.35, rotate: 25, duration: 1200, ease: "inOutSine" }, 2350)
            .add(core, { scale: 2.4, opacity: 0.35, duration: 900, ease: "inOutSine" }, 2350)
            // 4 — the canon flies out from behind it and settles
            .add(cards, {
                opacity: [0, 1],
                translateX: 0,
                translateY: 0,
                scale: 1,
                rotate: 0,
                duration: 850,
                delay: stagger(130),
                ease: "outBack(1.3)",
            }, 2600)
            .add(header, { opacity: [0, 1], translateY: [-16, 0], duration: 400, ease: "outQuad" }, 3300);

        function skip() {
            state = "done";
            tl.seek(tl.duration);
            unlock();
        }
        skipBtn.addEventListener("click", skip);

        // idle → armed → playing → done. The domain arms whenever the stage
        // sits below the trigger line, and plays the moment it crosses it on
        // the way down. Scrolling back up until the stage is fully off-screen
        // re-arms it, so coming down again replays it. Landing below it with
        // nothing armed (a reload mid-page) shows it finished.
        state = "idle";
        const arm = () => {
            if (state === "armed") return;
            state = "armed";
            tl.seek(0);
        };
        // A nav link to another section scrolls straight through: the domain
        // shows finished instead of hijacking the trip. Only #projects plays.
        let passThroughUntil = 0;
        const onAnyNavClick = (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;
            passThroughUntil = link.getAttribute("href") === "#projects" ? 0 : performance.now() + 3000;
        };
        const onScrollEnd = () => {
            passThroughUntil = 0;
        };

        const finish = () => {
            state = "done";
            tl.seek(tl.duration);
        };
        const check = () => {
            if (state === "playing") return;
            const top = stage.getBoundingClientRect().top;
            const vh = window.innerHeight;
            if (top > vh) {
                arm();
            } else if (top > vh * 0.15) {
                if (state === "idle") arm();
            } else if (state === "armed") {
                // Play only when the stage is actually on screen. A jump that
                // lands far past it (End key, a nav link) shows it finished.
                if (top < -vh * 0.5 || performance.now() < passThroughUntil) {
                    finish();
                    return;
                }
                state = "playing";
                window.scrollTo({ top: window.scrollY + top, behavior: "instant" });
                lock();
                tl.restart();
            } else if (state === "idle") {
                finish();
            }
        };
        window.addEventListener("scroll", check, { passive: true });
        window.addEventListener("scrollend", onScrollEnd);
        document.addEventListener("click", onAnyNavClick, true);
        check();

        return () => {
            window.removeEventListener("scroll", check);
            window.removeEventListener("scrollend", onScrollEnd);
            document.removeEventListener("click", onAnyNavClick, true);
            skipBtn.removeEventListener("click", skip);
            unlock();
        };
    });

    return (
        <section id="projects" ref={rootRef} className="ink-page relative">
            {/* Torn edge: the paper rips open into the domain */}
            <div aria-hidden="true" className="absolute inset-x-0 -top-5 h-6 bg-background z-10" style={{ clipPath: tornEdge(9) }} />

            <div
                data-stage
                className="relative h-svh min-h-[40rem] overflow-hidden flex flex-col px-4 pt-20 pb-6 md:pb-8 motion-reduce:h-auto motion-reduce:py-20"
            >
                {/* The void */}
                <div aria-hidden="true" className="absolute inset-0 tone opacity-[0.09] pointer-events-none" />
                <div
                    data-core
                    aria-hidden="true"
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vmin] h-[70vmin] rounded-full bg-[radial-gradient(closest-side,oklch(0.95_0.012_85/0.35),oklch(0.66_0.21_32/0.12)_55%,transparent)] pointer-events-none motion-reduce:hidden"
                />
                <FocusLines seed={21} cx={50} cy={50} clear={14} color="var(--foreground)" className="-inset-1/4 w-[150%] h-[150%] opacity-0 origin-center motion-reduce:hidden" />
                {/* Soft floor, so the void fades into the side stories instead of cutting off */}
                <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background to-transparent pointer-events-none" />

                {/* Intro: the hand sign and the domain's name */}
                <div aria-hidden="true" className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center pointer-events-none motion-reduce:hidden">
                    <div
                        data-sign
                        className="relative w-[min(46vmin,19rem)] aspect-square grid place-items-center bg-white border-[3px] border-foreground shadow-[8px_8px_0_0_var(--primary)] overflow-hidden"
                    >
                        <img src={SIGN} alt="" className="w-full h-full object-cover" />
                    </div>
                    <p data-domain-call className="mt-6 font-display uppercase tracking-[0.12em] text-3xl md:text-5xl leading-none text-primary">
                        Domain Expansion
                    </p>
                    <p data-domain-title className="mt-3 px-4 font-display uppercase text-4xl md:text-7xl leading-none">
                        Chimera Project Garden
                    </p>
                </div>

                <button
                    type="button"
                    data-skip
                    className="absolute bottom-6 right-4 md:right-8 z-30 hidden items-center gap-2 border-2 border-foreground/60 bg-background/70 px-3 py-1.5 font-letter font-bold uppercase text-xs tracking-wider text-foreground/80 hover:text-foreground hover:border-foreground"
                >
                    Skip ▸▸
                </button>

                {/* What the domain reveals */}
                <header data-stage-header className="relative z-10 max-w-5xl w-full mx-auto mb-3 md:mb-5 flex items-end justify-between gap-4 border-b-[3px] border-ink pb-2">
                    <div className="text-left">
                        <p className="font-letter font-bold uppercase text-xs md:text-sm tracking-[0.2em] text-primary">
                            Projects · Chapter 04
                        </p>
                        <h2 className="text-3xl md:text-6xl">Chimera Project Garden</h2>
                    </div>
                    <span aria-hidden="true" className="font-jp text-4xl md:text-5xl text-primary leading-none">肆</span>
                </header>

                <div className="relative z-10 flex-1 min-h-0 max-w-5xl w-full mx-auto grid grid-cols-2 md:grid-cols-5 grid-rows-[1.3fr_1fr] md:grid-rows-2 gap-3 md:gap-4 motion-reduce:min-h-[44rem]">
                    {canon.map((project, i) => (
                        <CanonCard
                            key={project.id}
                            project={project}
                            index={i}
                            flagship={i === 0}
                            onOpen={setSelected}
                        />
                    ))}
                </div>
            </div>

            {/* Side stories: the early works, smaller and in plain panels */}
            <div className="relative px-4 pt-6 pb-24 md:pb-28">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-3 mb-4 md:mb-6">
                        <Bubble variant="caption" className="bg-foreground text-background border-foreground">Side Stories</Bubble>
                        <span className="font-letter font-bold uppercase text-xs md:text-sm text-muted-foreground">Early works, where it started</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                        {sideStories.map((project) => (
                            <button
                                key={project.id}
                                type="button"
                                data-side
                                onClick={() => setSelected(project)}
                                className="group manga-panel panel-hover text-left flex sm:flex-col focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary"
                            >
                                <div className="relative w-28 sm:w-auto sm:h-32 shrink-0 border-r-[3px] sm:border-r-0 sm:border-b-[3px] border-ink">
                                    <ProjectThumb project={project} />
                                </div>
                                <div className="p-3 md:p-4">
                                    <h3 className="text-lg md:text-xl leading-tight">{project.title}</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">{project.tagline}</p>
                                    <p className="mt-2 font-letter font-bold uppercase text-[0.65rem] tracking-wider text-foreground/70">
                                        {project.tags.join(" · ")}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="mt-10 md:mt-12 text-center">
                        <a
                            className="ink-button"
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://github.com/ameybhogle12?tab=repositories"
                        >
                            All repos on GitHub <ArrowRight size={16} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Torn edge back to paper for the next chapter */}
            <div
                aria-hidden="true"
                className="absolute inset-x-0 -bottom-px h-6 rotate-180"
                style={{ clipPath: tornEdge(14), backgroundColor: "var(--paper-ground)" }}
            />

            {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
        </section>
    );
};

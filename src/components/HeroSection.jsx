import { useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import {
    animate,
    createAnimatable,
    createDraggable,
    createTimeline,
    spring,
    stagger,
    utils,
} from "animejs";
import { useMagnetic } from "../hooks/useMagnetic";
import { prefersReducedMotion } from "../lib/motion";

export const HeroSection = () => {
    const ctaRef = useMagnetic();
    const sectionRef = useRef(null);
    const titleRef = useRef(null);
    const nameRef = useRef(null);
    const descriptionRef = useRef(null);
    const buttonRef = useRef(null);
    const scrollRef = useRef(null);

    const orbRef = useRef(null);

    useEffect(() => {
        const chars = nameRef.current.querySelectorAll(".name-char");
        const nameText = nameRef.current.querySelector("text");

        utils.set([titleRef.current, descriptionRef.current, buttonRef.current], {
            opacity: 0,
            translateY: 20,
        });
        utils.set(chars, { strokeDasharray: 500, strokeDashoffset: 500 });

        // One choreographed intro: title -> strokes trace -> fill blooms
        // while the stroke recedes -> description -> button springs in
        const tl = createTimeline({ defaults: { ease: "outQuart" } })
            .add(titleRef.current, { opacity: [0, 1], translateY: [30, 0], duration: 900 })
            .add(chars, {
                strokeDashoffset: [500, 0],
                duration: 1700,
                delay: stagger(60),
                ease: "inOutQuart",
            }, "-=600")
            .add(nameText, { fillOpacity: [0, 1], duration: 1100, ease: "outQuad" }, "-=1100")
            .add(chars, { strokeOpacity: [1, 0.25], duration: 1000, ease: "outQuad" }, "<<+=300")
            .add(descriptionRef.current, { opacity: [0, 1], translateY: [30, 0], duration: 1100 }, "-=1500")
            .add(buttonRef.current, {
                opacity: [0, 1],
                scale: [0.8, 1],
                ease: spring({ mass: 1, stiffness: 150, damping: 15 }),
            }, "-=800");

        // Looping decorative motion is skipped entirely under reduced motion —
        // the global engine speed-up would turn these into a strobe.
        const decorative = !prefersReducedMotion();

        // Floating animation for scroll indicator
        if (decorative) {
            animate(scrollRef.current, {
                translateY: [0, 10, 0],
                duration: 2000,
                loop: true,
                ease: 'easeInOutQuad'
            });
        }

        // Name gently follows the cursor (Animatable = smooth eased chase)
        const nameFollow = createAnimatable(nameRef.current, {
            translateX: 600,
            translateY: 600,
            ease: "out(3)",
        });
        const onMouseMove = (e) => {
            const nx = (e.clientX / window.innerWidth) * 2 - 1;
            const ny = (e.clientY / window.innerHeight) * 2 - 1;
            nameFollow.translateX(nx * 16);
            nameFollow.translateY(ny * 12);
        };
        window.addEventListener("mousemove", onMouseMove, { passive: true });

        // Draggable orb: grab it and throw it, it bounces inside the section
        let orbDrag;
        let orbPulse;
        if (orbRef.current) {
            orbDrag = createDraggable(orbRef.current, {
                container: sectionRef.current,
            });
            if (decorative) {
                orbPulse = animate(".orb-core", {
                    scale: [1, 1.15],
                    duration: 1800,
                    alternate: true,
                    loop: true,
                    ease: "inOutSine",
                });
            }
        }

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            tl.revert();
            nameFollow.revert();
            if (orbDrag) orbDrag.revert();
            if (orbPulse) orbPulse.revert();
        };
    }, []);

    return (
        <section
            id="hero"
            ref={sectionRef}
            className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden"
        >
            {/* Draggable orb easter egg — grab it and throw it */}
            <div
                ref={orbRef}
                title="Go ahead, throw me"
                className="hidden md:block absolute top-[22%] right-[16%] z-10 w-12 h-12 cursor-grab active:cursor-grabbing"
            >
                <div
                    className="orb-core w-full h-full rounded-full bg-gradient-to-br from-primary to-purple-500"
                    style={{ boxShadow: "0 0 28px 8px rgba(139, 92, 246, 0.45)" }}
                />
            </div>

            <div className="container max-w-4xl mx-auto text-center z-10">
                <div className="space-y-6">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                        <span ref={titleRef} className="inline-block"> Hi, I'm</span>
                        <svg
                            ref={nameRef}
                            viewBox="0 0 560 100"
                            role="img"
                            aria-label="Amey Bhogle"
                            className="block mt-2 mx-auto w-[92%] max-w-[560px] overflow-visible"
                        >
                            <defs>
                                <linearGradient id="name-grad" gradientUnits="userSpaceOnUse" x1="50" y1="0" x2="510" y2="0">
                                    <stop offset="0%" stopColor="var(--color-primary)" />
                                    <stop offset="100%" stopColor="var(--color-purple-500, #a855f7)" />
                                </linearGradient>
                            </defs>
                            <text
                                x="280"
                                y="76"
                                textAnchor="middle"
                                fontSize="72"
                                className="font-bold tracking-tight"
                                fill="url(#name-grad)"
                                stroke="url(#name-grad)"
                                strokeWidth="2"
                                strokeLinejoin="round"
                                style={{ fillOpacity: 0 }}
                            >
                                {"Amey Bhogle".split("").map((char, i) => (
                                    <tspan key={i} className="name-char">
                                        {char === " " ? " " : char}
                                    </tspan>
                                ))}
                            </text>
                        </svg>
                    </h1>

                    <p ref={descriptionRef} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Full-Stack Developer working across React, Node.js and Express, with production
                        experience building CRM modules end-to-end and a live Flutter app on the Play Store.
                        Recently shipped a RAG-based AI agent that automates real business workflows.
                    </p>

                    <div ref={buttonRef} className="pt-4">
                        {/* The magnet drives the wrapper's transform so the
                            button keeps its own hover scale — both writing to
                            transform on one element would fight. */}
                        <span ref={ctaRef} className="inline-block">
                            <a href="#projects" className="cosmic-button bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full text-lg transition-transform inline-flex items-center gap-2 group">
                                View My Work
                                <ArrowDown className="h-4 w-4 group-hover:translate-y-1 transition-transform" />
                            </a>
                        </span>
                    </div>
                </div>
            </div>

            <div ref={scrollRef} className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                <span className="text-xs uppercase tracking-widest text-muted-foreground mb-2"> Scroll </span>
                <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center p-1">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                </div>
            </div>
        </section>
    );
};
import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import { Pause, Play } from "lucide-react";
import { Bubble } from "./manga/Bubble";
import { prefersReducedMotion } from "../lib/motion";

// Drop the track at public/audio/filler-vibe.mp3. It's fetched only when
// someone presses play, so it costs nothing on page load.
const TRACK = "/audio/filler-vibe.mp3";

/**
 * Arc 03: the non-canon present. Sits in the Experience chapter's arc
 * list, so it picks up the same panel reveal and seal stamp.
 */
export const FillerArc = () => {
    const audioRef = useRef(null);
    const notesRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [missing, setMissing] = useState(false);

    // Stop the music if the section ever unmounts mid-vibe
    useEffect(() => () => audioRef.current?.pause(), []);

    // Music notes drift up from the button while the track plays
    useEffect(() => {
        if (!playing || prefersReducedMotion()) return;
        const notes = notesRef.current.querySelectorAll("[data-note]");
        const anim = animate(notes, {
            translateY: [0, -46],
            translateX: (_, i) => [0, 12 + i * 14],
            rotate: (_, i) => [0, (i - 1) * 20],
            opacity: [0, 1, 0],
            duration: 1600,
            delay: stagger(450),
            loop: true,
            ease: "outSine",
        });
        return () => anim.revert();
    }, [playing]);

    const toggle = async () => {
        if (!audioRef.current) {
            audioRef.current = new Audio(TRACK);
            audioRef.current.loop = true;
            audioRef.current.volume = 0.6;
            audioRef.current.addEventListener("error", () => {
                setMissing(true);
                setPlaying(false);
            });
        }
        const audio = audioRef.current;
        if (playing) {
            audio.pause();
            setPlaying(false);
            return;
        }
        try {
            audio.currentTime = 0;
            await audio.play();
            setPlaying(true);
        } catch {
            setMissing(true);
        }
    };

    return (
        <div data-panel className="manga-panel border-dashed md:col-span-6 p-6 pt-14 md:p-8 md:pt-16 text-left">
            <Bubble variant="caption" dark className="absolute top-0 left-0 border-0">
                Jul 2026. Present day.
            </Bubble>
            <span
                aria-hidden="true"
                className="absolute top-4 right-4 md:top-6 md:right-6 -rotate-12 border-[3px] border-primary px-2 pt-1 font-sfx text-xl md:text-2xl text-primary"
            >
                Non-canon
            </span>

            <p className="font-letter font-bold uppercase tracking-[0.2em] text-sm text-primary">Arc 03</p>
            <h3 data-sfx className="text-4xl md:text-6xl mt-1 origin-left">The Filler Arc</h3>

            <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
                Currently in a long, <em>looong</em> filler episode: building side projects, sharpening
                skills and applying to jobs, waiting for the next canon arc to begin.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
                <span ref={notesRef} className="relative inline-flex">
                    <button
                        type="button"
                        onClick={toggle}
                        disabled={missing}
                        aria-pressed={playing}
                        className="ink-button-ghost"
                    >
                        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        {missing ? "Vibe unavailable" : playing ? "Pause the vibe" : "Click to feel the vibe"}
                    </button>
                    {["♪", "♫", "♪"].map((n, i) => (
                        <span
                            key={i}
                            data-note
                            aria-hidden="true"
                            className="absolute top-0 -right-4 text-xl text-primary opacity-0 pointer-events-none"
                        >
                            {n}
                        </span>
                    ))}
                </span>
                {playing && (
                    <span className="font-letter font-bold uppercase text-xs tracking-wider text-muted-foreground">
                        Now playing: filler episode OST
                    </span>
                )}
            </div>
        </div>
    );
};

import { animate, createTimer, stagger, utils } from "animejs";
import { cn } from "@/lib/utils";
import { useAnimeScope } from "../hooks/useAnimeScope";
import { useSplitHeading } from "../hooks/useSplitHeading";
import { Bubble } from "./manga/Bubble";
import { ArtCrop, FocusLines } from "./manga/Sfx";
import { revealPanel } from "./manga/reveal";

// Each category is a technique: a signature skill shouted like an attack
// name, and the rest stamped as tags underneath.
const techniques = [
  { no: "01", kanji: "顕現", name: "Interface Manifestation", category: "Frontend", signature: "React!", skills: ["JavaScript", "HTML/CSS", "Tailwind CSS"] },
  { no: "02", kanji: "構築", name: "Server Construction", category: "Backend", signature: "Node.js!", skills: ["Express.js", "REST APIs", "MSSQL", "MongoDB", "SQL", "Java"] },
  { no: "03", kanji: "携帯", name: "Pocket Domain", category: "Mobile", signature: "Flutter!", skills: ["Dart", "Kotlin", "Provider", "Hive", "Firebase"] },
  { no: "04", kanji: "呪具", name: "Cursed Tools", category: "Tools", signature: "GitHub!", skills: ["Figma", "Android Studio", "VS Code", "Unity"] },
  { no: "05", kanji: "式神", name: "Shikigami Summoning", category: "AI", signature: "RAG!", skills: ["MCP", "LLM Integration", "TensorFlow Lite", "Python", "Ollama"], art: true },
];

const LINE_FRAMES = 4;

// Diagonal gutters: the left panel's right edge and the right panel's left
// edge share one slope, and the right panel tucks under by the slope width
// minus the gutter, so the white channel between them stays parallel.
// Desktop only; on mobile the panels stack square.
const SLANT_LEFT = "md:[clip-path:polygon(0_0,100%_0,calc(100%_-_48px)_100%,0_100%)] md:pr-14";
const SLANT_RIGHT = "md:[clip-path:polygon(48px_0,100%_0,100%_100%,0_100%)] md:pl-14";

// AI panel art: a mask twice the panel's width, slid on hover so the
// guardian fades in from a sliver at the right edge to the whole panel.
const ART_MASK = {
  maskImage: "linear-gradient(to right, transparent 0%, transparent 22%, black 52%)",
  WebkitMaskImage: "linear-gradient(to right, transparent 0%, transparent 22%, black 52%)",
  maskSize: "200% 100%",
  WebkitMaskSize: "200% 100%",
};

const Technique = ({ t, side, className }) => (
  // The outer box is padded so the ink-outline filter has room to draw
  // inside it — the reveal's clip would otherwise shave the outer edges.
  <div data-panel data-technique className={cn("group relative ink-outline p-[3px]", className)}>
    <div
      className={cn(
        "relative h-full min-h-[19rem] bg-card overflow-hidden p-5 md:p-6 text-left",
        side === "left" && SLANT_LEFT,
        side === "right" && SLANT_RIGHT,
      )}
    >
      {t.art ? (
        <>
          {/* Hover: the guardian steps forward out of the dark */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-45 [mask-position:0%_0] [-webkit-mask-position:0%_0] transition-[mask-position,-webkit-mask-position,opacity] duration-700 ease-out group-hover:opacity-100 group-hover:[mask-position:100%_0] group-hover:[-webkit-mask-position:100%_0]"
            style={ART_MASK}
          >
            {/* Own soft left edge, so the art never shows a hard cut even fully revealed */}
            <div className="absolute inset-y-0 right-0 w-full md:w-[62%] [mask-image:linear-gradient(to_right,transparent,black_30%)]">
              <ArtCrop
                src="/about/splash.webp"
                x={50}
                y={9}
                zoom={100}
                className="transition-[scale,filter] duration-[1200ms] ease-out origin-[45%_10%] group-hover:scale-110 group-hover:[filter:contrast(1.2)_saturate(1.6)]"
              />
            </div>
          </div>
          <div
            aria-hidden="true"
            className="hidden md:block absolute left-[56%] -top-24 w-48 h-48 rounded-full bg-[radial-gradient(closest-side,oklch(0.66_0.21_32/0.55),transparent)] opacity-0 scale-50 transition-[opacity,scale] duration-700 group-hover:opacity-100 group-hover:scale-100 group-hover:animate-pulse pointer-events-none"
          />
        </>
      ) : (
        <FocusLines
          seed={Number(t.no) * 7}
          frames={LINE_FRAMES}
          cx={side === "left" ? 70 : 78}
          cy={58}
          clear={18}
          className="opacity-[0.13] origin-center"
        />
      )}

      <span aria-hidden="true" className="absolute top-4 right-5 md:right-8 font-jp text-2xl md:text-3xl text-primary">
        {t.kanji}
      </span>

      <div className={cn("relative", t.art && "md:max-w-[52%]")}>
        <Bubble variant="caption" dark>
          {t.art ? `Final technique · ${t.category}` : `Technique ${t.no} · ${t.category}`}
        </Bubble>
        <h3 className="text-3xl md:text-4xl mt-3 max-w-[13ch]">{t.name}</h3>

        <Bubble variant="shout" seed={Number(t.no) * 13} className="mt-3 -rotate-3" textClassName="px-9 py-7 text-2xl md:text-3xl">
          {t.signature}
        </Bubble>

        <ul className="mt-3 flex flex-wrap gap-2" aria-label={`${t.category} skills`}>
          {t.skills.map((skill, i) => (
            <li
              key={skill}
              data-tag
              className={cn(
                "border-2 border-ink bg-card px-2 py-0.5 font-letter font-bold uppercase text-xs md:text-sm",
                i % 2 ? "rotate-1" : "-rotate-1",
              )}
            >
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

/** Two techniques side by side, split by a diagonal gutter on desktop. */
const SlantRow = ({ left, right, split }) => (
  <div className="flex flex-col md:flex-row gap-3 md:gap-0">
    <Technique t={left} side="left" className={cn("md:shrink-0", split)} />
    <Technique t={right} side="right" className="md:flex-1 md:-ml-8" />
  </div>
);

/**
 * Hovering a technique panel makes its speed lines crackle: the burst flips
 * between pre-drawn variants every few frames while jittering in scale and
 * angle, and darkens — like the panel is charging up.
 */
const crackleOnHover = (panel) => {
  const lines = panel.querySelector("[data-lines]");
  if (!lines) return () => {};
  const frames = lines.querySelectorAll("[data-frame]");
  let current = 0;
  let timer;

  const show = (i) => {
    frames[current].setAttribute("opacity", 0);
    frames[i].setAttribute("opacity", 1);
    current = i;
  };

  const enter = () => {
    animate(lines, { opacity: 0.32, duration: 200, ease: "outQuad" });
    timer = createTimer({
      frameRate: 18,
      onUpdate: () => {
        show((current + 1 + Math.floor(Math.random() * (frames.length - 1))) % frames.length);
        utils.set(lines, {
          scale: utils.random(1.02, 1.1, 3),
          rotate: utils.random(-2.5, 2.5, 2),
        });
      },
    });
  };

  const leave = () => {
    timer?.revert();
    show(0);
    animate(lines, { opacity: 0.13, scale: 1, rotate: 0, duration: 350, ease: "outQuad" });
  };

  panel.addEventListener("pointerenter", enter);
  panel.addEventListener("pointerleave", leave);
  return () => {
    timer?.revert();
    panel.removeEventListener("pointerenter", enter);
    panel.removeEventListener("pointerleave", leave);
  };
};

/**
 * Skills as Chapter 03: five cursed techniques on a manga page with
 * diagonal gutters. AI closes the chapter as a full-width panel with the
 * About chapter's guardian looming behind it.
 */
export const SkillsSection = () => {
  const headingRef = useSplitHeading();

  const rootRef = useAnimeScope((self) => {
    if (self.matches.reduced) return;

    const panels = self.root.querySelectorAll("[data-technique]");
    panels.forEach((panel) => {
      const tl = revealPanel(panel);
      const tags = panel.querySelectorAll("[data-tag]");
      utils.set(tags, { opacity: 0, translateY: 10 });
      tl.add(tags, { opacity: [0, 1], translateY: [10, 0], duration: 300, delay: stagger(50), ease: "outQuad" }, "-=300");
    });

    const cleanups = [...panels].map(crackleOnHover);
    return () => cleanups.forEach((fn) => fn());
  });

  return (
    <section id="skills" ref={rootRef} className="relative py-20 md:py-24 px-4">
      <header className="max-w-5xl mx-auto mb-8 md:mb-10 flex items-end justify-between gap-4 border-b-[3px] border-ink pb-3">
        <div className="text-left">
          <p className="font-letter font-bold uppercase text-xs md:text-sm tracking-[0.2em] text-primary">
            Skills · Chapter 03
          </p>
          <h2 ref={headingRef} className="text-5xl md:text-7xl">Cursed Techniques</h2>
        </div>
        <span aria-hidden="true" className="font-jp text-5xl md:text-6xl text-primary leading-none">参</span>
      </header>

      <div className="max-w-5xl mx-auto space-y-3 md:space-y-4">
        <SlantRow left={techniques[0]} right={techniques[1]} split="md:w-[46%]" />
        <SlantRow left={techniques[2]} right={techniques[3]} split="md:w-[54%]" />
        <Technique t={techniques[4]} />
      </div>
    </section>
  );
};

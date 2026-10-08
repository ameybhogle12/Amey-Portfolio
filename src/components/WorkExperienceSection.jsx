import { animate, onScroll, spring, svg, utils } from "animejs";
import { useAnimeScope } from "../hooks/useAnimeScope";
import { useSplitHeading } from "../hooks/useSplitHeading";
import { Bubble } from "./manga/Bubble";
import { revealPanel } from "./manga/reveal";
import { FillerArc } from "./FillerArc";

// Told in story order: each internship is an arc, and each highlight a
// panel. Spans are out of 6 columns so the panels stagger like a page.
const arcs = [
  {
    name: "The Beginning Arc",
    company: "Benchmark Computer Solutions Ltd.",
    role: "Software Developer Intern",
    period: "Oct 2025 – Apr 2026",
    caption: "Oct 2025. The first production codebase.",
    summary:
      "Full-stack intern across multiple production systems: bug fixes, new features and redesigns in React, Node.js, Flutter and MSSQL, from employee management to CRM to a live international app.",
    stack: ["React", "Node.js", "Flutter", "MSSQL", "MySQL", "Figma"],
    highlights: [
      { span: 4, stat: "2", label: "CRM modules from scratch", text: "Full-stack ownership in Benchmark CRM: React screens, Node routes and SQL stored procedures on MSSQL." },
      { span: 2, stat: "80+", label: "Screens redesigned", text: "Reworked Captech eFORCE in Figma, for both mobile and web." },
      { span: 2, stat: "Bugs", label: "Hunted down", text: "Debugged and resolved issues in CASuite, a React, Node and MySQL employee management system." },
      { span: 4, stat: "Live", label: "International Flutter app", text: "Added loading screens across every feature of REConnect, a Flutter app running in production for international users." },
    ],
  },
  {
    name: "The Awakening Arc",
    company: "Divergent Insights Pvt. Ltd.",
    role: "MERN Stack Intern",
    period: "Apr 2026 – Jun 2026",
    caption: "Apr 2026. A live codebase. Built solo.",
    summary:
      "AI-focused internship at a global market research company, on their OSM platform. Solely responsible for designing and shipping an end-to-end LLM-powered automation system with MCP, Node.js, TypeScript and MongoDB on a live production codebase.",
    stack: ["Node.js", "TypeScript", "MongoDB", "MCP", "RAG", "Gemini", "Groq"],
    highlights: [
      { span: 4, stat: "MCP", label: "Server from scratch", text: "A production MCP server on MongoDB that lets AI read and change the database through natural language." },
      { span: 2, stat: "RAG", label: "Grounded answers", text: "Retrieval Augmented Generation keeps the AI's responses tied to real business data." },
      { span: 2, stat: "RFQ", label: "On autopilot", text: "A conversational interface creates RFQs and converts projects end to end, with confirmation steps before anything changes." },
      { span: 4, stat: "Email → Data", label: "Thread parser", text: "Gemini and Groq pull structured fields (LOI, CPI, qualifications) out of messy client threads, and multi-step intent detection classifies each thread by project status and suggests the next action." },
    ],
  },
];

const SPAN = { 2: "md:col-span-2", 4: "md:col-span-4" };

/**
 * Experience as Chapter 02: one arc per internship. A brush-stroke spine
 * inks itself down the page in step with scroll, each arc's seal stamps
 * onto it, and the panels use the same entrance as the About chapter.
 */
export const WorkExperienceSection = () => {
  const headingRef = useSplitHeading();

  const rootRef = useAnimeScope((self) => {
    if (self.matches.reduced) return;
    const root = self.root;

    root.querySelectorAll("[data-panel]").forEach(revealPanel);

    const spine = root.querySelector("[data-spine]");
    const [drawable] = svg.createDrawable(spine);
    animate(drawable, {
      draw: "0 1",
      ease: "linear",
      autoplay: onScroll({
        target: root.querySelector("[data-arcs]"),
        enter: "bottom-=120 top",
        leave: "bottom-=200 bottom",
        sync: true,
      }),
    });

    root.querySelectorAll("[data-seal]").forEach((seal) => {
      utils.set(seal, { scale: 0, rotate: -40 });
      animate(seal, {
        scale: [0, 1],
        rotate: [-40, -8],
        ease: spring({ stiffness: 200, damping: 12 }),
        autoplay: onScroll({ target: seal, enter: "bottom-=80 top", repeat: false }),
      });
    });
  });

  return (
    <section id="experience" ref={rootRef} className="relative py-20 md:py-24 px-4">
      <header className="max-w-5xl mx-auto mb-10 md:mb-14 flex items-end justify-between gap-4 border-b-[3px] border-ink pb-3">
        <div className="text-left">
          <p className="font-letter font-bold uppercase text-xs md:text-sm tracking-[0.2em] text-primary">
            Experience · Chapter 02
          </p>
          <h2 ref={headingRef} className="text-5xl md:text-7xl">The Arcs</h2>
        </div>
        <span aria-hidden="true" className="font-jp text-5xl md:text-6xl text-primary leading-none">弐</span>
      </header>

      <div data-arcs className="relative max-w-5xl mx-auto pl-10 md:pl-16">
        {/* Brush-stroke spine: rough-edged via displacement, inked on scroll */}
        <svg
          aria-hidden="true"
          viewBox="0 0 24 1000"
          preserveAspectRatio="none"
          className="absolute left-1 md:left-3 top-2 bottom-2 w-6 h-[calc(100%-1rem)] overflow-visible"
        >
          <defs>
            <filter id="brush-rough" x="-50%" y="0" width="200%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.9 0.04" numOctaves="2" seed="4" />
              <feDisplacementMap in="SourceGraphic" scale="5" />
            </filter>
          </defs>
          <path
            data-spine
            d="M12 0 C 9 120, 15 260, 12 400 S 9 700, 13 860 S 12 960, 12 1000"
            fill="none"
            stroke="var(--ink)"
            strokeWidth="5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            filter="url(#brush-rough)"
          />
        </svg>

        {arcs.map((arc, a) => (
          <article key={arc.name} className="relative">
            {a > 0 && (
              <div className="py-8 md:py-10 text-center">
                <Bubble variant="caption" dark className="text-sm md:text-base">
                  Six months later...
                </Bubble>
              </div>
            )}

            <div className="relative">
              {/* Arc seal, stamped onto the spine */}
              <span
                data-seal
                aria-hidden="true"
                className="absolute -left-10 md:-left-[3.75rem] top-6 grid place-items-center w-11 h-11 md:w-14 md:h-14 rounded-full bg-primary border-[3px] border-ink font-display text-lg md:text-2xl text-primary-foreground z-10"
              >
                {String(a + 1).padStart(2, "0")}
              </span>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-3 md:gap-4 text-left">
                {/* Arc title card */}
                <div data-panel className="manga-panel tone-dark md:col-span-6 p-6 pt-14 md:p-8 md:pt-16 text-card">
                  <Bubble variant="caption" className="absolute top-0 left-0 border-0 border-r-2 border-b-2 border-ink">
                    {arc.caption}
                  </Bubble>

                  <p className="font-letter font-bold uppercase tracking-[0.2em] text-sm text-primary">
                    Arc {String(a + 1).padStart(2, "0")}
                  </p>
                  <h3 data-sfx className="text-4xl md:text-6xl mt-1 origin-left">{arc.name}</h3>

                  <div className="mt-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 border-t border-card/25 pt-4">
                    <div>
                      <p className="text-lg md:text-xl font-bold">{arc.company}</p>
                      <p className="text-primary font-medium">{arc.role}</p>
                    </div>
                    <p className="font-letter font-bold uppercase text-sm text-card/80">{arc.period}</p>
                  </div>

                  <p className="mt-4 text-card/80 max-w-3xl leading-relaxed relative">{arc.summary}</p>

                  <ul className="mt-5 flex flex-wrap gap-2 relative" aria-label="Tech stack">
                    {arc.stack.map((tech) => (
                      <li key={tech} className="border border-card/40 px-2.5 py-1 font-letter font-bold uppercase text-xs text-card/90">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Highlight panels */}
                {arc.highlights.map((h) => (
                  <div key={h.label} data-panel className={`manga-panel ${SPAN[h.span]} p-5 md:p-6 flex flex-col`}>
                    <p className="font-display uppercase text-4xl md:text-5xl text-primary leading-none">{h.stat}</p>
                    <p className="mt-1 font-letter font-bold uppercase text-sm tracking-wide">{h.label}</p>
                    <p className="mt-3 text-muted-foreground leading-relaxed">{h.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}

        {/* Arc 03: the non-canon present */}
        <article className="relative">
          <div className="py-8 md:py-10 text-center">
            <Bubble variant="caption" dark className="text-sm md:text-base">
              Meanwhile, in the present day...
            </Bubble>
          </div>
          <div className="relative">
            <span
              data-seal
              aria-hidden="true"
              className="absolute -left-10 md:-left-[3.75rem] top-6 grid place-items-center w-11 h-11 md:w-14 md:h-14 rounded-full bg-card border-[3px] border-dashed border-ink font-display text-lg md:text-2xl text-ink z-10"
            >
              03
            </span>
            <div className="grid grid-cols-1 md:grid-cols-6">
              <FillerArc />
            </div>
          </div>
        </article>

        {/* Cliffhanger: the next arc is the reader's team */}
        <div className="pt-10 md:pt-12 flex flex-col items-end gap-3 text-right">
          <p className="font-letter font-bold italic uppercase text-2xl md:text-3xl">To be continued...</p>
          <a href="#contact" className="ink-button group">
            Next arc: your team
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

import { useEffect, useRef } from "react";
import { animate, svg, onScroll, spring } from "animejs";
import { useSplitHeading } from "../hooks/useSplitHeading";

export const WorkExperienceSection = () => {
  const sectionRef = useRef(null);
  const headingRef = useSplitHeading();
  const listRef = useRef(null);
  const lineRef = useRef(null);
  const workExperience = [
    {
      company: "Divergent Insights Pvt. Ltd.",
      role: "MERN Stack Intern",
      period: "Apr 2026 - Jun 2026",
      description:
        "AI-focused internship at a global market research company, working on their OSM platform. Solely responsible for designing and shipping an end-to-end LLM-powered automation system using MCP architecture, Node.js, TypeScript, and MongoDB on a live production codebase.",
      highlights: [
        "Built a production MCP server from scratch integrated with MongoDB, enabling AI-driven database manipulation through natural language",
        "Implemented RAG (Retrieval Augmented Generation) for context-aware responses, grounding the AI's outputs in real business data",
        "Developed an intelligent email thread parser using the Gemini and Groq APIs to extract structured business fields (LOI, CPI, qualifications) from unstructured client conversations",
        "Implemented multi-step intent detection to classify email threads by project status and surface contextual suggested actions",
        "Automated end-to-end RFQ creation and project conversion workflow via a conversational AI interface with confirmation flows",
      ],
    },
    {
      company: "Benchmark Computer Solutions Ltd.",
      role: "Software Developer Intern",
      period: "Oct 2025 - Apr 2026",
      description:
        "Full-stack development intern contributing across multiple production systems. Worked on bug resolution, feature implementation, and system redesigns using React, Node.js, Flutter, and MSSQL. Delivered solutions across employee management, CRM, and live international-scale applications.",
      highlights: [
        "Debugged and resolved issues in CASuite (React/Node/MySQL employee management system)",
        "Enhanced REConnect Flutter app with loading screens across all features for live international application",
        "Built 2 new modules from scratch in Benchmark CRM System (React/Node/MSSQL) with full-stack responsibility including SQL stored procedures",
        "Redesigned 80+ UI screens in Captech eFORCE using Figma for both mobile and web platforms",
      ],
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate(".experience-card", {
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 800,
            delay: (el, i) => i * 200,
            ease: "outQuart",
          });
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    const animations = [];

    // Timeline line draws itself in sync with scroll position
    if (lineRef.current && listRef.current) {
      const [drawable] = svg.createDrawable(lineRef.current);
      animations.push(
        animate(drawable, {
          draw: "0 1",
          ease: "linear",
          autoplay: onScroll({
            target: listRef.current,
            enter: "bottom top",
            leave: "center center",
            sync: true,
          }),
        })
      );
    }

    // Dots pop in with a spring as each card scrolls into view
    document.querySelectorAll(".timeline-dot").forEach((dot) => {
      animations.push(
        animate(dot, {
          scale: [0, 1],
          duration: 700,
          ease: spring({ stiffness: 180, damping: 14 }),
          autoplay: onScroll({ target: dot, enter: "bottom-=60 top" }),
        })
      );
    });

    return () => {
      observer.disconnect();
      animations.forEach((a) => a.revert());
    };
  }, []);

  return (
    <section id="experience" ref={sectionRef} className="py-15 px-4">
      <div className="container mx-auto max-w-5xl">
        <h2 ref={headingRef} className="text-3xl md:text-4xl font-bold mb-10 text-center">
          Work <span className="text-primary">Experience</span>
        </h2>

        <div className="relative space-y-6 pl-10" ref={listRef}>
          {/* Scroll-drawn timeline line */}
          <svg
            className="absolute left-[14px] top-3 bottom-3 w-[2px] overflow-visible"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="timeline-grad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="100%">
                <stop offset="0%" stopColor="var(--color-primary)" />
                <stop offset="100%" stopColor="var(--color-purple-500, #a855f7)" />
              </linearGradient>
            </defs>
            <line
              ref={lineRef}
              x1="1"
              y1="0"
              x2="1"
              y2="100%"
              stroke="url(#timeline-grad)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          {workExperience.map((item, index) => (
            <article
              key={`${item.company}-${index}`}
              className="experience-card relative p-6 rounded-2xl border border-border bg-card/70 backdrop-blur-md shadow-md text-left opacity-0"
            >
              <span
                className="timeline-dot absolute top-7 -left-[33px] w-4 h-4 rounded-full bg-primary ring-4 ring-primary/20"
                style={{ transform: "scale(0)" }}
              />
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 text-left">
                <div>
                  <h3 className="text-xl font-semibold">{item.company}</h3>
                  <p className="font-medium text-primary">{item.role}</p>
                </div>
                <span className="text-sm text-muted-foreground">{item.period}</span>
              </div>

              <p className="mt-4 text-muted-foreground text-left">{item.description}</p>

              <ul className="mt-3 list-disc list-outside pl-5 space-y-1 text-muted-foreground text-left">
                {item.highlights.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

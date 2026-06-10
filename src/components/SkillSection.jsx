import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { cn } from "../lib/utils";
import { animate, createLayout } from "animejs";
import { useSplitHeading } from "../hooks/useSplitHeading";

const skills = [
  // Frontend
  { name: "HTML/CSS", level: 80, category: "frontend" },
  { name: "JavaScript", level: 60, category: "frontend" },
  { name: "React", level: 60, category: "frontend" },
  { name: "Dart", level: 15, category: "frontend" },

  // Backend
  { name: "Java", level: 50, category: "backend" },
  { name: "Kotlin", level: 65, category: "backend" },
  { name: "Node.js", level: 40, category: "backend" },
  { name: "C#", level: 30, category: "backend" },
  { name: "SQL", level: 10, category: "backend" },

  // Tools
  { name: "Git/GitHub", level: 60, category: "tools" },
  { name: "Figma", level: 85, category: "tools" },
  { name: "VS Code", level: 95, category: "tools" },
  { name: "Unity", level: 25, category: "tools" },
  { name: "Blender", level: 35, category: "tools" },
  { name: "After Effects/Premiere Pro", level: 70, category: "tools" },
];

const categories = ["all", "frontend", "backend", "tools"];

const RING_RADIUS = 42;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

// Circular SVG progress ring that draws itself and counts up when visible
const SkillRing = ({ level, inView }) => {
  const circleRef = useRef(null);
  const numRef = useRef(null);

  useEffect(() => {
    if (!inView) return;

    animate(circleRef.current, {
      strokeDashoffset: [RING_CIRCUMFERENCE, RING_CIRCUMFERENCE * (1 - level / 100)],
      duration: 1500,
      delay: 200,
      ease: "outExpo",
    });

    const counter = { value: 0 };
    const counterAnim = animate(counter, {
      value: level,
      duration: 1500,
      delay: 200,
      ease: "outExpo",
      onUpdate: () => {
        if (numRef.current) {
          numRef.current.textContent = `${Math.round(counter.value)}%`;
        }
      },
    });

    return () => counterAnim.revert();
  }, [inView, level]);

  return (
    <div className="relative w-24 h-24">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={RING_RADIUS}
          fill="none"
          strokeWidth="8"
          className="stroke-secondary/40"
        />
        <circle
          ref={circleRef}
          cx="50"
          cy="50"
          r={RING_RADIUS}
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          stroke="url(#skill-ring-grad)"
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={RING_CIRCUMFERENCE}
        />
      </svg>
      <span
        ref={numRef}
        className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-primary"
      >
        0%
      </span>
    </div>
  );
};

export const SkillsSection = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const layoutRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [inView, setInView] = useState(false);
  const headingRef = useSplitHeading();

  const filteredSkills = skills.filter(
    (skill) => activeCategory === "all" || skill.category === activeCategory
  );

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Initialize Layout Engine
  useLayoutEffect(() => {
    if (gridRef.current && !isMobile) {
      layoutRef.current = createLayout(gridRef.current, {
        duration: 600,
        easing: 'out(3)',
      });
    }
    return () => {
      if (layoutRef.current) layoutRef.current.revert();
    };
  }, [isMobile]);

  const handleCategoryChange = (category) => {
    const isLayoutActive = layoutRef.current && !isMobile;
    
    if (isLayoutActive) {
      layoutRef.current.record();
    }
    
    setActiveCategory(category);
    
    if (isLayoutActive) {
      // Small timeout to ensure React has started the render cycle
      requestAnimationFrame(() => {
        layoutRef.current.animate({
          duration: 600,
          easing: 'out(4)',
        });
      });
    } else {
      // Fallback for mobile: simple fade stagger
      animate(".skill-card", {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 400,
        delay: (el, i) => i * 40,
        ease: "outQuad",
      });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Initial entry animation
          animate(".skill-card", {
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 600,
            delay: (el, i) => i * 80,
            ease: "outQuart",
          });

          // Rings animate themselves once visible
          setInView(true);

          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []); // Only run once on mount

  return (
    <section id="skills" ref={sectionRef} className="py-24 px-4 relative bg-background/45 dark:bg-background/20">
      <div className="container mx-auto max-w-5xl">
        <h2 ref={headingRef} className="text-3xl md:text-4xl font-bold mb-12 text-center">
          My <span className="text-primary"> Skills</span>
        </h2>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category, key) => (
            <button
              key={key}
              onClick={() => handleCategoryChange(category)}
              className={cn(
                "px-5 py-2 rounded-full transition-colors duration-300 capitalize",
                activeCategory === category
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-secondary/70 text-foreground hover:bg-secondary"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Shared gradient for all skill rings */}
        <svg className="absolute w-0 h-0" aria-hidden="true">
          <defs>
            <linearGradient id="skill-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="var(--color-purple-500, #a855f7)" />
            </linearGradient>
          </defs>
        </svg>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" ref={gridRef}>
          {filteredSkills.map((skill) => (
            <div
              key={skill.name} // Use name as key for better layout tracking
              className="skill-card bg-card p-6 rounded-lg shadow-xs border border-border/50 hover:border-primary/30 transition-all duration-300 card-hover flex flex-col items-center gap-3"
            >
              <SkillRing level={skill.level} inView={inView} />
              <h3 className="font-semibold text-lg text-center">{skill.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

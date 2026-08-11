import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { cn } from "../lib/utils";
import { animate, createLayout, stagger } from "animejs";
import { useSplitHeading } from "../hooks/useSplitHeading";

// The pills are flex-wrapped, so the column count depends on how the text
// happens to break. Counting how many share the first row's offsetTop gives
// anime a grid that matches what's actually on screen — a guessed constant
// would put the ripple's centre in the wrong place.
const measureGrid = (container) => {
  const items = Array.from(container?.children ?? []);
  if (!items.length) return [1, 1];

  const firstTop = items[0].offsetTop;
  const columns = items.filter((el) => el.offsetTop === firstTop).length || 1;
  return [columns, Math.ceil(items.length / columns)];
};

const skills = [
  // Frontend
  { name: "React", category: "frontend" },
  { name: "JavaScript", category: "frontend" },
  { name: "HTML/CSS", category: "frontend" },
  { name: "Tailwind CSS", category: "frontend" },

  // Backend
  { name: "Node.js", category: "backend" },
  { name: "Express.js", category: "backend" },
  { name: "REST APIs", category: "backend" },
  { name: "MSSQL", category: "backend" },
  { name: "MongoDB", category: "backend" },
  { name: "SQL", category: "backend" },
  { name: "Java", category: "backend" },

  // Mobile
  { name: "Flutter", category: "mobile" },
  { name: "Dart", category: "mobile" },
  { name: "Kotlin", category: "mobile" },
  { name: "Provider", category: "mobile" },
  { name: "Hive", category: "mobile" },
  { name: "Firebase", category: "mobile" },

  // AI
  { name: "RAG", category: "ai" },
  { name: "MCP", category: "ai" },
  { name: "LLM Integration", category: "ai" },
  { name: "TensorFlow Lite", category: "ai" },
  { name: "Python", category: "ai" },
  { name: "Ollama", category: "ai" },

  // Tools
  { name: "Git/GitHub", category: "tools" },
  { name: "Figma", category: "tools" },
  { name: "Android Studio", category: "tools" },
  { name: "VS Code", category: "tools" },
  { name: "Unity", category: "tools" },
];

const categories = ["all", "frontend", "backend", "mobile", "ai", "tools"];

export const SkillsSection = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const layoutRef = useRef(null);
  const prevCategoryRef = useRef("all");
  const [isMobile, setIsMobile] = useState(false);
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

  // Initialize Layout Engine. Note the key is `ease`, not `easing` —
  // LayoutAnimationParams has no `easing`, so that spelling is dropped
  // silently and you get the default curve.
  useLayoutEffect(() => {
    if (gridRef.current && !isMobile) {
      layoutRef.current = createLayout(gridRef.current, {
        duration: 600,
        ease: "out(3)",
      });
    }
    return () => {
      if (layoutRef.current) layoutRef.current.revert();
      layoutRef.current = null;
    };
  }, [isMobile]);

  const handleCategoryChange = (category) => {
    if (category === activeCategory) return;

    // FLIP needs the *old* geometry, so snapshot before React swaps the list.
    if (layoutRef.current && !isMobile) {
      layoutRef.current.record();
    }

    setActiveCategory(category);
  };

  // The reveal has to run after React has committed the new pill set.
  // Driving it from the click handler — even inside requestAnimationFrame —
  // measured and animated the *previous* list, because React 18 hasn't
  // necessarily committed by the next frame. That was the filter glitch on
  // desktop and mobile alike.
  useLayoutEffect(() => {
    if (prevCategoryRef.current === activeCategory) return;
    prevCategoryRef.current = activeCategory;

    if (layoutRef.current && !isMobile) {
      // enterFrom covers pills with no recorded position — FLIP alone has
      // nothing to move them from, so they'd otherwise just pop in. Exits are
      // instant regardless: React has already detached those nodes.
      layoutRef.current.animate({
        duration: 600,
        ease: "out(4)",
        enterFrom: { opacity: 0, scale: 0.8 },
      });
      return;
    }

    // Mobile has no layout engine attached — ripple the new set in instead.
    animate(".skill-pill", {
      opacity: [0, 1],
      duration: 400,
      delay: stagger(30, { grid: measureGrid(gridRef.current), from: "center" }),
      ease: "outQuad",
    });
  }, [activeCategory, isMobile]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Ripples outward from the middle of the cloud instead of sweeping
          // left-to-right, so the whole block reads as one wave.
          animate(".skill-pill", {
            opacity: [0, 1],
            translateY: [16, 0],
            scale: [0.9, 1],
            duration: 500,
            delay: stagger(45, {
              grid: measureGrid(gridRef.current),
              from: "center",
            }),
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

    return () => observer.disconnect();
  }, []); // Only run once on mount

  return (
    <section id="skills" ref={sectionRef} className="py-16 md:py-24 px-4 relative bg-background/45 dark:bg-background/20">
      <div className="container mx-auto max-w-5xl">
        <h2 ref={headingRef} className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center">
          My <span className="text-primary"> Skills</span>
        </h2>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 md:mb-12">
          {categories.map((category, key) => (
            <button
              key={key}
              onClick={() => handleCategoryChange(category)}
              className={cn(
                "px-4 py-1.5 text-sm sm:px-5 sm:py-2 sm:text-base rounded-full transition-colors duration-300 capitalize",
                activeCategory === category
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-secondary/70 text-foreground hover:bg-secondary"
              )}
            >
              {category === "ai" ? "AI" : category}
            </button>
          ))}
        </div>

        {/* Pills shrink on small screens so 29 of them don't stack two-per-row
            into a section you have to scroll through. */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3" ref={gridRef}>
          {filteredSkills.map((skill) => (
            <span
              key={skill.name}
              className="skill-pill px-3 py-1.5 text-xs sm:px-5 sm:py-2.5 sm:text-sm rounded-full bg-card border border-border/60 font-medium shadow-xs hover:border-primary/50 hover:text-primary hover:scale-105 transition-all duration-300 cursor-default"
            >
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

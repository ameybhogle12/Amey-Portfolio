import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { cn } from "../lib/utils";
import { animate, createLayout } from "animejs";
import { useSplitHeading } from "../hooks/useSplitHeading";

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

  // Initialize Layout Engine
  useLayoutEffect(() => {
    if (gridRef.current && !isMobile) {
      layoutRef.current = createLayout(gridRef.current, {
        duration: 600,
        easing: "out(3)",
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
          easing: "out(4)",
        });
      });
    } else {
      // Fallback for mobile: simple fade stagger
      animate(".skill-pill", {
        opacity: [0, 1],
        translateY: [12, 0],
        duration: 400,
        delay: (el, i) => i * 25,
        ease: "outQuad",
      });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate(".skill-pill", {
            opacity: [0, 1],
            translateY: [16, 0],
            scale: [0.9, 1],
            duration: 500,
            delay: (el, i) => i * 35,
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
    <section id="skills" ref={sectionRef} className="py-24 px-4 relative bg-background/45 dark:bg-background/20">
      <div className="container mx-auto max-w-5xl">
        <h2 ref={headingRef} className="text-3xl md:text-4xl font-bold mb-12 text-center">
          My <span className="text-primary"> Skills</span>
        </h2>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
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
              {category === "ai" ? "AI" : category}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3" ref={gridRef}>
          {filteredSkills.map((skill) => (
            <span
              key={skill.name}
              className="skill-pill px-5 py-2.5 rounded-full bg-card border border-border/60 text-sm font-medium shadow-xs hover:border-primary/50 hover:text-primary hover:scale-105 transition-all duration-300 cursor-default"
            >
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

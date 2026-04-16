import { useState, useEffect, useRef } from "react";
import { cn } from "../lib/utils";
import { animate } from "animejs";

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

export const SkillsSection = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  const filteredSkills = skills.filter(
    (skill) => activeCategory === "all" || skill.category === activeCategory
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Stagger cards
          animate(".skill-card", {
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 600,
            delay: (el, i) => i * 80,
            ease: "outQuart",
          });

          // Animate progress bars
          animate(".skill-progress-fill", {
            width: (el) => el.getAttribute("data-level") + "%",
            duration: 1500,
            delay: (el, i) => i * 100 + 400,
            ease: "outExpo",
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
  }, [activeCategory]); // Re-run if category changes to re-animate

  return (
    <section id="skills" ref={sectionRef} className="py-24 px-4 relative bg-background/45 dark:bg-background/20">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          My <span className="text-primary"> Skills</span>
        </h2>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category, key) => (
            <button
              key={key}
              onClick={() => setActiveCategory(category)}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" ref={gridRef}>
          {filteredSkills.map((skill, key) => (
            <div
              key={key}
              className="skill-card bg-card p-6 rounded-lg shadow-xs border border-border/50 hover:border-primary/30 transition-all duration-300 card-hover opacity-0"
            >
              <div className="text-left mb-4 flex justify-between items-center">
                <h3 className="font-semibold text-lg"> {skill.name}</h3>
                <span className="text-sm font-medium text-primary">
                  {skill.level}%
                </span>
              </div>
              <div className="w-full bg-secondary/30 h-2 rounded-full overflow-hidden">
                <div
                  className="skill-progress-fill bg-primary h-2 rounded-full origin-left"
                  data-level={skill.level}
                  style={{ width: "0%" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
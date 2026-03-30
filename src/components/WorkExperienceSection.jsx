import { motion } from "framer-motion";

export const WorkExperienceSection = () => {
  const workExperience = [
    {
      company: "Benchmark Computer Solutions Ltd.",
      role: "Software Intern",
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

  return (
    <section id="experience" className="py-15 px-4">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">
          Work <span className="text-primary">Experience</span>
        </h2>

        <div className="space-y-6">
          {workExperience.map((item, index) => (
            <motion.article
              key={`${item.company}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="p-6 rounded-2xl border border-border bg-card/70 backdrop-blur-md shadow-md text-left"
            >
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
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
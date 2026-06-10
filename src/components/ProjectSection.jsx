import { useState, useEffect, useRef } from "react";
import { ArrowRight, Github, X } from "lucide-react";
import { animate, spring } from "animejs";
import { cn } from "../lib/utils";
import { useSplitHeading } from "../hooks/useSplitHeading";

const projects = [
    {
        id: 1,
        title: "AgriCare",
        description: "An Android application that uses machine learning to provide crop-related insights through a clean and modern user interface.",
        image: "/projects/Agricare.png",
        tags: ["Kotlin", "Python", "Jetpack Compose"],
        githubUrl: "https://github.com/ameybhogle12/AgriCare.git",
    },
    {
        id: 2,
        title: "Admission Enquiry ChatBot",
        description:
            "A web-based chatbot that automates institute admission queries using a React frontend and Node.js backend.",
        image: "/projects/ChatBot.png",
        tags: ["React", "Node.js", "NLP"],
        githubUrl: "#",
    },
    {
        id: 3,
        title: "Tetris",
        description:
            "A classic Android Tetris game built from scratch, focusing on core game mechanics, collision logic, and scoring.",
        image: "/projects/Tetris.png",
        tags: ["Java", "Android Studio", "XML"],
        githubUrl: "https://github.com/ameybhogle12/Tetris.git",
    },
    {
        id: 4,
        title: "Weather Website",
        description:
            "A dynamic Java-based web application that displays real-time weather data using JSP and API integration.",
        image: "/projects/Weather.png",
        tags: ["Java", "JSP", "HTML/CSS"],
        githubUrl: "https://github.com/ameybhogle12/Weather-Website.git",
    },
    {
        id: 5,
        title: "One Piece Quiz App",
        description:
            "An Android quiz application featuring interactive questions, score tracking, and smooth user navigation.",
        image: "/projects/QuizApp.png",
        tags: ["Kotlin", "XML", "Android Studio"],
        githubUrl: "https://github.com/ameybhogle12/QuizApp.git",
    },
    {
        id: 6,
        title: "Trip & Track",
        description:
            "A personal finance Android app for tracking expenses, incomes, and split bills across multiple wallets. Features automatic subscription and EMI logging, budget monitoring with charts, savings goals, and biometric app lock — all stored fully offline.",
        image: "/projects/Trip & Track.png",
        tags: ["Flutter", "Dart", "Hive"],
        githubUrl: "In progress...",
    },
];

export const ProjectsSection = () => {
    const sectionRef = useRef(null);
    const modalRef = useRef(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const headingRef = useSplitHeading();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    animate(".project-card", {
                        opacity: [0, 1],
                        translateY: [50, 0],
                        scale: [0.95, 1],
                        duration: 800,
                        delay: (el, i) => i * 150,
                        ease: 'outQuart'
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
    }, []);

    // Spring the modal in when a project is selected. We deliberately do NOT
    // use the AutoLayout engine here — tracking a full-screen fixed overlay
    // (plus the split-heading spans) froze the main thread on open.
    useEffect(() => {
        if (selectedProject && modalRef.current) {
            animate(modalRef.current, {
                opacity: [0, 1],
                scale: [0.92, 1],
                translateY: [24, 0],
                duration: 650,
                ease: spring({ mass: 1, stiffness: 140, damping: 16 }),
            });
        }
    }, [selectedProject]);

    const handleProjectClick = (project) => setSelectedProject(project);
    const handleClose = () => setSelectedProject(null);

    return (
        <section id="projects" ref={sectionRef} className="py-24 px-4 relative">
            <div className="container mx-auto max-w-5xl">
                <h2 ref={headingRef} className="text-3xl md:text-4xl font-bold mb-4 text-center">
                    {" "}
                    Featured <span className="text-primary"> Projects </span>
                </h2>

                <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                    Here are some of my recent projects. Each project was carefully
                    crafted with attention to detail, performance, and user experience.
                </p>

                <div className={cn(
                    "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-opacity duration-500",
                    selectedProject ? "opacity-30 pointer-events-none blur-sm" : "opacity-100"
                )}>
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            onClick={() => handleProjectClick(project)}
                            className="project-card group bg-card rounded-lg overflow-hidden shadow-xs border border-border/50 hover:border-primary/50 transition-colors duration-300 card-hover cursor-pointer"
                        >
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            <div className="p-6">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.tags.slice(0, 3).map((tag, i) => (
                                        <span key={i} className="px-2 py-1 text-[10px] font-medium border rounded-full bg-secondary/50 text-secondary-foreground">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <h3 className="text-xl font-semibold mb-2"> {project.title}</h3>
                                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                                    {project.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <a
                        className="cosmic-button w-fit flex items-center mx-auto gap-2"
                        target="_blank"
                        href="https://github.com/ameybhogle12?tab=repositories"
                    >
                        Check My Github <ArrowRight size={16} />
                    </a>
                </div>
            </div>

            {/* Morphing Modal */}
            {selectedProject && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
                    onClick={handleClose}
                >
                    {/* Frosted Glass Backdrop */}
                    <div className="absolute inset-0 bg-background/40 backdrop-blur-xl animate-in fade-in duration-500" />
                    
                    <div
                        ref={modalRef}
                        className="relative w-full max-w-3xl bg-card rounded-2xl shadow-2xl border border-border/50 overflow-hidden"
                        style={{ opacity: 0 }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button 
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-2 rounded-full bg-background/50 hover:bg-background transition-colors z-10"
                        >
                            <X size={20} />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2">
                            <div className="h-64 md:h-full overflow-hidden">
                                <img
                                    src={selectedProject.image}
                                    alt={selectedProject.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-8">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {selectedProject.tags.map((tag, i) => (
                                        <span key={i} className="px-3 py-1 text-xs font-medium border rounded-full bg-secondary text-secondary-foreground">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <h3 className="text-3xl font-bold mb-4">{selectedProject.title}</h3>
                                <p className="text-muted-foreground leading-relaxed mb-8">
                                    {selectedProject.description}
                                </p>
                                
                                <div className="flex items-center gap-4">
                                    {selectedProject.githubUrl?.startsWith("http") ? (
                                        <a
                                            href={selectedProject.githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 cosmic-button flex items-center justify-center gap-2 text-sm"
                                        >
                                            View on GitHub <Github size={16} />
                                        </a>
                                    ) : (
                                        <span className="flex-1 flex items-center justify-center gap-2 text-sm px-6 py-2 rounded-full border border-border text-muted-foreground cursor-not-allowed select-none">
                                            Repo Coming Soon <Github size={16} />
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};


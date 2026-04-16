import { useEffect, useRef } from "react";
import { ArrowRight, ExternalLink, Github } from "lucide-react";
import { animate } from "animejs";

const projects = [
    {
        id: 1,
        title: "AgriCare",
        description: "An Android application that uses machine learning to provide crop-related insights through a clean and modern user interface.",
        image: "/projects/Agricare.png",
        tags: ["Kotlin", "Python", "Jetpack Compose"],
        demoUrl: "https://github.com/ameybhogle12/AgriCare.git",
        githubUrl: "https://github.com/ameybhogle12/AgriCare.git",
    },
    {
        id: 2,
        title: "Admission Enquiry ChatBot",
        description:
            "A web-based chatbot that automates institute admission queries using a React frontend and Node.js backend.",
        image: "/projects/ChatBot.png",
        tags: ["React", "Node.js", "NLP"],
        demoUrl: "#",
        githubUrl: "#",
    },
    {
        id: 3,
        title: "Tetris",
        description:
            "A classic Android Tetris game built from scratch, focusing on core game mechanics, collision logic, and scoring.",
        image: "/projects/Tetris.png",
        tags: ["Java", "Android Studio", "XML"],
        demoUrl: "https://github.com/ameybhogle12/Tetris.git",
        githubUrl: "https://github.com/ameybhogle12/Tetris.git",
    },
    {
        id: 4,
        title: "Weather Website",
        description:
            "A dynamic Java-based web application that displays real-time weather data using JSP and API integration.",
        image: "/projects/Weather.png",
        tags: ["Java", "JSP", "HTML/CSS"],
        demoUrl: "https://github.com/ameybhogle12/Weather-Website.git",
        githubUrl: "https://github.com/ameybhogle12/Weather-Website.git",
    },
    {
        id: 5,
        title: "One Piece Quiz App",
        description:
            "An Android quiz application featuring interactive questions, score tracking, and smooth user navigation.",
        image: "/projects/QuizApp.png",
        tags: ["Kotlin", "XML", "Android Studio"],
        demoUrl: "https://github.com/ameybhogle12/QuizApp.git",
        githubUrl: "https://github.com/ameybhogle12/QuizApp.git",
    },
    {
        id: 6,
        title: "Coming Soon...",
        description: "A light-driven puzzle game where shadows hide the path forward.",
        image: "/projects/Light.png",
        tags: ["C#", "Unity"],
        demoUrl: "#",
        githubUrl: "#",
    },
];

export const ProjectsSection = () => {
    const sectionRef = useRef(null);
    const gridRef = useRef(null);

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

    return (
        <section id="projects" ref={sectionRef} className="py-24 px-4 relative">
            <div className="container mx-auto max-w-5xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
                    {" "}
                    Featured <span className="text-primary"> Projects </span>
                </h2>

                <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                    Here are some of my recent projects. Each project was carefully
                    crafted with attention to detail, performance, and user experience.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" ref={gridRef}>
                    {projects.map((project, key) => (
                        <div
                            key={key}
                            className="project-card group bg-card rounded-lg overflow-hidden shadow-xs border border-border/50 hover:border-primary/50 transition-colors duration-300 card-hover opacity-0"
                        >
                            <div className="h-48 overflow-hidden">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>

                            <div className="p-6">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.tags.map((tag, i) => (
                                        <span key={i} className="px-2 py-1 text-xs font-medium border rounded-full bg-secondary text-secondary-foreground">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <h3 className="text-xl font-semibold mb-1"> {project.title}</h3>
                                <p className="text-muted-foreground text-sm mb-4">
                                    {project.description}
                                </p>
                                <div className="flex justify-between items-center">
                                    <div className="flex space-x-3">
                                        <a
                                            href={project.demoUrl}
                                            target="_blank"
                                            className="text-foreground/80 hover:text-primary transition-colors duration-300"
                                        >
                                            <ExternalLink size={20} />
                                        </a>
                                        <a
                                            href={project.githubUrl}
                                            target="_blank"
                                            className="text-foreground/80 hover:text-primary transition-colors duration-300"
                                        >
                                            <Github size={20} />
                                        </a>
                                    </div>
                                </div>
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
        </section>
    );
};
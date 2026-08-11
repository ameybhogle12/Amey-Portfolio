import { useEffect, useRef } from "react";
import { Code, Smartphone, Sparkles } from "lucide-react";
import { animate } from "animejs";
import { useSplitHeading } from "../hooks/useSplitHeading";

export const AboutSection = () => {
    const sectionRef = useRef(null);
    const leftContentRef = useRef(null);
    const rightContentRef = useRef(null);
    const headingRef = useSplitHeading();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    // Animate left content
                    animate(leftContentRef.current, {
                        opacity: [0, 1],
                        translateX: [-30, 0],
                        duration: 1000,
                        ease: "outQuart"
                    });

                    // Animate right cards with stagger
                    animate(".about-card", {
                        opacity: [0, 1],
                        translateX: [30, 0],
                        duration: 800,
                        delay: (el, i) => i * 200 + 200,
                        ease: "outQuart"
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
        <section id="about" ref={sectionRef} className="py-24 px-4 relative">
            <div className="container mx-auto max-w-5xl">
                <h2 ref={headingRef} className="text-3xl md:text-4xl font-bold mb-12 text-center">
                    About <span className="text-primary"> Me</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div 
                        ref={leftContentRef}
                        className="space-y-6 opacity-0"
                    >
                        <h3 className="text-2xl font-semibold">
                            Full-Stack Developer & Mobile App Builder
                        </h3>

                        <p className="text-muted-foreground">
                            I’m a Full-Stack Developer working across React, Node.js, Express and REST API
                            design, with production experience building CRM modules end-to-end — frontend,
                            backend routes, and SQL stored procedures.
                        </p>

                        <p className="text-muted-foreground">
                            I’ve shipped a Flutter finance app to the Google Play Store and built a
                            RAG-based AI agent with multi-step intent detection that automates real
                            business workflows. I like taking an idea all the way to something people
                            actually use.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
                            <a href="#contact" className="cosmic-button">
                                Get In Touch
                            </a>

                            <a
                                href="/AmeyBhogle_Resume.pdf"
                                download
                                className="px-6 py-2 rounded-full border border-primary text-primary hover:bg-primary/10 transition-colors duration-300"
                            >
                                Download CV
                            </a>
                        </div>
                    </div>

                    <div 
                        ref={rightContentRef}
                        className="grid grid-cols-1 gap-6"
                    >
                        <div className="about-card gradient-border p-6 card-hover opacity-0">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full bg-primary/10">
                                    <Code className="h-6 w-6 text-primary" />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-semibold text-lg"> Full-Stack Development</h4>
                                    <p className="text-muted-foreground">
                                        Building end-to-end web applications with React, Node.js and Express —
                                        REST APIs, database design, and SQL stored procedures.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="about-card gradient-border p-6 card-hover opacity-0">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full bg-primary/10">
                                    <Smartphone className="h-6 w-6 text-primary" />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-semibold text-lg">Mobile Development</h4>
                                    <p className="text-muted-foreground">
                                        Shipping offline-first Flutter and Android apps — including a personal
                                        finance app live on the Google Play Store.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="about-card gradient-border p-6 card-hover opacity-0">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full bg-primary/10">
                                    <Sparkles className="h-6 w-6 text-primary" />
                                </div>

                                <div className="text-left">
                                    <h4 className="font-semibold text-lg">AI & Automation</h4>
                                    <p className="text-muted-foreground">
                                        Building RAG pipelines, MCP servers and LLM-powered parsers that turn
                                        unstructured input into automated business workflows.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
import { useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import { animate, spring } from "animejs";

export const HeroSection = () => {
    const sectionRef = useRef(null);
    const titleRef = useRef(null);
    const nameRef = useRef(null);
    const descriptionRef = useRef(null);
    const buttonRef = useRef(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        // Initial state: hidden
        animate([titleRef.current, nameRef.current, descriptionRef.current, buttonRef.current], {
            opacity: 0,
            translateY: 20,
            duration: 0
        });

        // Split name into letters for animation if possible, 
        // but for now let's just do a clean stagger of the components
        
        const timeline = [
            {
                target: titleRef.current,
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 800,
                ease: 'outQuart'
            },
            {
                target: nameRef.current,
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 800,
                ease: 'outQuart',
                delay: -600 // overlap
            },
            {
                target: descriptionRef.current,
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 1000,
                ease: 'outQuart',
                delay: -600
            },
            {
                target: buttonRef.current,
                opacity: [0, 1],
                scale: [0.9, 1],
                duration: 800,
                ease: spring({ mass: 1, stiffness: 100, damping: 10 }),
                delay: -600
            }
        ];

        // Execute timeline manually in V4 (V4 timeline API is slightly different or replaced by sequences)
        // Actually, we can just run them with delays
        animate(titleRef.current, { opacity: [0, 1], translateY: [30, 0], duration: 1000, ease: 'outQuart' });
        animate(nameRef.current, { opacity: [0, 1], translateY: [30, 0], duration: 1000, ease: 'outQuart', delay: 200 });
        animate(descriptionRef.current, { opacity: [0, 1], translateY: [30, 0], duration: 1200, ease: 'outQuart', delay: 400 });
        animate(buttonRef.current, { 
            opacity: [0, 1], 
            scale: [0.8, 1], 
            duration: 1000, 
            ease: spring({ mass: 1, stiffness: 150, damping: 15 }), 
            delay: 600 
        });

        // Floating animation for scroll indicator
        animate(scrollRef.current, {
            translateY: [0, 10, 0],
            duration: 2000,
            loop: true,
            ease: 'easeInOutQuad'
        });

    }, []);

    return (
        <section
            id="hero"
            ref={sectionRef}
            className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden"
        >
            {/* Subtle light effect following mouse could be added here */}
            
            <div className="container max-w-4xl mx-auto text-center z-10">
                <div className="space-y-6">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                        <span ref={titleRef} className="inline-block"> Hi, I'm</span>
                        <div ref={nameRef} className="block mt-2">
                             <span className="text-primary">Amey</span>
                             <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent ml-3">
                                Bhogle
                            </span>
                        </div>
                    </h1>

                    <p ref={descriptionRef} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Software Developer with a strong interest in Android and full-stack development.
                        Experienced in building real-world projects including AI chatbots, games, and web applications.
                        Always learning and focused on writing clean, practical code.
                    </p>

                    <div ref={buttonRef} className="pt-4">
                        <a href="#projects" className="cosmic-button bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full text-lg transition-transform inline-flex items-center gap-2 group">
                            View My Work
                            <ArrowDown className="h-4 w-4 group-hover:translate-y-1 transition-transform" />
                        </a>
                    </div>
                </div>
            </div>

            <div ref={scrollRef} className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                <span className="text-xs uppercase tracking-widest text-muted-foreground mb-2"> Scroll </span>
                <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center p-1">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                </div>
            </div>
        </section>
    );
};
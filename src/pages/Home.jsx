import { AboutSection } from "../components/AboutSection";
import { ContactSection } from "../components/ContactSection";
import { HeroSection } from "../components/HeroSection";
import { Navbar } from "../components/Navbar";
import { ProjectsSection } from "../components/ProjectSection";
import { SkillsSection } from "../components/SkillSection";
import { StarBackground } from "../components/StarBackground";
import { ThemeToggle } from "../components/ThemeToggle";
import { Toaster } from "@/components/ui/sonner";

export const Home = () => {
    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            <Toaster />
            
            <ThemeToggle/>

            <StarBackground/>

            <Navbar/>

            <HeroSection/>

            <AboutSection/>

            <SkillsSection/>

            <ProjectsSection/>
             
             <ContactSection/>

        </div>
    );
};
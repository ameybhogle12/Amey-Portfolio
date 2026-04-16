import { AboutSection } from "../components/AboutSection";
import { ContactSection } from "../components/ContactSection";
import { HeroSection } from "../components/HeroSection";
import { Navbar } from "../components/Navbar";
import { ProjectsSection } from "../components/ProjectSection";
import { SkillsSection } from "../components/SkillSection";
import { StarBackground } from "../components/StarBackground";
import { FloatingShapes } from "../components/FloatingShapes";
import { CursorGlow } from "../components/CursorGlow";
import { WorkExperienceSection } from "../components/WorkExperienceSection";
import { Toaster } from "@/components/ui/sonner";

export const Home = () => {
    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            <Toaster />

            <StarBackground/>
            <FloatingShapes />
            <CursorGlow />
            <Navbar/>

            <HeroSection/>

            <AboutSection/>

            <WorkExperienceSection />

            <SkillsSection/>

            <ProjectsSection/>
             
             <ContactSection/>

        </div>
    );
};
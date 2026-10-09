import { AboutSection } from "../components/AboutSection";
import { ContactSection } from "../components/ContactSection";
import { HeroSection } from "../components/HeroSection";
import { Navbar } from "../components/Navbar";
import { ProjectsSection } from "../components/ProjectSection";
import { SkillsSection } from "../components/SkillSection";
import { WorkExperienceSection } from "../components/WorkExperienceSection";
import { Toaster } from "@/components/ui/sonner";

export const Home = () => {
    return (
        <div className="min-h-screen overflow-x-clip">
            <Toaster />

            <Navbar/>

            <HeroSection/>

            {/* Everything after the hero is printed on paper */}
            <main className="paper-page">
                <AboutSection/>

                <WorkExperienceSection />

                <SkillsSection/>

                <ProjectsSection/>

                <ContactSection/>
            </main>

        </div>
    );
};

import { useEffect, useState } from "react";

// id, size, x, y, opacity, animationDuration
// id, size, x, y, delay, animationDuration

export const StarBackground = () => {
  const [stars, setStars] = useState([]);
  const [meteors, setMeteors] = useState([]);
  const [lightSparkles, setLightSparkles] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === "undefined") return true;
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) return storedTheme === "dark";
    return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? true;
  });

  const generateStars = () => {
    const numberOfStars = Math.floor(
      (window.innerWidth * window.innerHeight) / 10000
    );

    const newStars = [];

    for (let i = 0; i < numberOfStars; i++) {
      newStars.push({
        id: i,
        size: Math.random() * 3 + 1,
        x: Math.random() * 100,
        y: Math.random() * 100,
        opacity: Math.random() * 0.5 + 0.5,
        animationDuration: Math.random() * 4 + 2,
      });
    }

    setStars(newStars);
  };

  const generateMeteors = () => {
    const numberOfMeteors = 4;
    const newMeteors = [];

    for (let i = 0; i < numberOfMeteors; i++) {
      newMeteors.push({
        id: i,
        size: Math.random() * 2 + 1,
        x: Math.random() * 100,
        y: Math.random() * 20,
        delay: Math.random() * 15,
        animationDuration: Math.random() * 3 + 3,
      });
    }

    setMeteors(newMeteors);
  };

  const generateLightSparkles = () => {
    const count = Math.floor((window.innerWidth * window.innerHeight) / 22000);
    const newSparkles = [];

    for (let i = 0; i < count; i++) {
      const baseSize = Math.random() * 4 + 2;
      newSparkles.push({
        id: i,
        size: baseSize,
        x: Math.random() * 100,
        y: Math.random() * 100,
        opacity: Math.random() * 0.35 + 0.35,
        animationDuration: Math.random() * 5 + 2,
      });
    }

    setLightSparkles(newSparkles);
  };

  useEffect(() => {
    const syncTheme = () => {
      const hasDarkClass = document.documentElement.classList.contains("dark");
      setIsDarkMode(hasDarkClass);
    };

    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const handleResize = () => {
      if (isDarkMode) {
        generateStars();
      } else {
        generateLightSparkles();
      }
    };

    if (isDarkMode) {
      generateStars();
      generateMeteors();
    } else {
      generateLightSparkles();
    }

    window.addEventListener("resize", handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [isDarkMode]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {isDarkMode ? (
        <>
          {stars.map((star) => (
            <div
              key={star.id}
              className="star animate-pulse-subtle"
              style={{
                width: star.size + "px",
                height: star.size + "px",
                left: star.x + "%",
                top: star.y + "%",
                opacity: star.opacity,
                animationDuration: star.animationDuration + "s",
              }}
            />
          ))}

          {meteors.map((meteor) => (
            <div
              key={meteor.id}
              className="meteor animate-meteor"
              style={{
                width: meteor.size * 50 + "px",
                height: meteor.size + "px",
                left: meteor.x + "%",
                top: meteor.y + "%",
                animationDelay: meteor.delay,
                animationDuration: meteor.animationDuration + "s",
              }}
            />
          ))}
        </>
      ) : (
        <>
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_15%,rgba(255,255,255,0.92),transparent_38%)]" />
          <div className="absolute top-8 right-8 h-56 w-56 rounded-full bg-yellow-200/60 blur-3xl animate-[pulse_5s_ease-in-out_infinite]" />
          <div className="absolute -bottom-12 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(255,248,204,0.45),rgba(255,248,204,0)_70%)] blur-3xl" />

          {lightSparkles.map((sparkle) => (
            <div
              key={sparkle.id}
              className="light-sparkle animate-pulse-subtle"
              style={{
                width: sparkle.size + "px",
                height: sparkle.size + "px",
                left: sparkle.x + "%",
                top: sparkle.y + "%",
                opacity: sparkle.opacity,
                animationDuration: sparkle.animationDuration + "s",
              }}
            />
          ))}
        </>
      )}
    </div>
  );
};
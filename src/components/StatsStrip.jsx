import { createTimer, onScroll } from "animejs";
import { useAnimeScope } from "../hooks/useAnimeScope";

const stats = [
  { value: 9.1, decimals: 2, label: "MCA CGPA" },
  { value: 2, label: "Internships" },
  { value: 7, label: "Projects Built" },
];

const format = (n, stat) =>
  `${stat.decimals ? n.toFixed(stat.decimals) : Math.round(n)}${stat.suffix ?? ""}`;

export const StatsStrip = () => {
  const rootRef = useAnimeScope((self) => {
    const cells = self.root.querySelectorAll("[data-stat]");

    cells.forEach((cell, i) => {
      const stat = stats[i];
      const target = cell.querySelector("[data-value]");

      // Under reduced motion, skip the count and just publish the number.
      if (self.matches.reduced) {
        target.textContent = format(stat.value, stat);
        return;
      }

      createTimer({
        duration: 1600,
        // A Timer is a tickable like any animation, so onScroll can own its
        // playback — the count starts when the strip actually comes into view.
        autoplay: onScroll({ target: cell, enter: "bottom-=40 top" }),
        onUpdate: (timer) => {
          target.textContent = format(stat.value * timer.progress, stat);
        },
        onComplete: () => {
          target.textContent = format(stat.value, stat);
        },
      });
    });
  });

  return (
    <section className="px-4 pb-8" aria-label="Key statistics">
      <div
        ref={rootRef}
        className="container mx-auto max-w-3xl grid grid-cols-3 gap-3 sm:gap-4"
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            data-stat
            className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-4 sm:p-6 text-center card-hover"
          >
            <div
              data-value
              className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-br from-primary to-purple-500 bg-clip-text text-transparent tabular-nums"
            >
              {format(0, stat)}
            </div>
            <div className="mt-1 text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

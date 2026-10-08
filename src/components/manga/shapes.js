// Deterministic shape generators for the manga kit. Everything is seeded so
// a bubble or torn edge renders identically on every load (and in SSR/HMR),
// instead of reshuffling its spikes each render.

export const seeded = (seed) => {
    let t = seed >>> 0;
    return () => {
        t += 0x6d2b79f5;
        let r = Math.imul(t ^ (t >>> 15), 1 | t);
        r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
        return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
};

const pct = (n) => `${n.toFixed(2)}%`;

/** Jagged shout-bubble outline as a CSS clip-path polygon. */
export const starburst = (seed = 1, spikes = 22, inner = 40, outer = 50) => {
    const rand = seeded(seed);
    const points = [];
    for (let i = 0; i < spikes * 2; i++) {
        const a = (i / (spikes * 2)) * Math.PI * 2;
        const r = i % 2 === 0 ? outer - rand() * 3 : inner - rand() * 4;
        points.push(`${pct(50 + r * Math.cos(a))} ${pct(50 + r * Math.sin(a))}`);
    }
    return `polygon(${points.join(", ")})`;
};

/**
 * Manga focus lines (集中線): thin ink wedges converging on a point,
 * leaving a clear oval around it. Returns SVG path data in a 0–100 box.
 */
export const focusLines = (seed = 7, count = 110, cx = 50, cy = 50, clear = 26) => {
    const rand = seeded(seed);
    let d = "";
    for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2 + rand() * 0.04;
        const w = 0.006 + rand() * 0.018;
        const r0 = clear + rand() * 14;
        const R = 90;
        const x1 = cx + R * Math.cos(a - w), y1 = cy + R * Math.sin(a - w);
        const x2 = cx + R * Math.cos(a + w), y2 = cy + R * Math.sin(a + w);
        const xt = cx + r0 * Math.cos(a), yt = cy + r0 * Math.sin(a);
        d += `M${x1.toFixed(2)} ${y1.toFixed(2)}L${x2.toFixed(2)} ${y2.toFixed(2)}L${xt.toFixed(2)} ${yt.toFixed(2)}Z`;
    }
    return d;
};

/**
 * Jagged energy bolts radiating from a point, as separate SVG path strings
 * (one per bolt, so they can be drawn on with a stagger).
 */
export const lightning = (seed = 13, x = 0, y = 0, bolts = 7, minLen = 110, maxLen = 260) => {
    const rand = seeded(seed);
    return Array.from({ length: bolts }, (_, i) => {
        const a = (i / bolts) * Math.PI * 2 + rand() * 0.6;
        const len = minLen + rand() * (maxLen - minLen);
        const steps = 5 + Math.floor(rand() * 3);
        let d = `M${x} ${y}`;
        for (let s = 1; s <= steps; s++) {
            const r = (s / steps) * len;
            const jitter = (rand() - 0.5) * 0.7;
            d += `L${(x + r * Math.cos(a + jitter)).toFixed(1)} ${(y + r * Math.sin(a + jitter)).toFixed(1)}`;
        }
        return d;
    });
};

/** Torn-paper top edge as a clip-path polygon for a full-width strip. */
export const tornEdge = (seed = 3, teeth = 70) => {
    const rand = seeded(seed);
    const points = ["0% 100%"];
    for (let i = 0; i <= teeth; i++) {
        points.push(`${pct((i / teeth) * 100)} ${pct(15 + rand() * 70)}`);
    }
    points.push("100% 100%");
    return `polygon(${points.join(", ")})`;
};

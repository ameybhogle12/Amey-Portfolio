import { useEffect, useState } from "react";
import Lanyard from "./Lanyard";

// Card art is painted at runtime with the site's own fonts, so the badge
// always matches the page and there are no image files to keep in sync.
const PAPER = "#f2eee5";
const INK = "#181614";
const RED = "#e8452c";
const W = 1024;
const H = 1440; // matches the portrait card's 1.6 : 2.25 face

const FONTS = ['400 100px "Anton"', '700 40px "Comic Neue"', '400 60px "Bangers"'];

const loadImage = (src) =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });

const canvas = (w, h) => {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    return [c, c.getContext("2d")];
};

const dots = (ctx, x, y, w, h, color, step = 12, r = 1.6) => {
    ctx.fillStyle = color;
    for (let j = y; j < y + h; j += step) {
        for (let i = x; i < x + w; i += step) {
            ctx.beginPath();
            ctx.arc(i, j, r, 0, Math.PI * 2);
            ctx.fill();
        }
    }
};

/** Draws text left-aligned, shrinking it until it fits `maxWidth`. */
const fitText = (ctx, text, x, y, font, size, maxWidth) => {
    let s = size;
    do {
        ctx.font = `${font.replace("SIZE", s)}`;
        s -= 4;
    } while (ctx.measureText(text).width > maxWidth && s > 20);
    ctx.fillText(text, x, y);
};

const paintFront = (avatar) => {
    const [c, ctx] = canvas(W, H);
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, W, H);
    dots(ctx, 0, 0, W, H, "rgba(24,22,20,0.06)");

    // Header band
    ctx.fillStyle = INK;
    ctx.fillRect(0, 0, W, 240);
    ctx.fillStyle = RED;
    ctx.font = '700 40px "Comic Neue"';
    ctx.fillText("CREW PASS · CHAPTER 05", 80, 112);
    ctx.fillStyle = PAPER;
    fitText(ctx, "THE NEXT ARC", 80, 205, '400 SIZEpx "Anton"', 96, 864);

    // Portrait panel: avatar over a red halftone field
    const px = 80, py = 290, pw = 864, ph = 640;
    ctx.save();
    ctx.beginPath();
    ctx.rect(px, py, pw, ph);
    ctx.clip();
    ctx.fillStyle = "#fbf8f1";
    ctx.fillRect(px, py, pw, ph);
    dots(ctx, px, py, pw, ph, "rgba(232,69,44,0.55)", 16, 3);
    const aw = pw * 1.25;
    const ah = (avatar.height / avatar.width) * aw;
    ctx.drawImage(avatar, px + (pw - aw) / 2, py - ah * 0.06, aw, ah);
    ctx.restore();
    ctx.lineWidth = 10;
    ctx.strokeStyle = INK;
    ctx.strokeRect(px, py, pw, ph);

    // Name and details
    ctx.fillStyle = INK;
    fitText(ctx, "AMEY BHOGLE", 80, 1080, '400 SIZEpx "Anton"', 150, 864);
    ctx.font = '700 46px "Comic Neue"';
    ctx.fillText("FULL-STACK DEVELOPER", 80, 1150);
    ctx.fillRect(80, 1182, 864, 5);
    ctx.font = '700 36px "Comic Neue"';
    ctx.fillStyle = "rgba(24,22,20,0.75)";
    ctx.fillText("REACT · NODE · FLUTTER · AI", 80, 1250);
    ctx.fillText("MUMBAI, INDIA", 80, 1305);

    // Stamp
    ctx.save();
    ctx.translate(760, 1290);
    ctx.rotate((-12 * Math.PI) / 180);
    ctx.strokeStyle = RED;
    ctx.lineWidth = 9;
    ctx.strokeRect(-170, -62, 340, 112);
    ctx.fillStyle = RED;
    ctx.font = '400 70px "Bangers"';
    ctx.textAlign = "center";
    ctx.fillText("OPEN TO WORK", 0, 22);
    ctx.restore();
    return c.toDataURL("image/png");
};

const paintBack = () => {
    const [c, ctx] = canvas(W, H);
    ctx.fillStyle = INK;
    ctx.fillRect(0, 0, W, H);
    dots(ctx, 0, 0, W, H, "rgba(242,238,229,0.07)");

    // Focus lines converging behind the text
    ctx.fillStyle = "rgba(242,238,229,0.07)";
    for (let i = 0; i < 90; i++) {
        const a = (i / 90) * Math.PI * 2;
        const w = 0.012;
        ctx.beginPath();
        ctx.moveTo(W / 2 + 1400 * Math.cos(a - w), H / 2 + 1400 * Math.sin(a - w));
        ctx.lineTo(W / 2 + 1400 * Math.cos(a + w), H / 2 + 1400 * Math.sin(a + w));
        ctx.lineTo(W / 2 + 330 * Math.cos(a), H / 2 + 330 * Math.sin(a));
        ctx.fill();
    }

    ctx.textAlign = "center";
    ctx.fillStyle = PAPER;
    ctx.font = '400 120px "Anton"';
    ctx.fillText("LET'S BUILD", W / 2, 620);
    ctx.fillStyle = RED;
    ctx.font = '400 150px "Anton"';
    ctx.fillText("THE NEXT ARC", W / 2, 790);
    ctx.fillStyle = PAPER;
    ctx.font = '700 64px "Comic Neue"';
    ctx.fillText("TOGETHER.", W / 2, 890);
    ctx.font = '700 38px "Comic Neue"';
    ctx.fillStyle = "rgba(242,238,229,0.7)";
    ctx.fillText("amey.bhogle12@gmail.com", W / 2, 1300);
    return c.toDataURL("image/png");
};

const paintStrap = () => {
    const [c, ctx] = canvas(1600, 192);
    ctx.fillStyle = RED;
    ctx.fillRect(0, 0, 1600, 192);
    ctx.fillStyle = PAPER;
    ctx.font = '400 92px "Anton"';
    ctx.textBaseline = "middle";
    ctx.fillText("AMEY BHOGLE  ✦  OPEN TO WORK  ✦", 30, 100);
    return c.toDataURL("image/png");
};

/**
 * The Contact chapter's 3D badge: a physics lanyard (three.js) wearing a
 * manga "crew pass". Lazy-loaded, so three.js only downloads when the
 * reader gets near the end of the page.
 */
export default function ArcBadge({ className }) {
    const [faces, setFaces] = useState(null);

    useEffect(() => {
        let alive = true;
        Promise.all([...FONTS.map((f) => document.fonts.load(f)), loadImage("/hero/avatar.webp")])
            .then((loaded) => {
                if (!alive) return;
                const avatar = loaded[loaded.length - 1];
                setFaces({ front: paintFront(avatar), back: paintBack(), strap: paintStrap() });
            })
            .catch(() => alive && setFaces({ front: undefined, back: undefined, strap: undefined }));
        return () => {
            alive = false;
        };
    }, []);

    if (!faces) return null;
    return (
        <Lanyard
            className={className}
            frontImage={faces.front}
            backImage={faces.back}
            strapImage={faces.strap}
            cardColor={PAPER}
            strapColor={RED}
            finish="glossy"
            metal="silver"
            size={0.62}
            strapLength={0.5}
        />
    );
}

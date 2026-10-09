import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { ArrowUp, Github, Instagram, Linkedin, Mail, MapPin, Phone, Send } from "lucide-react";
import { animate, spring, utils } from "animejs";
import { toast } from "sonner";
import { cn } from "../lib/utils";
import { useAnimeScope } from "../hooks/useAnimeScope";
import { useSplitHeading } from "../hooks/useSplitHeading";
import { Bubble } from "./manga/Bubble";
import { FocusLines, Sfx } from "./manga/Sfx";
import { revealPanel } from "./manga/reveal";

// three.js only downloads when the reader nears the end of the page
const ArcBadge = lazy(() => import("./lanyard/ArcBadge"));

const contacts = [
    { icon: Mail, label: "Email", value: "amey.bhogle12@gmail.com", href: "mailto:amey.bhogle12@gmail.com" },
    { icon: Phone, label: "Phone", value: "+91 99202 78857", href: "tel:+919920278857" },
    { icon: MapPin, label: "Base", value: "Mumbai, India" },
];

const socials = [
    { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/amey-bhogle-1bb96823a/" },
    { icon: Github, label: "GitHub", href: "https://github.com/ameybhogle12" },
    { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/amey.bhogle12/" },
];

const FIELD =
    "w-full px-4 py-3 rounded-none border-2 border-ink bg-card font-medium placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:shadow-[4px_4px_0_0_var(--primary)] transition-[border-color,box-shadow]";

const encode = (data) =>
    Object.keys(data)
        .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
        .join("&");

/**
 * Contact as Chapter 05: The Next Arc. A physics lanyard badge to grab,
 * a profile card with every way to reach me, and the message form — which
 * answers a successful send with a manga "MESSAGE RECEIVED!" slam. Ends
 * the book with "The End...?".
 */
export const ContactSection = () => {
    const headingRef = useSplitHeading();
    const badgeRef = useRef(null);
    const sentRef = useRef(null);
    const [showBadge, setShowBadge] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [formErrors, setFormErrors] = useState({});
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const rootRef = useAnimeScope((self) => {
        if (self.matches.reduced) return;
        self.root.querySelectorAll("[data-panel]").forEach(revealPanel);
    });

    // Mount the 3D badge only when its spot is close to the viewport
    useEffect(() => {
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShowBadge(true);
                    io.disconnect();
                }
            },
            { rootMargin: "600px 0px" },
        );
        if (badgeRef.current) io.observe(badgeRef.current);
        return () => io.disconnect();
    }, []);

    // The success slam, then it clears itself
    useEffect(() => {
        if (!sent || !sentRef.current) return;
        const el = sentRef.current;
        const anim = animate(el, {
            opacity: [0, 1],
            scale: [2, 1],
            rotate: [-12, -3],
            ease: spring({ stiffness: 260, damping: 13 }),
        });
        const hide = setTimeout(() => {
            animate(el, { opacity: 0, scale: 0.8, duration: 300, ease: "inQuad", onComplete: () => setSent(false) });
        }, 3200);
        return () => {
            clearTimeout(hide);
            anim.revert();
            utils.remove(el);
        };
    }, [sent]);

    const validate = () => {
        const errors = {};
        if (!formData.name.trim()) errors.name = "Name is required";
        if (!formData.email.trim()) {
            errors.email = "Email is required";
        } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i.test(formData.email.trim())) {
            errors.email = "Please enter a valid email address";
        }
        if (!formData.message.trim()) errors.message = "Message is required";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (field) => (event) => {
        setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validate() || sending) return;
        setSending(true);
        try {
            const res = await fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: encode({ "form-name": "contact", ...formData }),
            });
            if (!res.ok) throw new Error(`Form POST failed: ${res.status}`);
            setFormErrors({});
            setFormData({ name: "", email: "", message: "" });
            setSent(true);
        } catch (error) {
            console.error(error);
            toast.error("Oops! Something went wrong. Try email instead?");
        } finally {
            setSending(false);
        }
    };

    const field = (name, label, props, Tag = "input") => (
        <div>
            <label htmlFor={name} className="block mb-1.5 font-letter font-bold uppercase text-xs tracking-[0.15em]">
                {label}
            </label>
            <Tag
                id={name}
                name={name}
                value={formData[name]}
                onChange={handleChange(name)}
                aria-invalid={Boolean(formErrors[name])}
                className={cn(FIELD, formErrors[name] && "border-destructive", Tag === "textarea" && "resize-none")}
                {...props}
            />
            {formErrors[name] && <p className="mt-1 text-sm text-destructive">{formErrors[name]}</p>}
        </div>
    );

    return (
        <section id="contact" ref={rootRef} className="relative pt-20 md:pt-24 px-4">
            <header className="max-w-5xl mx-auto mb-8 md:mb-10 flex items-end justify-between gap-4 border-b-[3px] border-ink pb-3">
                <div className="text-left">
                    <p className="font-letter font-bold uppercase text-xs md:text-sm tracking-[0.2em] text-primary">
                        Contact · Chapter 05
                    </p>
                    <h2 ref={headingRef} className="text-5xl md:text-7xl">The Next Arc</h2>
                </div>
                <span aria-hidden="true" className="font-jp text-5xl md:text-6xl text-primary leading-none">伍</span>
            </header>

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-4 md:gap-6">
                {/* The badge: grab it, swing it, flip it */}
                <div className="relative">
                    <div className="relative z-10 flex flex-col items-start gap-3">
                        <Bubble tail="bottom-right" textClassName="text-sm md:text-base">
                            You made it to the last page.
                        </Bubble>
                        <Bubble tail="bottom-left" className="self-end" textClassName="text-sm md:text-base">
                            Let's write the next arc together.
                        </Bubble>
                    </div>
                    <div ref={badgeRef} className="relative h-[26rem] md:h-[36rem] -mt-2">
                        {showBadge && (
                            <Suspense fallback={null}>
                                <ArcBadge className="absolute inset-0" />
                            </Suspense>
                        )}
                        <p className="absolute bottom-2 inset-x-0 text-center font-letter font-bold uppercase text-xs tracking-[0.2em] text-muted-foreground pointer-events-none">
                            Grab the badge · flip it
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-4 md:gap-6 text-left">
                    {/* How to reach me, databook style */}
                    <div data-panel className="manga-panel">
                        <div className="bg-ink text-card px-4 py-2 flex items-center justify-between">
                            <span className="font-display uppercase tracking-wider text-lg">How to summon me</span>
                            <span className="font-letter font-bold uppercase text-xs text-primary">Open to work</span>
                        </div>
                        <dl className="p-4 md:p-5 grid gap-3">
                            {contacts.map((c) => (
                                <div key={c.label} className="flex items-center gap-3">
                                    <span className="grid place-items-center w-10 h-10 shrink-0 border-2 border-primary bg-primary/10">
                                        <c.icon className="h-5 w-5 text-primary" />
                                    </span>
                                    <div className="min-w-0">
                                        <dt className="font-letter font-bold uppercase text-[0.7rem] tracking-[0.15em] text-muted-foreground">{c.label}</dt>
                                        <dd className="font-medium truncate">
                                            {c.href ? (
                                                <a href={c.href} className="hover:text-primary underline-offset-4 hover:underline">{c.value}</a>
                                            ) : (
                                                c.value
                                            )}
                                        </dd>
                                    </div>
                                </div>
                            ))}
                        </dl>
                        <div className="flex border-t-[3px] border-ink">
                            {socials.map((s, i) => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn(
                                        "flex-1 flex items-center justify-center gap-2 py-3 font-letter font-bold uppercase text-xs tracking-wider hover:bg-primary hover:text-primary-foreground transition-colors",
                                        i > 0 && "border-l-[3px] border-ink",
                                    )}
                                >
                                    <s.icon className="h-4 w-4" /> {s.label}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* The message form */}
                    <div data-panel className="manga-panel p-5 md:p-6">
                        <Bubble variant="caption" dark>Send a message</Bubble>
                        <form className="mt-4 space-y-4" name="contact" method="POST" data-netlify="true" onSubmit={handleSubmit} noValidate>
                            <input type="hidden" name="form-name" value="contact" />
                            {field("name", "Your name", { type: "text", placeholder: "Your name", autoComplete: "name" })}
                            {field("email", "Your email", { type: "email", placeholder: "you@example.com", autoComplete: "email" })}
                            {field("message", "Your message", { rows: 4, placeholder: "Hey Amey, let's talk about..." }, "textarea")}
                            <button type="submit" disabled={sending} className="ink-button w-full py-4 text-lg">
                                {sending ? "Sending..." : "Send!"} <Send size={18} />
                            </button>
                        </form>

                        {sent && (
                            <div aria-live="polite" className="absolute inset-0 z-20 grid place-items-center bg-card/90 pointer-events-none">
                                <FocusLines seed={33} cx={50} cy={50} clear={24} className="opacity-25" />
                                <div ref={sentRef} className="relative flex flex-col items-center gap-2" style={{ opacity: 0 }}>
                                    <Bubble variant="shout" seed={57} textClassName="px-12 py-11 text-3xl md:text-4xl">
                                        Message<br />received!
                                    </Bubble>
                                    <Sfx tone="red" rotate={6} className="text-4xl">Don!</Sfx>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* The end of the book */}
            <footer className="max-w-5xl mx-auto mt-16 md:mt-20 border-t-[3px] border-ink py-10 md:py-12 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
                <div className="text-center md:text-left">
                    <p className="font-display uppercase text-5xl md:text-7xl leading-none">The End...?</p>
                    <p className="mt-2 font-letter font-bold uppercase text-sm tracking-[0.15em] text-muted-foreground">
                        To be continued in your inbox.
                    </p>
                </div>
                <div className="flex flex-col items-center md:items-end gap-3">
                    <a href="#hero" className="ink-button-ghost">
                        Back to page one <ArrowUp size={16} />
                    </a>
                    <p className="font-letter text-xs text-muted-foreground">© {new Date().getFullYear()} Amey Bhogle</p>
                </div>
            </footer>
        </section>
    );
};

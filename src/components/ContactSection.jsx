import { useEffect, useRef, useState } from "react";
import {
    Instagram,
    Linkedin,
    Mail,
    MapPin,
    Phone,
    Send,
} from "lucide-react";
import { cn } from "../lib/utils";
import { toast } from "sonner";
import { animate } from "animejs";

export const ContactSection = () => {
    const sectionRef = useRef(null);
    const infoRef = useRef(null);
    const formRef = useRef(null);
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [formErrors, setFormErrors] = useState({});

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

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!validate()) return;

        const encode = (data) => {
            return Object.keys(data)
                .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
                .join("&");
        };

        fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: encode({ "form-name": "contact", ...formData })
        })
            .then(() => {
                setFormErrors({});
                setFormData({ name: "", email: "", message: "" });
                toast.success("Message sent successfully! Thank you.");
            })
            .catch((error) => {
                console.error(error);
                toast.error("Oops! Something went wrong.");
            });
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    // Animate contact info
                    animate(infoRef.current, {
                        opacity: [0, 1],
                        translateX: [-30, 0],
                        duration: 800,
                        ease: "outQuart"
                    });

                    // Animate form
                    animate(formRef.current, {
                        opacity: [0, 1],
                        translateX: [30, 0],
                        duration: 800,
                        delay: 200,
                        ease: "outQuart"
                    });

                    // Stagger individual info items
                    animate(".contact-item", {
                        opacity: [0, 1],
                        translateY: [20, 0],
                        duration: 600,
                        delay: (el, i) => i * 150 + 400,
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
        <section id="contact" ref={sectionRef} className="py-24 px-4 relative bg-background/45 dark:bg-background/20">
            <div className="container mx-auto max-w-5xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
                    Get In <span className="text-primary"> Touch</span>
                </h2>

                <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                    Have a project in mind or want to collaborate? Feel free to reach out.
                    I'm always open to discussing new opportunities.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div
                        ref={infoRef}
                        className="space-y-8 opacity-0"
                    >
                        <h3 className="text-2xl font-semibold mb-6"> Contact Information</h3>

                        <div className="space-y-6">
                            <div className="contact-item flex items-start space-x-4 opacity-0">
                                <div className="p-3 rounded-full bg-primary/10">
                                    <Mail className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-left"> Email</h4>
                                    <a
                                        href="mailto:amey.bhogle12@gmail.com"
                                        className="text-muted-foreground hover:text-primary transition-colors text-left block"
                                    >
                                        amey.bhogle12@gmail.com
                                    </a>
                                </div>
                            </div>
                            <div className="contact-item flex items-start space-x-4 opacity-0">
                                <div className="p-3 rounded-full bg-primary/10">
                                    <Phone className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-left"> Phone</h4>
                                    <a
                                        href="tel:+919920278857"
                                        className="text-muted-foreground hover:text-primary transition-colors text-left block"
                                    >
                                        +91 9920278857
                                    </a>
                                </div>
                            </div>
                            <div className="contact-item flex items-start space-x-4 opacity-0">
                                <div className="p-3 rounded-full bg-primary/10">
                                    <MapPin className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-left"> Location</h4>
                                    <span className="text-muted-foreground text-left block">
                                        Jogeshwari, Mumbai
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="contact-item pt-8 opacity-0">
                            <h4 className="font-medium mb-4 text-left"> Connect With Me</h4>
                            <div className="flex space-x-6">
                                <a href="https://www.linkedin.com/in/amey-bhogle-1bb96823a/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-all hover:scale-110">
                                    <Linkedin size={24} />
                                </a>
                                <a href="https://www.instagram.com/amey.bhogle12/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-all hover:scale-110">
                                    <Instagram size={24} />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div
                        ref={formRef}
                        className="bg-card p-8 rounded-2xl shadow-lg border border-border/50 opacity-0"
                    >
                        <h3 className="text-2xl font-semibold mb-6 text-left"> Send a Message</h3>

                        <form className="space-y-6" name="contact" method="POST" data-netlify="true" onSubmit={handleSubmit}>
                            <input type="hidden" name="form-name" value="contact" />
                            <div className="text-left">
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium mb-2"
                                >
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange("name")}
                                    className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    placeholder="Amey Bhogle"
                                />
                                {formErrors.name && (
                                    <p className="text-sm text-destructive mt-1">{formErrors.name}</p>
                                )}
                            </div>

                            <div className="text-left">
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium mb-2"
                                >
                                    Your Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange("email")}
                                    className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    placeholder="example@gmail.com"
                                />
                                {formErrors.email && (
                                    <p className="text-sm text-destructive mt-1">{formErrors.email}</p>
                                )}
                            </div>

                            <div className="text-left">
                                <label
                                    htmlFor="message"
                                    className="block text-sm font-medium mb-2"
                                >
                                    Your Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={4}
                                    value={formData.message}
                                    onChange={handleChange("message")}
                                    className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                                    placeholder="Hello, I'd like to talk about..."
                                />
                                {formErrors.message && (
                                    <p className="text-sm text-destructive mt-1">{formErrors.message}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className={cn(
                                    "cosmic-button w-full flex items-center justify-center gap-2 py-4 text-lg"
                                )}
                            >
                                Send Message
                                <Send size={20} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};
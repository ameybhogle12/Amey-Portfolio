import {
    Instagram,
    Linkedin,
    Mail,
    MapPin,
    Phone,
    Send,
    Twitch,
    Twitter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";
import { motion } from "framer-motion";

export const ContactSection = () => {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [formErrors, setFormErrors] = useState({});

    const validate = () => {
        const errors = {};

        if (!formData.name.trim()) {
            errors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            errors.email = "Email is required";
        } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i.test(formData.email.trim())) {
            errors.email = "Please enter a valid email address";
        }

        if (!formData.message.trim()) {
            errors.message = "Message is required";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (field) => (event) => {
        setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        
        if (!validate()) {
            return;
        }

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

    return (
        <section id="contact" className="py-24 px-4 relative bg-background/45 dark:bg-background/20">
            <div className="container mx-auto max-w-5xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
                    Get In <span className="text-primary"> Touch</span>
                </h2>

                <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                    Have a project in mind or want to collaborate? Feel free to reach out.
                    I'm always open to discussing new opportunities.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="space-y-8"
                    >
                        <h3 className="text-2xl font-semibold mb-6">
                            {" "}
                            Contact Information
                        </h3>

                        <div className="space-y-6 justify-center">
                            <div className="flex items-start space-x-4">
                                <div className="p-3 rounded-full bg-primary/10">
                                    <Mail className="h-6 w-6 text-primary" />{" "}
                                </div>
                                <div>
                                    <h4 className="font-medium"> Email</h4>
                                    <a
                                        href="mailto:amey.bhogle12@gmail.com"
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        amey.bhogle12@gmail.com
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="p-3 rounded-full bg-primary/10">
                                    <Phone className="h-6 w-6 text-primary" />{" "}
                                </div>
                                <div>
                                    <h4 className="font-medium"> Phone</h4>
                                    <a
                                        href="tel:+919920278857"
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        +91 9920278857
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="p-3 rounded-full bg-primary/10">
                                    <MapPin className="h-6 w-6 text-primary" />{" "}
                                </div>
                                <div>
                                    <h4 className="font-medium"> Location</h4>
                                    <a className="text-muted-foreground hover:text-primary transition-colors">
                                        Jogeshwari, Mumbai
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8">
                            <h4 className="font-medium mb-4"> Connect With Me</h4>
                            <div className="flex space-x-4 justify-center">
                                <a href="https://www.linkedin.com/in/amey-bhogle-1bb96823a/" target="_blank" rel="noopener noreferrer">
                                    <Linkedin />
                                </a>
                                <a href="https://www.instagram.com/amey.bhogle12/" target="_blank" rel="noopener noreferrer">
                                    <Instagram />
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-card p-8 rounded-lg shadow-xs"
                    >
                        <h3 className="text-2xl font-semibold mb-6"> Send a Message</h3>

                        <form className="space-y-6" name="contact" method="POST" data-netlify="true" onSubmit={handleSubmit}>
                            <input type="hidden" name="form-name" value="contact" />
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium mb-2"
                                >
                                    {" "}
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange("name")}
                                    className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Pedro Machado..."
                                />
                                {formErrors.name && (
                                    <p className="text-sm text-destructive mt-1">{formErrors.name}</p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium mb-2"
                                >
                                    {" "}
                                    Your Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange("email")}
                                    className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="john@gmail.com"
                                />
                                {formErrors.email && (
                                    <p className="text-sm text-destructive mt-1">{formErrors.email}</p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="message"
                                    className="block text-sm font-medium mb-2"
                                >
                                    {" "}
                                    Your Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange("message")}
                                    className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                    placeholder="Hello, I'd like to talk about..."
                                />
                                {formErrors.message && (
                                    <p className="text-sm text-destructive mt-1">{formErrors.message}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className={cn(
                                    "cosmic-button w-full flex items-center justify-center gap-2"
                                )}
                            >
                                Send Message
                                <Send size={16} />
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
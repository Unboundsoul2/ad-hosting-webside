import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { ButtonCustom } from "@/components/ui/button-custom";
import { useToast } from "@/components/ui/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send the form data to a server
    console.log("Form submitted:", formData);
    
    toast({
      title: "Message sent successfully",
      description: "We'll get back to you as soon as possible.",
    });
    
    // Reset form
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary),0.05),transparent_70%)]"></div>
        <div className="absolute bottom-[25%] -left-[25%] rounded-full w-[50%] h-[50%] bg-primary/5 blur-[120px]"></div>
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <Reveal>
              <span className="inline-block px-3 py-1 mb-4 text-xs font-medium uppercase tracking-wider border border-border rounded-full bg-secondary">
                Get In Touch
              </span>
            </Reveal>
            
            <Reveal delay={200}>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-5">
                Let's Discuss Your Digital Needs
              </h2>
            </Reveal>
            
            <Reveal delay={300}>
              <p className="text-muted-foreground mb-8">
                Whether you're looking for hosting services, website development, or AI-powered assistance, we're here to help you achieve your digital goals.
              </p>
            </Reveal>

            <Reveal delay={400}>
              <div className="bg-card rounded-xl p-6 border border-border soft-shadow mb-6">
                <h3 className="text-lg font-semibold mb-3">A&D Studios</h3>
                <p className="text-muted-foreground mb-4">
                  Premium digital solutions for the modern web. Experience excellence in every aspect of your online presence.
                </p>
                <div className="flex flex-col space-y-2">
                  <span className="text-sm">contact@adhosting.com</span>
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
              </div>
            </Reveal>
          </div>

          <div>
            <Reveal delay={500}>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    placeholder="How can we help you?"
                  />
                </div>
                
                <ButtonCustom type="submit" className="w-full hover-scale">
                  Send Message
                </ButtonCustom>
              </form>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Contact;

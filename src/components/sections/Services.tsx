import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Server, Globe, Code, Bot } from "lucide-react";

const services = [
  {
    icon: <Server className="w-10 h-10" />,
    title: "High-Performance Hosting",
    description:
      "Experience lightning-fast load times with our optimized hosting infrastructure. Built for performance and reliability.",
  },
  {
    icon: <Globe className="w-10 h-10" />,
    title: "Domain Management",
    description:
      "Secure your perfect domain name and manage all aspects through our intuitive control panel.",
  },
  {
    icon: <Code className="w-10 h-10" />,
    title: "Website Development",
    description:
      "Custom website solutions designed and developed by experts, optimized for user experience and conversions.",
  },
  {
    icon: <Bot className="w-10 h-10" />,
    title: "AI-Powered Assistance",
    description:
      "Our Jet Boat Assistant provides intelligent support for your digital needs, available 24/7.",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary),0.03),transparent_70%)]"></div>
      </div>

      <Container className="relative z-10">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-medium uppercase tracking-wider border border-border rounded-full bg-secondary">
              Our Services
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-5">
              Comprehensive Digital Solutions
            </h2>
            <p className="text-muted-foreground">
              Everything you need to establish and grow your online presence, all in one place.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Reveal key={index} delay={index * 100 + 200} direction="up">
              <div className="relative p-6 rounded-xl border border-border bg-card hover:border-primary/20 transition-colors duration-300 group soft-shadow hover-scale">
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/40 to-primary/10 rounded-b-xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <div className="flex flex-col items-start">
                  <div className="p-3 rounded-lg bg-secondary text-primary mb-4 transition-transform duration-300 group-hover:translate-y-[-5px]">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Services;

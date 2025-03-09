import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { ButtonCustom } from "@/components/ui/button-custom";
import { CheckCircle2 } from "lucide-react";

const features = [
  "Founded in 2020 with a vision for modern web services",
  "Premium hosting infrastructure with 99.9% uptime",
  "Proprietary Plussaas framework for modular architecture",
  "AI-powered support available 24/7",
  "Team of experienced developers and designers",
  "Continuous innovation and feature development"
];

const About = () => {
  return (
    <section id="about" className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[25%] -right-[25%] rounded-full w-[50%] h-[50%] bg-primary/5 blur-[120px]"></div>
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div className="relative rounded-xl overflow-hidden shadow-xl soft-shadow hover-scale transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none"></div>
              <img 
                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
                alt="About AD Hosting" 
                className="w-full h-auto object-cover image-transition" 
              />
            </div>
          </Reveal>

          <div>
            <Reveal>
              <span className="inline-block px-3 py-1 mb-4 text-xs font-medium uppercase tracking-wider border border-border rounded-full bg-secondary">
                About Us
              </span>
            </Reveal>
            
            <Reveal delay={200}>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-5">
                Empowering Your Digital Presence Since 2020
              </h2>
            </Reveal>
            
            <Reveal delay={300}>
              <p className="text-muted-foreground mb-8">
                AD Hosting was founded with a clear vision: to provide high-performance digital solutions that empower businesses and individuals. We combine technical excellence with innovative design to create digital experiences that stand out.
              </p>
            </Reveal>

            <div className="space-y-3 mb-8">
              {features.map((feature, index) => (
                <Reveal key={index} delay={index * 100 + 400}>
                  <div className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                    <p>{feature}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={900}>
              <ButtonCustom className="hover-scale">
                Learn About Our Story
              </ButtonCustom>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default About;

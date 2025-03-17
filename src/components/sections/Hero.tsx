import { Container } from "@/components/ui/container";
import { ButtonCustom } from "@/components/ui/button-custom";
import { Reveal } from "@/components/ui/reveal";
import { ArrowRight, CheckCircle, Globe } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background/80 z-10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary),0.07),transparent_70%)]"></div>
        <div className="absolute -top-[25%] -right-[25%] rounded-full w-[50%] h-[50%] bg-primary/5 blur-[120px]"></div>
        <div className="absolute top-[75%] -left-[25%] rounded-full w-[50%] h-[50%] bg-primary/5 blur-[120px]"></div>
      </div>

      <Container className="relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:w-1/2">
            <Reveal delay={100}>
              <span className="inline-block px-3 py-1 mb-4 text-xs font-medium uppercase tracking-wider border border-border rounded-full bg-secondary text-accent">
                Premium Hosting Since 2020
              </span>
            </Reveal>

            <Reveal delay={300}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
                Premium Digital Solutions for the Modern Web
              </h1>
            </Reveal>

            <Reveal delay={500}>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl">
                High-performance hosting, stunning website development, and AI-powered assistance. 
                Everything you need to build and grow your online presence.
              </p>
            </Reveal>

            <Reveal delay={600}>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <ButtonCustom 
                  size="lg" 
                  icon={<ArrowRight size={18} />} 
                  className="hover-scale"
                >
                  Explore Our Services
                </ButtonCustom>
                <ButtonCustom 
                  variant="outline" 
                  size="lg" 
                  className="hover-scale"
                >
                  Learn More
                </ButtonCustom>
              </div>
            </Reveal>

            <Reveal delay={700}>
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  <span className="text-sm font-medium">99.9% Uptime</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  <span className="text-sm font-medium">24/7 Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-accent" />
                  <span className="text-sm font-medium">Global CDN</span>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="lg:w-1/2">
            <Reveal delay={900} direction="right" className="max-w-lg mx-auto">
              <div className="relative rounded-xl overflow-hidden shadow-xl soft-shadow hover-scale transition-all duration-500 group">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
                  alt="Digital Solutions"
                  className="w-full h-auto object-cover image-transition group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-6 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
                  <p className="text-sm font-medium text-foreground/90">Powerful infrastructure built for scalability and performance</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;

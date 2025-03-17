import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Star, Quote } from "lucide-react";

// Testimonial data
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "CEO, TechStart",
    content: "A&D Studios transformed our online presence. Their servers are lightning fast, and their support team is responsive and knowledgeable.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "CTO, GrowthLabs",
    content: "We migrated from another provider and the difference is night and day. Our site loads twice as fast and we haven't experienced any downtime.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80"
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    role: "Marketing Director, EcoStore",
    content: "The AI-powered assistance has been a game-changer for our team. It's like having an expert available 24/7 to answer our questions.",
    rating: 4,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80"
  },
];

const Testimonials = () => {
  return (
    <section className="relative py-20 overflow-hidden" id="testimonials">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background z-10"></div>
        <div className="absolute top-0 left-0 w-full h-56 bg-accent/5"></div>
      </div>

      <Container className="relative z-20">
        <Reveal delay={100}>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it — hear from some of our satisfied clients
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <Reveal key={testimonial.id} delay={200 + (index * 100)} direction="up">
              <div className="bg-card border border-border rounded-xl p-6 h-full feature-card hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={`${
                        i < testimonial.rating ? "text-accent fill-accent" : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                
                <div className="mb-6 relative">
                  <Quote className="text-accent/20 absolute -top-1 -left-2 h-8 w-8" />
                  <p className="text-foreground/90 relative z-10">{testimonial.content}</p>
                </div>
                
                <div className="flex items-center mt-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-accent/20">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Testimonials;

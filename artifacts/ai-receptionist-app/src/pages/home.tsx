import { Link } from "wouter";
import { ChatInterface } from "@/components/chat-interface";
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Sparkles, Heart } from "lucide-react";
import { useListServices, getListServicesQueryKey } from "@workspace/api-client-react";

export default function Home() {
  const { data: services } = useListServices({ query: { queryKey: getListServicesQueryKey() } });

  return (
    <div className="flex-1 w-full animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary/5 py-16 md:py-24">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none"></div>
        <div className="container mx-auto max-w-5xl px-4 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 max-w-lg">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card shadow-sm border text-xs font-medium text-primary mb-2">
                <Sparkles className="w-3 h-3" />
                <span>Now accepting new clients</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-serif text-foreground leading-tight tracking-tight">
                Find your <br/><span className="text-primary italic">balance</span> today.
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Welcome to Oasis Studio. Whether you need a deep tissue massage or a mindfulness consultation, our space is designed for your peace of mind.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Button asChild size="lg" className="rounded-full shadow-md text-base h-12 px-8">
                  <Link href="/book">Book an Appointment</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full bg-card hover:bg-muted text-base h-12 px-6">
                  <Link href="/appointments">View Schedule</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/50 rounded-[2rem] blur-xl opacity-50"></div>
              <div className="relative">
                <ChatInterface />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Snippet */}
      <section className="py-20 bg-background">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-serif mb-4">Our Services</h2>
            <p className="text-muted-foreground">Ask Ava about which service is right for you, or book directly if you already know what you need.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services?.slice(0, 3).map((service) => (
              <div key={service.id} className="group bg-card rounded-2xl border p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-medium mb-2">{service.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{service.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-sm font-medium bg-muted px-2.5 py-1 rounded-md">{service.durationMinutes} min</span>
                  <Link href={`/book?service=${service.id}`} className="text-primary text-sm font-medium flex items-center gap-1 hover:underline underline-offset-4">
                    Book <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild variant="ghost" className="rounded-full">
              <Link href="/book">View all services <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

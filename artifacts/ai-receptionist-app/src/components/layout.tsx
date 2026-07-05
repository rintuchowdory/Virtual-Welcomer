import { Link } from "wouter";
import { Coffee, Calendar, CalendarDays } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background selection:bg-primary/20 selection:text-primary">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto max-w-5xl px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="bg-primary/10 p-2 rounded-full text-primary">
              <Coffee className="w-5 h-5" />
            </div>
            <span className="font-serif font-medium text-xl tracking-tight">Oasis Studio</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/book" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              Book Appointment
            </Link>
            <Link href="/appointments" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <CalendarDays className="w-4 h-4" />
              <span className="hidden sm:inline">My Schedule</span>
            </Link>
            <Link href="/book" className="sm:hidden bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
              Book
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 flex flex-col relative w-full">
        {children}
      </main>
      <footer className="py-8 text-center text-sm text-muted-foreground border-t bg-card/50">
        <p>Oasis Studio &copy; {new Date().getFullYear()}. Here for your wellbeing.</p>
      </footer>
    </div>
  );
}

import { Link } from "wouter";
import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon, Clock, CheckCircle2, MapPin, XCircle, ArrowRight } from "lucide-react";
import { 
  useListAppointments, 
  getListAppointmentsQueryKey,
  useListServices,
  getListServicesQueryKey
} from "@workspace/api-client-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Appointments() {
  const { data: appointments = [], isLoading: loadingApps } = useListAppointments({ 
    query: { queryKey: getListAppointmentsQueryKey() } 
  });
  
  const { data: services = [], isLoading: loadingServices } = useListServices({ 
    query: { queryKey: getListServicesQueryKey() } 
  });

  const getServiceName = (id: string) => {
    return services.find(s => s.id === id)?.name || "Service";
  };

  const getServiceDuration = (id: string) => {
    return services.find(s => s.id === id)?.durationMinutes || 60;
  };

  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateB.getTime() - dateA.getTime();
  });

  if (loadingApps || loadingServices) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading your schedule...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-serif tracking-tight mb-2">My Schedule</h1>
          <p className="text-muted-foreground text-lg">Manage your upcoming visits to Oasis Studio.</p>
        </div>
        <Button asChild className="rounded-full shadow-sm">
          <Link href="/book">Book New</Link>
        </Button>
      </div>

      {sortedAppointments.length === 0 ? (
        <Card className="border-dashed bg-muted/30 border-2">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center text-muted-foreground shadow-sm mb-4">
              <CalendarIcon className="w-8 h-8 opacity-50" />
            </div>
            <h3 className="text-xl font-serif mb-2">No appointments yet</h3>
            <p className="text-muted-foreground max-w-md mb-8">
              You haven't booked any services with us yet. Ready to prioritize your wellbeing?
            </p>
            <Button asChild size="lg" className="rounded-full">
              <Link href="/book">Explore Services</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {sortedAppointments.map((app) => {
            const isConfirmed = app.status === "confirmed";
            const appDate = parseISO(app.date);
            const isPast = new Date(`${app.date}T${app.time}`) < new Date();
            
            return (
              <Card key={app.id} className={`overflow-hidden transition-all ${!isConfirmed || isPast ? 'opacity-70 bg-muted/20' : 'bg-card shadow-sm hover:shadow-md'}`}>
                <div className="flex flex-col md:flex-row">
                  <div className={`md:w-48 p-6 flex flex-col justify-center border-b md:border-b-0 md:border-r ${isConfirmed && !isPast ? 'bg-primary/5' : 'bg-muted/50'}`}>
                    <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      {format(appDate, "MMM")}
                    </span>
                    <span className="text-4xl font-serif text-foreground mb-1 leading-none">
                      {format(appDate, "dd")}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {format(appDate, "EEEE")}
                    </span>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-serif font-medium">{getServiceName(app.service)}</h3>
                        {isConfirmed ? (
                          <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20">Confirmed</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Cancelled</Badge>
                        )}
                      </div>
                      
                      <div className="space-y-1 mt-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 shrink-0" />
                          <span>{app.time} &bull; {getServiceDuration(app.service)} min</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 shrink-0" />
                          <span>Oasis Studio, Room 1</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                      {isConfirmed && !isPast && (
                        <Button variant="outline" size="sm" className="w-full sm:w-auto rounded-full" disabled>
                          Reschedule
                        </Button>
                      )}
                      {!isPast && isConfirmed && (
                        <span className="text-xs text-muted-foreground">Contact us to cancel</span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, User, Mail, FileText, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { 
  useListServices, 
  getListServicesQueryKey,
  useGetAppointmentAvailability,
  getGetAppointmentAvailabilityQueryKey,
  useCreateAppointment
} from "@workspace/api-client-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function Book() {
  const [_, setLocation] = useLocation();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const initialServiceId = searchParams.get("service") || "";

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(initialServiceId);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const { toast } = useToast();

  const { data: services = [] } = useListServices({ query: { queryKey: getListServicesQueryKey() } });
  
  const dateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
  const { data: availability, isFetching: isLoadingSlots } = useGetAppointmentAvailability(
    { date: dateStr },
    { 
      query: { 
        queryKey: getGetAppointmentAvailabilityQueryKey({ date: dateStr }),
        enabled: !!dateStr && step === 2
      } 
    }
  );

  const createMutation = useCreateAppointment();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      notes: "",
    },
  });

  const selectedService = services.find(s => s.id === selectedServiceId);

  const handleNext = () => {
    if (step === 1 && !selectedServiceId) {
      toast({ title: "Please select a service", variant: "destructive" });
      return;
    }
    if (step === 2 && (!selectedDate || !selectedTime)) {
      toast({ title: "Please select date and time", variant: "destructive" });
      return;
    }
    setStep((s) => (s + 1) as any);
  };

  const onSubmit = async (data: FormData) => {
    if (!selectedServiceId || !selectedDate || !selectedTime) return;

    try {
      await createMutation.mutateAsync({
        data: {
          service: selectedServiceId,
          date: format(selectedDate, "yyyy-MM-dd"),
          time: selectedTime,
          name: data.name,
          email: data.email,
          notes: data.notes || undefined,
        }
      });
      setIsSuccess(true);
    } catch (error) {
      toast({
        title: "Booking failed",
        description: "Please try again or contact us.",
        variant: "destructive"
      });
    }
  };

  if (isSuccess) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-16 text-center animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-serif mb-4">You're all set!</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Your appointment for {selectedService?.name} on {selectedDate && format(selectedDate, "MMMM d, yyyy")} at {selectedTime} has been confirmed.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg" className="rounded-full">
            <Link href="/appointments">View My Schedule</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-serif tracking-tight mb-3">Book an Appointment</h1>
        <p className="text-muted-foreground text-lg">Take the first step towards your wellbeing.</p>
      </div>

      <div className="flex justify-center mb-12">
        <div className="flex items-center w-full max-w-sm">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center justify-center w-full relative">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-medium z-10 transition-colors",
                step === s ? "bg-primary text-primary-foreground shadow-md" : 
                step > s ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
              )}>
                {s < step ? <CheckCircle2 className="w-5 h-5" /> : s}
              </div>
              {s < 3 && (
                <div className={cn(
                  "absolute top-1/2 left-1/2 w-full h-1 -translate-y-1/2 -z-0",
                  step > s ? "bg-primary/20" : "bg-muted"
                )} />
              )}
            </div>
          ))}
        </div>
      </div>

      <Card className="border-0 shadow-xl bg-card overflow-hidden">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-3 min-h-[500px]">
            {/* Left sidebar info */}
            <div className="bg-muted/50 p-6 md:p-8 border-r">
              <h3 className="font-serif text-xl mb-6">Booking Summary</h3>
              
              <div className="space-y-6">
                <div className={cn("transition-opacity", !selectedServiceId && "opacity-40")}>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Service</p>
                  <p className="font-medium text-foreground">{selectedService?.name || "None selected"}</p>
                  {selectedService && <p className="text-sm text-muted-foreground">{selectedService.durationMinutes} minutes</p>}
                </div>
                
                <div className={cn("transition-opacity", (!selectedDate || !selectedTime) && "opacity-40")}>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Date & Time</p>
                  <p className="font-medium text-foreground">
                    {selectedDate ? format(selectedDate, "MMM d, yyyy") : "None selected"}
                  </p>
                  <p className="text-sm text-muted-foreground">{selectedTime || "None selected"}</p>
                </div>
              </div>
            </div>

            {/* Main content area */}
            <div className="col-span-2 p-6 md:p-8 bg-card">
              
              {/* Step 1: Services */}
              <div className={cn("space-y-6 animate-in fade-in slide-in-from-right-4 duration-300", step !== 1 && "hidden")}>
                <h2 className="text-2xl font-serif mb-6">Select a Service</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setSelectedServiceId(service.id)}
                      className={cn(
                        "text-left p-4 rounded-xl border-2 transition-all",
                        selectedServiceId === service.id 
                          ? "border-primary bg-primary/5 shadow-sm" 
                          : "border-transparent bg-muted hover:bg-muted/80"
                      )}
                    >
                      <h4 className="font-medium mb-1">{service.name}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{service.durationMinutes} min</p>
                      <p className="text-xs line-clamp-2">{service.description}</p>
                    </button>
                  ))}
                </div>
                <div className="flex justify-end pt-6">
                  <Button onClick={handleNext} disabled={!selectedServiceId} className="rounded-full px-8">
                    Continue
                  </Button>
                </div>
              </div>

              {/* Step 2: Date & Time */}
              <div className={cn("space-y-6 animate-in fade-in slide-in-from-right-4 duration-300", step !== 2 && "hidden")}>
                <h2 className="text-2xl font-serif mb-6">Choose a Time</h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        setSelectedTime(null);
                      }}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0,0,0,0);
                        return date < today || date.getDay() === 0 || date.getDay() === 6; // disable weekends and past
                      }}
                      className="rounded-xl border bg-card/50 shadow-sm p-3 pointer-events-auto"
                    />
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-4 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      Available Slots
                    </h4>
                    
                    {isLoadingSlots ? (
                      <div className="text-muted-foreground text-sm flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border-2 border-primary/50 border-t-primary animate-spin" />
                        Finding times...
                      </div>
                    ) : !selectedDate ? (
                      <p className="text-sm text-muted-foreground">Select a date to see times.</p>
                    ) : availability?.slots && availability.slots.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {availability.slots.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => setSelectedTime(slot)}
                            className={cn(
                              "py-2 px-3 text-sm rounded-lg border transition-colors font-medium",
                              selectedTime === slot
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-card hover:border-primary hover:text-primary"
                            )}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground p-4 bg-muted rounded-lg text-center">
                        No availability on this date.
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  <Button variant="ghost" onClick={() => setStep(1)} className="rounded-full">
                    Back
                  </Button>
                  <Button onClick={handleNext} disabled={!selectedDate || !selectedTime} className="rounded-full px-8">
                    Continue
                  </Button>
                </div>
              </div>

              {/* Step 3: Details */}
              <div className={cn("space-y-6 animate-in fade-in slide-in-from-right-4 duration-300", step !== 3 && "hidden")}>
                <h2 className="text-2xl font-serif mb-6">Your Details</h2>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input placeholder="Jane Doe" className="pl-9 bg-muted/50 border-transparent focus-visible:bg-background" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input placeholder="jane@example.com" type="email" className="pl-9 bg-muted/50 border-transparent focus-visible:bg-background" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Any notes for us? (Optional)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Textarea 
                                placeholder="I have a slight shoulder injury..." 
                                className="pl-9 min-h-[100px] bg-muted/50 border-transparent focus-visible:bg-background resize-none" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-between pt-6 border-t mt-8">
                      <Button type="button" variant="ghost" onClick={() => setStep(2)} className="rounded-full">
                        Back
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={createMutation.isPending} 
                        className="rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all active:scale-95"
                      >
                        {createMutation.isPending ? "Confirming..." : "Confirm Booking"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>

            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import React, { useMemo } from 'react';
import { Calendar } from '@/components/atoms/ui/calendar';
import { Card, CardContent } from '@/components/atoms/ui/card';
import { Button } from '@/components/atoms/ui/button';
import { Label } from '@/components/atoms/ui/label';
import { Select } from '@/components/atoms/ui/select';
import { cn } from "@/lib/utils";
import { es } from 'date-fns/locale';
import { STATUS_CONFIG, type StatusKey, type StatusConfigValue } from './types';
import { StatusLegend } from '@/components/molecules/StatusLegend';
import { StatusDetails } from '@/components/molecules/StatusDetails';
import { useBookingStore } from '../../store/useBookingStore';
import toursData from "@/data/tours.json";

/**
 * MAIN COMPONENT
 */
export function BookingCalendar() {
  const selectedDate = useBookingStore((state: any) => state.selectedDate);
  const setSelectedDate = useBookingStore((state: any) => state.setSelectedDate);
  const availability = useBookingStore((state: any) => state.availability);
  const nextStep = useBookingStore((state: any) => state.nextStep);
  const formData = useBookingStore((state: any) => state.formData);
  const updateFormData = useBookingStore((state: any) => state.updateFormData);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const modifiers = useMemo(() => ({
    isBooked: (d: Date) => d > today && availability.booked.some((date: Date) => date.toDateString() === d.toDateString()),
    isLimited: (d: Date) => d > today && availability.limited.some((date: Date) => date.toDateString() === d.toDateString()),
    isAvailable: (d: Date) => d > today && availability.available.some((date: Date) => date.toDateString() === d.toDateString()),
  }), [availability, today]);

  const modifiersClassNames = useMemo(() => {
    return {
      isBooked: STATUS_CONFIG.booked.classes.modifier,
      isLimited: STATUS_CONFIG.limited.classes.modifier,
      isAvailable: STATUS_CONFIG.available.classes.modifier,
    };
  }, []);

  const getStatus = (d: Date | undefined): StatusKey => {
    if (!d || d <= today) return 'standard';
    const dateStr = d.toDateString();
    if (availability.booked.some((date: Date) => date.toDateString() === dateStr)) return 'booked';
    if (availability.limited.some((date: Date = d) => date.toDateString() === dateStr)) return 'limited';
    if (availability.available.some((date: Date) => date.toDateString() === dateStr)) return 'available';
    return 'standard';
  };

  const statusKey = getStatus(selectedDate);
  
  const handleTourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFormData({ tourId: e.target.value });
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-muted/30 space-y-4 rounded-3xl border border-border h-full w-full">
      <Card className="w-full max-w-md shadow-xl border-none bg-background flex-1">
        <CardContent className="flex flex-col items-center gap-4 h-full justify-center">
          
          <div className="w-full grid gap-1.5 mt-2">
            <Label htmlFor="tourId" className="text-xs">Tour</Label>
            <Select
              id="tourId"
              name="tourId"
              value={formData.tourId || ""}
              onChange={handleTourChange}
              className="h-10 text-sm w-full"
              required
            >
              <option value="" disabled>Selecciona un tour</option>
              {toursData.map((tour: any) => (
                <option key={tour.id} value={tour.id}>
                  {tour.title}
                </option>
              ))}
            </Select>
          </div>

          <StatusLegend />

          <div className="p-2 bg-background rounded-xl border border-border shadow-sm w-full">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={es}
              className="rounded-md border-none w-full"
              classNames={{
                day: cn(
                  "relative w-full h-full p-0 text-center [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none",
                  "hover:bg-foreground hover:text-background rounded-md transition-colors"
                ),
                disabled: "hover:bg-transparent hover:text-muted-foreground",
                ...modifiersClassNames,
              }}
              modifiers={modifiers}
              disabled={[(d: Date) => d <= today, ...availability.booked]}
            />
          </div>

          <div className="w-full space-y-4">
            {selectedDate && <StatusDetails date={selectedDate} statusKey={statusKey} />}
            
            <Button 
              className="w-full py-6 text-lg font-serif rounded-xl"
              disabled={!selectedDate || !formData.tourId}
              onClick={nextStep}
            >
              Continuar con la reserva
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="max-w-md text-center text-foreground/40 text-[10px] font-sans italic">
        <p>La disponibilidad se actualiza diariamente.</p>
      </div>
    </div>
  );
}

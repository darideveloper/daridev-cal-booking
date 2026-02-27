import React, { useMemo } from 'react';
import { Calendar } from '@/components/atoms/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/atoms/ui/card';
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

  const modifiers = useMemo(() => ({
    isBooked: (d: Date) => availability.booked.some(date => date.toDateString() === d.toDateString()),
    isLimited: (d: Date) => availability.limited.some(date => date.toDateString() === d.toDateString()),
    isAvailable: (d: Date) => availability.available.some(date => date.toDateString() === d.toDateString()),
  }), [availability]);

  const modifiersClassNames = useMemo(() => {
    return {
      isBooked: STATUS_CONFIG.booked.classes.modifier,
      isLimited: STATUS_CONFIG.limited.classes.modifier,
      isAvailable: STATUS_CONFIG.available.classes.modifier,
    };
  }, []);

  const getStatus = (d: Date | undefined): StatusKey => {
    if (!d) return 'standard';
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
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-red px-2 py-0.5 bg-brand-red/10 rounded-full">
              Paso 1 de 2
            </span>
          </div>
          <CardTitle className="text-xl font-serif text-brand-charcoal">Selecciona tu Tour y Fecha</CardTitle>
          <CardDescription className="text-xs text-brand-charcoal/60">
            Elige el tour que deseas realizar y busca un día disponible.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 pt-0 h-full justify-center">
          
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
              disabled={availability.booked}
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

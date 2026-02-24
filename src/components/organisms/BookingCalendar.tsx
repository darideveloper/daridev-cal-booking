import React, { useState, useMemo } from 'react';
import { Calendar } from '@/components/atoms/ui/calendar';
import { Card, CardContent } from '@/components/atoms/ui/card';
import { cn } from "@/lib/utils";
import { es } from 'date-fns/locale';
import { STATUS_CONFIG, type StatusKey, type StatusConfigValue } from './types';
import { StatusLegend } from '@/components/molecules/StatusLegend';
import { StatusDetails } from '@/components/molecules/StatusDetails';

/**
 * MOCK DATA
 */
const today = new Date();
const getRelativeDate = (days: number) => {
  const d = new Date();
  d.setDate(today.getDate() + days);
  return d;
};

const bookingData = {
  booked: [today, getRelativeDate(1), getRelativeDate(5), getRelativeDate(12)],
  limited: [getRelativeDate(2), getRelativeDate(8), getRelativeDate(9)],
  available: [getRelativeDate(3), getRelativeDate(4), getRelativeDate(10)],
};

/**
 * MAIN COMPONENT
 */
export function BookingCalendar() {
  const [date, setDate] = useState<Date | undefined>(undefined);

  const modifiers = useMemo(() => ({
    booked: bookingData.booked,
    limited: bookingData.limited,
    available: bookingData.available,
  }), []);

  const modifiersClassNames = useMemo(() => {
    const classNames: Record<string, string> = {};
    (Object.entries(STATUS_CONFIG) as [StatusKey, StatusConfigValue][]).forEach(([key, value]) => {
      if (value.classes.modifier) {
        classNames[key] = value.classes.modifier;
      }
    });
    return classNames;
  }, []);

  const getStatus = (d: Date | undefined): StatusKey => {
    if (!d) return 'standard';
    const dateStr = d.toDateString();
    if (bookingData.booked.some(date => date.toDateString() === dateStr)) return 'booked';
    if (bookingData.limited.some(date => date.toDateString() === dateStr)) return 'limited';
    if (bookingData.available.some(date => date.toDateString() === dateStr)) return 'available';
    return 'standard';
  };

  const statusKey = getStatus(date);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-muted/30 space-y-6 rounded-3xl border border-border">
      <Card className="w-full max-w-md shadow-xl border-none bg-background">
        <CardContent className="flex flex-col items-center gap-6 pt-6">
          <StatusLegend />

          <div className="p-3 bg-background rounded-xl border border-border shadow-sm">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              locale={es}
              className="rounded-md border-none"
              classNames={{
                day: cn(
                  "relative w-full h-full p-0 text-center [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none",
                  "hover:bg-foreground hover:text-background rounded-md transition-colors"
                ),
                disabled: "hover:bg-transparent hover:text-muted-foreground",
              }}
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
              disabled={bookingData.booked}
            />
          </div>

          {date && <StatusDetails date={date} statusKey={statusKey} />}
        </CardContent>
      </Card>

      <div className="max-w-md text-center text-foreground/40 text-xs font-sans italic">
        <p>La disponibilidad se actualiza diariamente. Seleccione una fecha para ver los detalles y proceder con su consulta de reserva.</p>
      </div>
    </div>
  );
}

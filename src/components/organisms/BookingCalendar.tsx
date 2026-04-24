import React, { useMemo } from 'react';
import { Calendar } from '@/components/atoms/ui/calendar';
import { Card, CardContent } from '@/components/atoms/ui/card';
import { Button } from '@/components/atoms/ui/button';
import { Label } from '@/components/atoms/ui/label';
import { Select } from '@/components/atoms/ui/select';
import { cn } from "@/lib/utils";
import { es, enUS } from 'date-fns/locale';
import { STATUS_CONFIG, type StatusKey } from './types';
import { StatusLegend } from '@/components/molecules/StatusLegend';
import { StatusDetails } from '@/components/molecules/StatusDetails';
import { BookingHeader } from '@/components/molecules/BookingHeader';
import { useBookingStore } from '../../store/useBookingStore';
import { useTranslation } from '@/lib/i18n/useTranslation';


/**
 * MAIN COMPONENT
 */
export function BookingCalendar() {
  const { t, language } = useTranslation();
  const selectedDate = useBookingStore((state: any) => state.selectedDate);
  const setSelectedDate = useBookingStore((state: any) => state.setSelectedDate);
  const availability = useBookingStore((state: any) => state.availability);
  const nextStep = useBookingStore((state: any) => state.nextStep);
  const formData = useBookingStore((state: any) => state.formData);
  const updateFormData = useBookingStore((state: any) => state.updateFormData);
  const visibility = useBookingStore((state: any) => state.visibility);
  const config = useBookingStore((state: any) => state.config);
  const prevStep = useBookingStore((state: any) => state.prevStep);

  const dateLocale = language === 'es' ? es : enUS;

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const modifiers = useMemo(() => ({
    isBooked: (d: Date) => {
      const dateObj = d instanceof Date ? d : new Date(d);
      return dateObj > today && availability.booked.some((bookedDate: Date) => {
        const b = bookedDate instanceof Date ? bookedDate : new Date(bookedDate);
        return b.toDateString() === dateObj.toDateString();
      });
    },
    isLimited: (d: Date) => {
      const dateObj = d instanceof Date ? d : new Date(d);
      return dateObj > today && availability.limited.some((limitedDate: Date) => {
        const l = limitedDate instanceof Date ? limitedDate : new Date(limitedDate);
        return l.toDateString() === dateObj.toDateString();
      });
    },
    isAvailable: (d: Date) => {
      const dateObj = d instanceof Date ? d : new Date(d);
      if (dateObj <= today) return false;
      
      const isBooked = availability.booked.some((bookedDate: Date) => {
        const b = bookedDate instanceof Date ? bookedDate : new Date(bookedDate);
        return b.toDateString() === dateObj.toDateString();
      });
      const isLimited = availability.limited.some((limitedDate: Date) => {
        const l = limitedDate instanceof Date ? limitedDate : new Date(limitedDate);
        return l.toDateString() === dateObj.toDateString();
      });
      
      return !isBooked && !isLimited;
    },
  }), [availability, today]);

  const modifiersClassNames = useMemo(() => {
    return {
      isBooked: STATUS_CONFIG.booked.classes.modifier,
      isLimited: STATUS_CONFIG.limited.classes.modifier,
      isAvailable: STATUS_CONFIG.available.classes.modifier,
    };
  }, []);

  const getStatus = (d: Date | undefined): StatusKey => {
    if (!d) return 'standard';
    const dateObj = d instanceof Date ? d : new Date(d);
    if (dateObj <= today) return 'standard';
    
    const dateStr = dateObj.toDateString();
    
    const isBooked = availability.booked.some((bookedDate: Date) => {
      const b = bookedDate instanceof Date ? bookedDate : new Date(bookedDate);
      return b.toDateString() === dateStr;
    });
    if (isBooked) return 'booked';
    
    const isLimited = availability.limited.some((limitedDate: Date) => {
      const l = limitedDate instanceof Date ? limitedDate : new Date(limitedDate);
      return l.toDateString() === dateStr;
    });
    if (isLimited) return 'limited';
    
    return 'available';
  };

  const statusKey = getStatus(selectedDate);

  return (
    <>
      <Card className="w-full max-w-md shadow-xl border-none bg-background relative overflow-hidden">
        <BookingHeader 
          showBack={true}
          onBack={prevStep}
          showStep={true} 
          stepText={t.form?.step2Of3 || "Step 2 of 3"} 
        />
        <CardContent className="flex flex-col items-center gap-4 h-full justify-center">

          <StatusLegend />

          <div className="p-2 bg-background rounded-xl border border-border shadow-sm w-full">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={dateLocale}
              showOutsideDays={false}
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
              disabled={!selectedDate || !formData.serviceId}
              onClick={nextStep}
            >
              {t.calendar.continue}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="max-w-md text-center text-muted-foreground text-[10px] font-sans italic mt-2">
        <p>{t.calendar.availabilityUpdate}</p>
      </div>
    </>
  );
}


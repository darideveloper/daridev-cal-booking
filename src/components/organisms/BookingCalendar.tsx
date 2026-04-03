import React, { useMemo } from 'react';
import { Calendar } from '@/components/atoms/ui/calendar';
import { Card, CardContent } from '@/components/atoms/ui/card';
import { Button } from '@/components/atoms/ui/button';
import { Label } from '@/components/atoms/ui/label';
import { Select } from '@/components/atoms/ui/select';
import { cn } from "@/lib/utils";
import { es, enUS } from 'date-fns/locale';
import { STATUS_CONFIG, type StatusKey, type StatusConfigValue } from './types';
import { StatusLegend } from '@/components/molecules/StatusLegend';
import { StatusDetails } from '@/components/molecules/StatusDetails';
import { useBookingStore } from '../../store/useBookingStore';
import { ThemeToggle } from '../atoms/ui/ThemeToggle';
import { LanguageToggle } from '../atoms/ui/LanguageToggle';
import { useTranslation } from '@/lib/i18n/useTranslation';
import toursData from "@/data/tours.json";

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
  
  const handleTourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFormData({ tourId: e.target.value });
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-muted/30 space-y-4 rounded-3xl border border-border h-full w-full">
      <Card className="w-full max-w-md shadow-xl border-none bg-background flex-1 relative">
        <div className="absolute top-2 right-2 z-20 scale-75 lg:scale-100 flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
        <CardContent className="flex flex-col items-center gap-4 h-full justify-center">
          
          <div className="w-full grid gap-1.5 mt-2">
            <Label htmlFor="tourId" className="text-xs">{t.calendar.tourLabel}</Label>
            <Select
              id="tourId"
              name="tourId"
              value={formData.tourId || ""}
              onChange={handleTourChange}
              className="h-10 text-sm w-full"
              required
            >
              <option value="" disabled>{t.calendar.selectTour}</option>
              {toursData.map((tour: any) => (
                <option key={tour.id} value={tour.id}>
                  {typeof tour.title === 'string' ? tour.title : (tour.title[language] || tour.title.es)}
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
              locale={dateLocale}
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
              {t.calendar.continue}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="max-w-md text-center text-white text-[10px] font-sans italic">
        <p>{t.calendar.availabilityUpdate}</p>
      </div>
    </div>
  );
}

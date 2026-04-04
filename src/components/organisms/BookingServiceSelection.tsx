import React from 'react';
import { Card, CardContent } from '@/components/atoms/ui/card';
import { Button } from '@/components/atoms/ui/button';
import { Label } from '@/components/atoms/ui/label';
import { Select } from '@/components/atoms/ui/select';
import { BookingHeader } from '@/components/molecules/BookingHeader';
import { useBookingStore } from '../../store/useBookingStore';
import { useTranslation } from '@/lib/i18n/useTranslation';
import bookingData from "@/data/booking.json";

export function BookingServiceSelection() {
  const { t, language } = useTranslation();
  const nextStep = useBookingStore((state: any) => state.nextStep);
  const formData = useBookingStore((state: any) => state.formData);
  const updateFormData = useBookingStore((state: any) => state.updateFormData);
  const config = useBookingStore((state: any) => state.config);

  const handleServiceTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFormData({ serviceTypeId: e.target.value });
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFormData({ serviceId: e.target.value });
  };

  const selectedCategory = bookingData.find(cat => cat.id === formData.serviceTypeId);
  const services = selectedCategory ? selectedCategory.services : [];

  return (
    <Card className="w-full max-w-md shadow-xl border-none bg-background relative overflow-hidden">
      <BookingHeader 
        showStep={true} 
        stepText={t.form?.step1Of3 || "Step 1 of 3"} 
      />
      <CardContent className="flex flex-col items-center gap-6 h-full justify-center pt-4">
        
        <div className="w-full grid gap-4 mt-2">
          {/* Category Dropdown */}
          <div className="grid gap-1.5">
            <Label htmlFor="serviceTypeId" className="text-xs">
              {config?.event_type_label || "Tipo de Servicio"}
            </Label>
            <Select
              id="serviceTypeId"
              name="serviceTypeId"
              value={formData.serviceTypeId || ""}
              onChange={handleServiceTypeChange}
              className="h-12 text-sm w-full rounded-xl"
              required
            >
              <option value="" disabled>{t.calendar?.selectTour || "Seleccione una opción"}</option>
              {bookingData.map((category: any) => (
                <option key={category.id} value={category.id}>
                  {typeof category.name === 'string' ? category.name : (category.name[language] || category.name.es)}
                </option>
              ))}
            </Select>
          </div>

          {/* Service Dropdown */}
          <div className="grid gap-1.5">
            <Label htmlFor="serviceId" className="text-xs">
              {config?.event_label || t.calendar?.tourLabel || "Servicio"}
            </Label>
            <Select
              id="serviceId"
              name="serviceId"
              value={formData.serviceId || ""}
              onChange={handleServiceChange}
              className="h-12 text-sm w-full rounded-xl"
              required
              disabled={!formData.serviceTypeId}
            >
              <option value="" disabled>{t.calendar?.selectTour || "Seleccione una opción"}</option>
              {services.map((service: any) => (
                <option key={service.id} value={service.id}>
                  {typeof service.title === 'string' ? service.title : (service.title[language] || service.title.es)}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="w-full pt-4">
          <Button 
            className="w-full py-6 text-lg font-serif rounded-xl"
            disabled={!formData.serviceTypeId || !formData.serviceId}
            onClick={nextStep}
          >
            {t.calendar?.continue || "Continuar"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

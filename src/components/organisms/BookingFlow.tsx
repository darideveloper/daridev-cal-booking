import React, { useEffect } from "react"
import { useBookingStore, type Language, type Theme } from "../../store/useBookingStore"
import { BookingCalendar } from "./BookingCalendar"
import { BookingForm } from "./BookingForm"

export default function BookingFlow({ initialServiceId }: { initialServiceId?: string }) {
  const currentStep = useBookingStore((state: any) => state.currentStep)
  const updateFormData = useBookingStore((state: any) => state.updateFormData)
  const setLanguage = useBookingStore((state: any) => state.setLanguage)
  const setTheme = useBookingStore((state: any) => state.setTheme)
  const setVisibility = useBookingStore((state: any) => state.setVisibility)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    
    // 1. Handle Language
    const langQuery = urlParams.get('lang') as Language | null;
    if (langQuery && (langQuery === 'es' || langQuery === 'en')) {
      setLanguage(langQuery);
      setVisibility({ lang: false });
    }

    // 2. Handle Theme
    const themeQuery = urlParams.get('theme') as Theme | null;
    if (themeQuery && (themeQuery === 'light' || themeQuery === 'dark')) {
      setTheme(themeQuery);
      setVisibility({ theme: false });
    }

    // 3. Handle Service (formerly tour)
    const serviceQuery = urlParams.get('service') || urlParams.get('tour');
    if (serviceQuery) {
      updateFormData({ serviceId: serviceQuery });
      setVisibility({ service: false });
    } else if (initialServiceId) {
      updateFormData({ serviceId: initialServiceId });
    }

    // 4. Handle Service Group
    const serviceGroupQuery = urlParams.get('service_group');
    if (serviceGroupQuery) {
      updateFormData({ serviceGroup: serviceGroupQuery });
    }
  }, [initialServiceId, updateFormData, setLanguage, setTheme, setVisibility])

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center relative z-10 p-4 bg-muted/30 space-y-4 rounded-3xl border border-border h-full">
      {currentStep === 1 && <BookingCalendar />}
      {currentStep === 2 && <BookingForm />}
    </div>
  )
}

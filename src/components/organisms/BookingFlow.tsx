import React, { useEffect } from "react"
import { useBookingStore } from "../../store/useBookingStore"
import { BookingCalendar } from "./BookingCalendar"
import { BookingForm } from "./BookingForm"

export default function BookingFlow({ initialTourId }: { initialTourId?: string }) {
  const currentStep = useBookingStore((state: any) => state.currentStep)
  const updateFormData = useBookingStore((state: any) => state.updateFormData)

  useEffect(() => {
    // If we have an initial ID from the path ([id].astro)
    if (initialTourId) {
      updateFormData({ tourId: initialTourId })
    } 
    // Otherwise check for the query parameter (?tour=...)
    else {
      const urlParams = new URLSearchParams(window.location.search);
      const tourQuery = urlParams.get('tour');
      if (tourQuery) {
        updateFormData({ tourId: tourQuery });
      }
    }
  }, [initialTourId, updateFormData])

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      {currentStep === 1 && <BookingCalendar />}
      {currentStep === 2 && <BookingForm />}
    </div>
  )
}

import React from "react"
import { useBookingStore } from "../../store/useBookingStore"
import { BookingCalendar } from "./BookingCalendar"
import { BookingForm } from "./BookingForm"

export default function BookingFlow({ initialTourId }: { initialTourId?: string }) {
  const currentStep = useBookingStore((state: any) => state.currentStep)

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      {currentStep === 1 && <BookingCalendar />}
      {currentStep === 2 && <BookingForm initialTourId={initialTourId} />}
    </div>
  )
}

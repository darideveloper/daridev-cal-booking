import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toursData from "../data/tours.json";

export type Language = 'es' | 'en';

interface Availability {
  limited: Date[];
  booked: Date[];
}

interface BookingState {
  language: Language;
  selectedDate: Date | undefined;
  currentStep: number;
  formData: {
    fullName: string;
    email: string;
    tourId: string | null;
    guests: number;
    specialRequests: string;
    privacyAccepted: boolean;
  };
  availability: Availability;
  setLanguage: (language: Language) => void;
  setSelectedDate: (date: Date | undefined) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<BookingState['formData']>) => void;
  resetBooking: () => void;
}

const injectVirtualLimitedDates = (limited: Date[], booked: Date[]): Date[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const virtualLimited: Date[] = [...limited];
  const bookedStrings = new Set(booked.map(d => d.toDateString()));
  const limitedStrings = new Set(limited.map(d => d.toDateString()));

  for (let i = 1; i <= 12; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toDateString();
    
    if (!bookedStrings.has(dateStr) && !limitedStrings.has(dateStr)) {
      virtualLimited.push(d);
    }
  }
  
  return virtualLimited;
};

const getInitialAvailability = (tourId: string | null): Availability => {
  const tour = toursData.find(t => t.id === tourId);
  if (!tour || !tour.dates) {
    return { limited: [], booked: [] };
  }
  
  const parseDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const limited = (tour.dates.limited || []).map(parseDate);
  const booked = (tour.dates.booked || []).map(parseDate);

  return {
    limited: injectVirtualLimitedDates(limited, booked),
    booked: booked,
  };
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      language: 'es',
      selectedDate: undefined,
      currentStep: 1,
      formData: {
        fullName: '',
        email: '',
        tourId: null,
        guests: 1,
        specialRequests: '',
        privacyAccepted: false,
      },
      availability: { limited: [], booked: [] },
      setLanguage: (language) => set({ language }),
      setSelectedDate: (date) => set({ selectedDate: date }),
      setStep: (step) => set({ currentStep: step }),
      nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
      prevStep: () => set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),
      updateFormData: (data) => set((state) => {
        const newFormData = { ...state.formData, ...data };
        let newAvailability = state.availability;
        if (data.tourId !== undefined) {
          newAvailability = getInitialAvailability(newFormData.tourId);
        }
        return { 
          formData: newFormData,
          availability: newAvailability,
        };
      }),
      resetBooking: () => set({
        selectedDate: undefined,
        currentStep: 1,
        formData: {
          fullName: '',
          email: '',
          tourId: null,
          guests: 1,
          specialRequests: '',
          privacyAccepted: false,
        },
        availability: { limited: [], booked: [] },
      }),
    }),
    {
      name: 'booking-storage',
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        
        // Revive selectedDate
        if (state.selectedDate && typeof state.selectedDate === 'string') {
          state.selectedDate = new Date(state.selectedDate);
        }
        
        // Revive availability dates
        if (state.availability) {
          if (Array.isArray(state.availability.limited)) {
            state.availability.limited = state.availability.limited.map(d => 
              typeof d === 'string' ? new Date(d) : d
            );
          }
          if (Array.isArray(state.availability.booked)) {
            state.availability.booked = state.availability.booked.map(d => 
              typeof d === 'string' ? new Date(d) : d
            );
          }
        }
      },
    }
  )
);

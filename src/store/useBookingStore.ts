import { create } from 'zustand';
import toursData from "../data/tours.json";

interface Availability {
  limited: Date[];
  booked: Date[];
}

interface BookingState {
  selectedDate: Date | undefined;
  currentStep: number;
  formData: {
    fullName: string;
    email: string;
    tourId: string | null;
    guests: number;
    specialRequests: string;
  };
  availability: Availability;
  setSelectedDate: (date: Date | undefined) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<BookingState['formData']>) => void;
  resetBooking: () => void;
}

const getInitialAvailability = (tourId: string | null): Availability => {
  const tour = toursData.find(t => t.id === tourId);
  if (!tour || !tour.dates) {
    return { limited: [], booked: [] };
  }
  
  const parseDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  return {
    limited: (tour.dates.limited || []).map(parseDate),
    booked: (tour.dates.booked || []).map(parseDate),
  };
};

export const useBookingStore = create<BookingState>((set) => ({
  selectedDate: undefined,
  currentStep: 1,
  formData: {
    fullName: '',
    email: '',
    tourId: null,
    guests: 1,
    specialRequests: '',
  },
  availability: { limited: [], booked: [] },
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
    },
    availability: { limited: [], booked: [] },
  }),
}));

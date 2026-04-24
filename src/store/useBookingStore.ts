import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchConfig as fetchAppConfig } from '../lib/api/endpoints/config';
import { fetchServices as fetchAppServices, type ServiceCategory } from '../lib/api/endpoints/services';

export type Language = 'es' | 'en';
export type Theme = 'light' | 'dark';

export interface AppConfig {
  brand_color: string;
  logo: string;
  currency: string;
  contact_email: string;
  contact_phone: string;
  company_name: string;
  timezone: string;
  event_type_label: string;
  event_label: string;
  availability_free_label: string;
  availability_regular_label: string;
  availability_no_free_label: string;
  extras_label: string;
}

interface Availability {
  limited: Date[];
  booked: Date[];
}

export interface SelectedService {
  serviceTypeId: string;
  serviceId: string;
}

interface BookingState {
  language: Language;
  theme: Theme;
  selectedDate: Date | undefined;
  currentStep: number;
  config: AppConfig | null;
  isConfigLoading: boolean;
  services: ServiceCategory[];
  isServicesLoading: boolean;
  formData: {
    fullName: string;
    email: string;
    selectedServices: SelectedService[];
    serviceGroup: string | null;
    guests: number;
    specialRequests: string;
    privacyAccepted: boolean;
  };
  visibility: {
    lang: boolean;
    theme: boolean;
    service: boolean;
  };
  availability: Availability;
  setLanguage: (language: Language) => void;
  setTheme: (theme: Theme) => void;
  setVisibility: (visibility: Partial<BookingState['visibility']>) => void;
  setSelectedDate: (date: Date | undefined) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<BookingState['formData']>) => void;
  resetBooking: () => void;
  fetchConfig: () => Promise<void>;
  fetchServices: () => Promise<void>;
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

const getIntersectedAvailability = (selectedServices: SelectedService[], allServices: any[]): Availability => {
  if (selectedServices.length === 0) {
    return { limited: [], booked: [] };
  }

  const parseDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const allBookedStrings = new Set<string>();
  const allLimitedStrings = new Set<string>();

  selectedServices.forEach(selected => {
    const service = allServices.find(s => s.id === selected.serviceId);
    if (service && service.dates) {
      (service.dates.booked || []).forEach((d: string) => allBookedStrings.add(parseDate(d).toDateString()));
      (service.dates.limited || []).forEach((d: string) => allLimitedStrings.add(parseDate(d).toDateString()));
    }
  });

  // A date is booked if it is booked for ANY service in the stack
  const booked = Array.from(allBookedStrings).map(d => new Date(d));
  
  // A date is limited if it is limited for ANY service in the stack (and not already booked)
  const limited = Array.from(allLimitedStrings)
    .filter(d => !allBookedStrings.has(d))
    .map(d => new Date(d));

  return {
    limited: injectVirtualLimitedDates(limited, booked),
    booked: booked,
  };
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      language: 'es',
      theme: 'light',
      selectedDate: undefined,
      currentStep: 1,
      formData: {
        fullName: '',
        email: '',
        selectedServices: [],
        serviceGroup: null,
        guests: 1,
        specialRequests: '',
        privacyAccepted: false,
      },
      visibility: {
        lang: true,
        theme: true,
        service: true,
      },
      availability: { limited: [], booked: [] },
      config: null,
      isConfigLoading: false,
      services: [],
      isServicesLoading: false,
      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),
      setVisibility: (visibility) => set((state) => ({ 
        visibility: { ...state.visibility, ...visibility } 
      })),
      setSelectedDate: (date) => set({ selectedDate: date }),
      setStep: (step) => set({ currentStep: step }),
      nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
      prevStep: () => set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),
      updateFormData: (data) => set((state) => {
        const newFormData = { ...state.formData, ...data };
        
        let newAvailability = state.availability;
        if (data.selectedServices) {
          const allServices = state.services.flatMap((category: any) => category.services);
          newAvailability = getIntersectedAvailability(newFormData.selectedServices, allServices);
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
          selectedServices: [],
          serviceGroup: null,
          guests: 1,
          specialRequests: '',
          privacyAccepted: false,
        },
        visibility: {
          lang: true,
          theme: true,
          service: true,
        },
        availability: { limited: [], booked: [] },
      }),


      fetchConfig: async () => {
        set({ isConfigLoading: true });
        try {
          const config = await fetchAppConfig();
          set({ config, isConfigLoading: false });
        } catch (error) {
          console.error('Error fetching config:', error);
          set({ isConfigLoading: false });
        }
      },
      fetchServices: async () => {
        set({ isServicesLoading: true });
        try {
          const services = await fetchAppServices();
          set({ services, isServicesLoading: false });
        } catch (error) {
          console.error('Error fetching services:', error);
          set({ isServicesLoading: false });
        }
      },
    }),
    {
      name: 'booking-storage',
      partialize: (state) => {
        const { visibility, config, isConfigLoading, services, isServicesLoading, ...rest } = state;
        return rest;
      },
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        
        // --- Legacy State Migration ---
        const anyState = state as any;
        if (anyState.formData && !anyState.formData.selectedServices) {
          anyState.formData.selectedServices = [];
          if (anyState.formData.serviceId && anyState.formData.serviceTypeId) {
            anyState.formData.selectedServices.push({
              serviceId: anyState.formData.serviceId,
              serviceTypeId: anyState.formData.serviceTypeId
            });
          }
          // Clean up legacy fields
          delete anyState.formData.serviceId;
          delete anyState.formData.serviceTypeId;
        }
        // ------------------------------

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

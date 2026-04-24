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
    serviceTypeId: string | null;
    serviceId: string | null;
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

const getInitialAvailability = (serviceId: string | null, allServices: any[]): Availability => {
  const selectedService = allServices.find(s => s.id === serviceId);
  
  if (!selectedService || !selectedService.dates) {
    return { limited: [], booked: [] };
  }
  
  const parseDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const limited = (selectedService.dates.limited || []).map(parseDate);
  const booked = (selectedService.dates.booked || []).map(parseDate);

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
        serviceTypeId: null,
        serviceId: null,
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
        
        if ('serviceTypeId' in data && data.serviceTypeId !== state.formData.serviceTypeId) {
          newFormData.serviceId = null;
        }

        let newAvailability = state.availability;
        if (newFormData.serviceId !== state.formData.serviceId) {
          if (newFormData.serviceId) {
            const allServices = state.services.flatMap((category: any) => category.services);
            newAvailability = getInitialAvailability(newFormData.serviceId, allServices);
          } else {
            newAvailability = { limited: [], booked: [] };
          }
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
          serviceTypeId: null,
          serviceId: null,
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
      // Visibility and config should not be persisted
      partialize: (state) => {
        const { visibility, config, isConfigLoading, services, isServicesLoading, ...rest } = state;
        return rest;
      },
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

import { useBookingStore } from "../../store/useBookingStore";
import { translations } from "./translations";

export function useTranslation() {
  const language = useBookingStore((state) => state.language);
  
  // Default to Spanish if language is not set correctly
  const t = translations[language] || translations.es;
  
  return { t, language };
}

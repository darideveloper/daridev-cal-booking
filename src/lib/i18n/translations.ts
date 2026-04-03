export const translations = {
  es: {
    status: {
      available: "Disponible",
      limited: "Pocas plazas",
      booked: "Completo",
      standard: "Estándar",
    },
    calendar: {
      tourLabel: "Tour",
      selectTour: "Selecciona un tour",
      continue: "Continuar con la reserva",
      availabilityUpdate: "La disponibilidad se actualiza diariamente.",
      selectedDate: "Fecha Seleccionada",
    },
    form: {
      title: "Datos de la reserva",
      description: "Completa tus datos para finalizar la solicitud.",
      fullName: "Nombre Completo",
      fullNamePlaceholder: "Tu nombre",
      email: "Email",
      emailPlaceholder: "tu@email.com",
      guests: "Personas (máximo 30)",
      specialRequests: "Peticiones especiales (opcional)",
      specialRequestsPlaceholder: "Cuéntanos si necesitas algo especial...",
      privacyPolicy: "He leído y acepto la política de privacidad.",
      back: "Volver",
      submit: "Solicitar Reserva",
      processing: "Procesando...",
      requiredFields: "Todos los campos marcados son obligatorios para procesar su solicitud.",
      step1Of2: "Paso 1 de 2",
      step2Of2: "Paso 2 de 2",
    },
    stripe: {
      name: "Nombre",
      email: "Email",
      tour: "Tour",
      date: "Fecha",
      guests: "Invitados",
      requests: "Peticiones",
      notSpecified: "No especificada",
      none: "Ninguna",
    },
    errors: {
      privacyRequired: "Debes aceptar la política de privacidad para continuar.",
      tourRequired: "Tour no seleccionado",
      processingError: "Error al procesar la reserva",
      noPaymentUrl: "No se recibió la URL de pago",
      tryAgain: "Por favor, inténtalo de nuevo.",
    },
    layout: {
      title: "Granada Go Tours",
    },
    accessibility: {
      toggleTheme: "Cambiar tema",
    }
  },
  en: {
    status: {
      available: "Available",
      limited: "Limited availability",
      booked: "Full",
      standard: "Standard",
    },
    calendar: {
      tourLabel: "Tour",
      selectTour: "Select a tour",
      continue: "Continue with booking",
      availabilityUpdate: "Availability is updated daily.",
      selectedDate: "Selected Date",
    },
    form: {
      title: "Booking details",
      description: "Complete your details to finalize the request.",
      fullName: "Full Name",
      fullNamePlaceholder: "Your name",
      email: "Email",
      emailPlaceholder: "your@email.com",
      guests: "Guests (max 30)",
      specialRequests: "Special requests (optional)",
      specialRequestsPlaceholder: "Tell us if you need anything special...",
      privacyPolicy: "I have read and accept the privacy policy.",
      back: "Back",
      submit: "Request Booking",
      processing: "Processing...",
      requiredFields: "All marked fields are required to process your request.",
      step1Of2: "Step 1 of 2",
      step2Of2: "Step 2 of 2",
    },
    stripe: {
      name: "Name",
      email: "Email",
      tour: "Tour",
      date: "Date",
      guests: "Guests",
      requests: "Requests",
      notSpecified: "Not specified",
      none: "None",
    },
    errors: {
      privacyRequired: "You must accept the privacy policy to continue.",
      tourRequired: "Tour not selected",
      processingError: "Error processing booking",
      noPaymentUrl: "Payment URL not received",
      tryAgain: "Please try again.",
    },
    layout: {
      title: "Granada Go Tours",
    },
    accessibility: {
      toggleTheme: "Toggle theme",
    }
  }
};

export type TranslationKeys = typeof translations.es;

# booking-form Specification

## Purpose
TBD - created by archiving change add-booking-form-fields. Update Purpose after archive.
## Requirements
### Requirement: Form Field Sync
The booking form MUST synchronize all input values with the `useBookingStore`.

#### Scenario: Update Full Name
- **Given** the user is on the booking page
- **When** the user types "Juan Pérez" in the Full Name field
- **Then** the `formData.fullName` in the Zustand store MUST be updated to "Juan Pérez"

#### Scenario: Update Email
- **Given** the user is on the booking page
- **When** the user types "juan@example.com" in the Email field
- **Then** the `formData.email` in the Zustand store MUST be updated to "juan@example.com"

#### Scenario: Select Tour
- **Given** the user is on the booking page
- **When** the user selects "Alhambra Completa" from the Tour dropdown
- **Then** the `formData.tourId` in the Zustand store MUST be updated to "alhambra-completa"

### Requirement: Visual Branding
All form elements MUST adhere to the project's brand color palette.

#### Scenario: Focus State
- **Given** an input field is focused
- **Then** its border or ring color MUST use the `brand-red` color.

### Requirement: Responsive Layout
The booking interface MUST adapt its layout based on the screen size and the current step.

#### Scenario: Multi-Step Sequence (NEW)
- **Given** the user is on Step 1 (`currentStep === 1`)
- **Then** the `BookingCalendar` MUST be primary and visible.
- **When** the user selects a date and clicks "Next"
- **Then** the `BookingForm` MUST be displayed (Step 2).

#### Scenario: Compact Field Grouping (NEW)
- **Given** the user is on Step 2 (Form) and screen width is 768px (md) or greater
- **Then** `Nombre Completo` and `Email` MUST be displayed in the same row.
- **And** `Tour` and `Número de personas` MUST be displayed in the same row.
- **And** `Peticiones especiales` MUST span the full width of the form.

### Requirement: State Synchronization & Navigation
The booking flow MUST persist state across steps and provide clear navigation.

#### Scenario: Next Button Behavior (NEW)
- **Given** the user is on Step 1
- **When** the user has NOT selected a date
- **Then** the "Continuar con la reserva" button MUST be disabled.
- **When** the user selects an available date
- **Then** the "Continuar con la reserva" button MUST be enabled.

#### Scenario: Back Button Behavior (NEW)
- **Given** the user is on Step 2
- **When** the user clicks "Volver"
- **Then** the `currentStep` MUST revert to 1.
- **And** all data already entered in the form MUST remain in the store.
- **And** the previously selected date MUST remain selected on the calendar.

### Requirement: Form Initialization
The booking form MUST support initialization of its state via component properties.

#### Scenario: Initialize Tour ID
- **Given** the `BookingForm` is rendered with `initialTourId="alhambra-completa"`
- **When** the component mounts
- **Then** the `formData.tourId` in the Zustand store MUST be set to "alhambra-completa".


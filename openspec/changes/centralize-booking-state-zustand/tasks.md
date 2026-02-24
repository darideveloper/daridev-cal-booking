# Tasks: Centralize Booking State

- [ ] **Setup**
    - [ ] Install `zustand` using `npm install zustand`.

- [ ] **Store Creation**
    - [ ] Create `src/store/useBookingStore.ts`.
    - [ ] Define the `BookingState` interface.
    - [ ] Implement the store with `selectedDate` and `setSelectedDate`.

- [ ] **Component Refactor**
    - [ ] Update `src/components/BookingCalendar.tsx` to use `useBookingStore`.
    - [ ] Replace `useState` for date with store hooks.
    - [ ] Ensure calendar interactions correctly update the store.

- [ ] **Validation**
    - [ ] Verify that selecting a date in the calendar updates the store state.
    - [ ] Verify that the status display correctly reads from the store state.
    - [ ] Run `openspec validate centralize-booking-state-zustand`.

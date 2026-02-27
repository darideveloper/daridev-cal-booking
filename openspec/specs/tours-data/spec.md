# tours-data Specification

## Purpose
TBD - created by archiving change add-faqs-to-tours. Update Purpose after archive.
## Requirements
### Requirement: Include FAQs in Tour Data
Every tour object in the catalog MUST provide a set of frequently asked questions to assist potential visitors.

#### Scenario: Displaying FAQs on Tour Details
- **GIVEN** a tour object from `src/data/tours.json`
- **WHEN** the tour details are rendered
- **THEN** it should have access to a `faqs` property containing an array of at least 2 question-answer pairs.

#### Scenario: Language Consistency
- **GIVEN** the project's primary language is Spanish
- **WHEN** FAQs are added to the data
- **THEN** both `question` and `answer` fields MUST be written in professional Spanish.

#### Scenario: Tour-Specific Content
- **GIVEN** a tour with a specific theme (e.g., "Religioso")
- **WHEN** FAQs are generated
- **THEN** the content MUST reflect that theme and provide relevant historical or logistical context.

### Requirement: Tour Availability Data
Every tour object in the catalog MUST provide accurate availability information for booking.

#### ADDED Scenario: Consistency in Availability Patterns
- **GIVEN** a tour object in `src/data/tours.json`
- **WHEN** availability arrays are populated
- **THEN** it MUST prioritize weekends (Saturdays and Sundays) as `limited`.
- **AND** it MUST keep the `booked` array empty for all tours.
- **AND** it MUST mark the majority of other weekdays as `available`.

#### ADDED Scenario: Visual Variety in Limited Status
- **GIVEN** the collection of all tours
- **WHEN** the `limited` arrays are defined
- **THEN** each tour SHOULD include 1-2 random weekdays in its `limited` array to avoid perfectly uniform availability patterns across the catalog.


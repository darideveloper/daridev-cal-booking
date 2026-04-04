# Booking Flow URL Variables

The booking flow can be pre-configured and its UI customized using the following URL query parameters.

## Available Parameters

### `service` (formerly `tour`)
- **Description**: Pre-selects a specific service (tour) by its ID.
- **Values**: Any valid service ID (e.g., `alhambra-completa`, `catedral-granada`).
- **Effect**: If provided, the service selection dropdown will be hidden from the user.
- **Compatibility**: The older `tour` parameter is still supported but `service` is preferred.

### `lang`
- **Description**: Sets the initial language of the booking flow.
- **Values**: `es` (Spanish), `en` (English).
- **Effect**: If provided, the language toggle will be hidden from the user.

### `theme`
- **Description**: Sets the initial visual theme.
- **Values**: `light`, `dark`.
- **Effect**: If provided, the theme toggle will be hidden from the user.

### `client`
- **Description**: Identifies a specific client for dynamic branding and configuration.
- **Values**: String identifier (e.g., `granada-go`).
- **Effect**: If provided, the application will fetch branding assets (colors, logos) and business rules from a dedicated configuration endpoint using this identifier.

### `service_group`
- **Description**: Optional identifier for a group of services.
- **Values**: String identifier.
- **Effect**: Stored in the application state for future filtering or categorization logic.

## Usage Examples

### Pre-configured English Booking for Alhambra
`https://your-domain.com/?service=alhambra-completa&lang=en`

### Dark Theme Spanish Booking with Fixed Service
`https://your-domain.com/?service=catedral-granada&lang=es&theme=dark`

### Full Customization with Dynamic Branding
`https://your-domain.com/?client=granada-go&service=alhambra-completa&lang=en&theme=light`

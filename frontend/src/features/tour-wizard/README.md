# TourWizard Component

A fully self-contained, 4-step wizard modal built for travel operators to manage client files, vehicle configurations, itinerary timelines, and send automated booking request emails to lodging partners.

## Directory Structure

```bash
tour-wizard/
├── README.md               # Integration & props documentation
├── TourWizard.jsx          # Main dialog component & state coordinator
├── Stepper.jsx             # Visual pill navigation indicator
├── AddAgentPopover.jsx     # Inline agent register panel
├── AirTrainTable.jsx       # Domestic flight/rail segment grid
├── TripPlanTable.jsx       # Custom itinerary stay rows, dates & room grid
├── HotelRequestsTable.jsx  # Derived reservations, checks overrides
├── EmailComposeModal.jsx   # Rich HTML composer previewing output templates
├── syncHotelRequests.js    # Data formatter mappingplan rows to lodging blocks
└── emailTemplate.js        # Standard HTML format notifications template
```

## Props Configuration

```jsx
import TourWizard from "./features/tour-wizard/TourWizard";

// Inside the page:
<TourWizard
  open={isModalOpen}
  onOpenChange={setIsModalOpen}
  initialTour={editingTour} // Passing null generates a new RT number
  tours={toursList}         // Used to dynamically compute sequential RT IDs
  cities={citiesList}       // List of operating cities
  hotels={hotelsList}       // Partnership properties database
  agents={agentsList}       // Integrated travel agency partners
  onSubmit={handleSubmit}   // Triggers with consolidated payload
  onSendEmail={handleSend}  // Submits composed template body overrides
/>
```

### Properties Definition

| Prop Name | Type | Description |
|---|---|---|
| `open` | Boolean (Required) | Switches visibility of modal dialogue. |
| `onOpenChange` | Function(Boolean) | Hook callback triggered on closes/toggles. |
| `initialTour` | Object (Optional) | Existing tour details if editing. If empty/null, resets parameters to blank. |
| `tours` | Array | Existing tours collection inside state, used for sequential suffix tracking. |
| `cities` | Array | Operating destinations Master list data. |
| `hotels` | Array | Lodging partners DB containing reservation emails. |
| `agents` | Array | Partner agencies. |
| `onSubmit` | Function(payload) | Emits all values collectively on complete save/finish events. |
| `onSendEmail` | Function(emailPayload) | Triggers on booking request mail sends with subject, to address list and contents. |

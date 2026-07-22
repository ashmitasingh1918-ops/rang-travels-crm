/**
 * TourWizard.stories.jsx
 * Storybook configurations for the TourWizard component.
 */
import React from "react";
import TourWizard from "./TourWizard";

export default {
  title: "CRM/TourWizard",
  component: TourWizard,
  argTypes: {
    onSubmit: { action: "submitted" },
    onSendEmail: { action: "email_sent" }
  }
};

const MOCK_CITIES = [
  { id: "c-jaipur", name: "Jaipur", code: "JAI" },
  { id: "c-udaipur", name: "Udaipur", code: "UDR" },
  { id: "c-goa", name: "Goa", code: "GOI" }
];

const MOCK_HOTELS = [
  { id: "h-rambagh", name: "Taj Rambagh Palace", city: "Jaipur", email: "reservations.rambagh@tajhotels.com", category: "5★ Luxury" },
  { id: "h-oberoi", name: "The Oberoi Udaivilas", city: "Udaipur", email: "reservations.udaivilas@oberoihotels.com", category: "5★ Luxury" },
  { id: "h-tajgoa", name: "Taj Goa Resort", city: "Goa", email: "reservations.exotica@tajhotels.com", category: "5★ Luxury" }
];

const MOCK_AGENTS = [
  { id: "a-mmt", name: "MakeMyTrip India", country: "India" },
  { id: "a-tcook", name: "Thomas Cook UK", country: "United Kingdom" }
];

const Template = (args) => <TourWizard {...args} />;

// 1. New Tour Story
export const NewTour = Template.bind({});
NewTour.args = {
  open: true,
  initialTour: null,
  tours: [],
  cities: MOCK_CITIES,
  hotels: MOCK_HOTELS,
  agents: MOCK_AGENTS,
  onOpenChange: (val) => console.log("onOpenChange", val)
};

// 2. Edit Tour Story
export const EditTour = Template.bind({});
EditTour.args = {
  open: true,
  initialTour: {
    id: "RT-2026-007",
    clientName: "Rahul Sharma",
    clientNationality: "Indian",
    email: "rahul@gmail.com",
    phone: "+91 9988776655",
    travelers: 4,
    tourName: "Heritage Voyage",
    startDate: "2026-07-25",
    endDate: "2026-08-01",
    vehicleType: "SUV",
    guideRequired: true,
    guideLanguage: "English",
    sglCount: 0,
    dblCount: 2,
    tplCount: 0,
    mealPlan: "CP - Breakfast",
    monumentFeesIncluded: true,
    monumentFees: "Amber Fort, Udaipur City Palace",
    itinerary: [
      {
        id: "row-1",
        arrivalDate: "2026-07-25",
        departureDate: "2026-07-28",
        cityId: "c-jaipur",
        nights: 3,
        sglCount: 0,
        dblCount: 2,
        tplCount: 0,
        mealPlan: "CP - Breakfast",
        transport: "Car",
        hotelId: "Taj Rambagh Palace"
      },
      {
        id: "row-2",
        arrivalDate: "2026-07-28",
        departureDate: "2026-08-01",
        cityId: "c-udaipur",
        nights: 4,
        sglCount: 0,
        dblCount: 2,
        tplCount: 0,
        mealPlan: "CP - Breakfast",
        transport: "Car",
        hotelId: "The Oberoi Udaivilas"
      }
    ]
  },
  tours: [{ id: "RT-2026-007" }],
  cities: MOCK_CITIES,
  hotels: MOCK_HOTELS,
  agents: MOCK_AGENTS,
  onOpenChange: (val) => console.log("onOpenChange", val)
};

// 3. After Send Mail Story
export const AfterSendMail = Template.bind({});
AfterSendMail.args = {
  open: true,
  initialTour: {
    id: "RT-2026-008",
    clientName: "Alice Smith",
    clientNationality: "British",
    email: "alice.smith@gmail.com",
    phone: "+44 207 946 0958",
    travelers: 2,
    tourName: "Rajasthan Luxury Itinerary",
    startDate: "2026-09-10",
    endDate: "2026-09-15",
    vehicleType: "Sedan",
    guideRequired: false,
    sglCount: 0,
    dblCount: 1,
    tplCount: 0,
    mealPlan: "CP - Breakfast",
    itinerary: [
      {
        id: "row-1",
        arrivalDate: "2026-09-10",
        departureDate: "2026-09-15",
        cityId: "c-jaipur",
        nights: 5,
        sglCount: 0,
        dblCount: 1,
        tplCount: 0,
        mealPlan: "CP - Breakfast",
        transport: "Car",
        hotelId: "Taj Rambagh Palace"
      }
    ]
  },
  tours: [{ id: "RT-2026-007" }, { id: "RT-2026-008" }],
  cities: MOCK_CITIES,
  hotels: MOCK_HOTELS,
  agents: MOCK_AGENTS,
  onOpenChange: (val) => console.log("onOpenChange", val)
};

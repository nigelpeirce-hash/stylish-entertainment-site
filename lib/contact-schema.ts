import * as z from "zod";

export const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  eventDate: z.string().min(1, "Please provide your event date"),
  venueName: z.string().min(2, "Venue name must be at least 2 characters"),
  eventType: z.string().min(1, "Please select an event type"),
  preferredDJ: z.string().optional(),
  upsells: z.array(z.string()).optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type FormData = z.infer<typeof formSchema>;

export const eventTypeOptions = [
  { value: "", label: "Select an option..." },
  { value: "Wedding", label: "Wedding" },
  { value: "Corporate", label: "Corporate" },
  { value: "Private Party", label: "Private Party" },
  { value: "Other", label: "Other" },
];

export const djOptions = [
  { value: "", label: "Any DJ" },
  { value: "DJ Nige", label: "DJ Nige" },
  { value: "Rich S", label: "Rich S" },
  { value: "James H", label: "James H" },
  { value: "Brett", label: "Brett" },
];

export const upsellOptions = [
  { id: "lighting", label: "Professional Lighting Design", category: "Styling" },
  { id: "musicians", label: "Live Musicians (Sax, Bongos)", category: "Entertainment" },
  { id: "fire-pits", label: "Fire Pit Hire", category: "Styling" },
  { id: "venue-styling", label: "Venue Styling & Decoration", category: "Styling" },
  { id: "early-setup", label: "Early Setup Available", category: "Service" },
  { id: "extended-hours", label: "Extended Performance Hours", category: "Service" },
];

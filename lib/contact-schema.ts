import * as z from "zod";

export const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  eventDate: z.string().min(1, "Please provide your event date"),
  venueName: z.string().min(2, "Venue name must be at least 2 characters"),
  referralSource: z.string().min(1, "Please select how you heard about us"),
  eventType: z.string().min(1, "Please select an event type"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type FormData = z.infer<typeof formSchema>;

export const referralOptions = [
  { value: "", label: "Select an option..." },
  { value: "Google Search", label: "Google Search" },
  { value: "Instagram", label: "Instagram" },
  { value: "Recommended by Venue", label: "Recommended by Venue" },
  { value: "Recommended by Friend", label: "Recommended by Friend" },
  { value: "stylishweddingdisco.co.uk", label: "stylishweddingdisco.co.uk" },
  { value: "Other", label: "Other" },
];

export const eventTypeOptions = [
  { value: "", label: "Select an option..." },
  { value: "Wedding", label: "Wedding" },
  { value: "Corporate", label: "Corporate" },
  { value: "Private Party", label: "Private Party" },
  { value: "Other", label: "Other" },
];

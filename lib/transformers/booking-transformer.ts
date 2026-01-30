/**
 * Booking Data Transformer
 * 
 * Transforms raw Prisma booking data into a sanitized, UI-safe format.
 * This ensures consistent data shapes and prevents React rendering errors.
 * 
 * All data sanitization happens here, not in React components.
 */

/**
 * Sanitized booking interface - represents the clean data shape the UI expects
 */
export interface SanitizedBooking {
  id: string;
  name: string;
  email: string;
  phoneAreaCode: string | null;
  phoneNumber: string | null;
  clientAddress?: string | null;
  clientAddress2?: string | null;
  clientTown?: string | null;
  clientCounty?: string | null;
  clientPostcode?: string | null;
  eventType: string;
  eventDate: string;
  ceremonyTime?: string | null;
  venueName: string;
  venueAddress: string | null;
  venueTown: string | null;
  venuePostcode: string | null;
  numberOfGuests: number | null;
  services: string[]; // Always array of strings
  upsellItems: string[]; // Always array of strings
  preferredDJ: string | null;
  message: string | null;
  budget: string | null;
  status: string;
  contactPreference: string | null;
  djArrivalTime?: string | null;
  djStartTime?: string | null;
  djFinishTime?: string | null;
  djSetupLocation?: string | null;
  djParking?: string | null;
  soundLimiter?: boolean | null;
  venueIsPrivateHouse?: boolean | null;
  venueWhat3Words?: string | null;
  venueLoadInNotes?: string | null;
  firstDance?: string | null;
  lastSong?: string | null;
  musicDislikes?: string | null;
  musicRequests?: string | null;
  musicNotesToDJ?: string | null;
  musicFileUrl?: string | null;
  venueContact?: string | null;
  venueAddress2?: string | null;
  venueCounty?: string | null;
  venuePhoneAreaCode?: string | null;
  venuePhoneNumber?: string | null;
  assignedDJEmail?: string | null;
  assignedDJName?: string | null;
  bookingReference: string | null;
  priority: string;
  conflictStatus: string | null;
  assignedTo?: string | null;
  handoffStatus?: string | null;
  handoffNote?: string | null;
  finalBalance: string | null;
  bookingFee?: string | null;
  adminNotes?: string | null;
  feeBreakdown: Array<{
    id: string;
    description: string;
    amount: number;
  }> | null; // Always properly structured or null
  taxInclusive?: boolean | null;
  taxRate?: number | null;
  selectedTemplate?: string | null;
  depositReceived?: boolean | null;
  depositReceivedManual?: boolean | null;
  confirmedViaBookFromQuote?: boolean;
  depositInvoiceSentAt?: string | null;
  depositPaidClickedAt?: string | null;
  updatedAt?: string;
  lastEmailSentAt?: string | null;
  finalDetailsConfirmed?: boolean | null;
  finalDetailsConfirmedManual?: boolean | null;
  djWorksheetApproved?: boolean | null;
  djWorksheetApprovedManual?: boolean | null;
  User?: { id: string; name: string; email: string } | null;
  staffAssignments: Array<{
    id: string;
    role: string;
    agreedFee: number; // Always a number, never an object
    status: string;
    confirmationEmailSent: boolean;
    confirmationSentAt?: Date | string | null;
    staff: {
      id: string;
      name: string;
      email: string | null;
      phone?: string | null;
      roles?: string[];
    };
  }>; // Always an array, never undefined
  bookingItems?: Array<{
    id: string;
    quantity: number;
    status: string;
    HireItem: { id: string; name: string; price: number; category: string | null };
  }>;
  warehouseItems?: Array<{
    id: string;
    quantity: number;
    WarehouseItem: {
      id: string;
      name: string;
      category: string;
      weight: number | null;
      size: string | null;
    };
  }>;
  emailThreads?: Array<{
    id: string;
    subject: string;
    fromEmail: string;
    lastMessageAt: Date | string;
    isRead: boolean;
  }>;
}

/**
 * Helper to safely convert any value that might be an object with {fee} key to a number
 * Handles nested objects recursively to prevent React rendering errors
 */
function sanitizeFeeValue(val: unknown): number {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (typeof val === 'string') {
    const parsed = parseFloat(val);
    return isNaN(parsed) ? 0 : parsed;
  }
  if (typeof val === 'object' && val !== null) {
    const obj = val as Record<string, unknown>;
    // Try to extract numeric value from common keys
    if (typeof obj.fee === 'number') return obj.fee;
    if (typeof obj.amount === 'number') return obj.amount;
    if (typeof obj.value === 'number') return obj.value;
    // If nested object, recurse (but limit depth to prevent infinite loops)
    if (typeof obj.fee === 'object' && obj.fee !== null) {
      const nested = sanitizeFeeValue(obj.fee);
      if (nested > 0) return nested;
    }
    if (typeof obj.amount === 'object' && obj.amount !== null) {
      const nested = sanitizeFeeValue(obj.amount);
      if (nested > 0) return nested;
    }
    // Try to parse string values
    if (typeof obj.fee === 'string') {
      const parsed = parseFloat(obj.fee);
      if (!isNaN(parsed)) return parsed;
    }
    if (typeof obj.amount === 'string') {
      const parsed = parseFloat(obj.amount);
      if (!isNaN(parsed)) return parsed;
    }
  }
  return 0;
}

/**
 * Sanitize a service/item value to ensure it's a string
 */
function sanitizeStringArrayItem(item: unknown): string {
  if (typeof item === 'string') return item;
  if (typeof item === 'object' && item !== null) {
    const obj = item as Record<string, unknown>;
    return String(obj.name || obj.type || obj.service || obj.item || 'Item');
  }
  return String(item);
}

/**
 * Transform raw Prisma booking data into sanitized format
 * 
 * @param booking - Raw booking data from Prisma (with includes)
 * @param emailThreads - Optional email threads array
 * @returns Sanitized booking data safe for React rendering
 */
export function transformBooking(
  booking: any,
  emailThreads?: Array<{
    id: string;
    subject: string;
    fromEmail: string;
    lastMessageAt: Date | string;
    isRead: boolean;
  }>
): SanitizedBooking {
  // Ensure services is array of strings, not objects
  const services = Array.isArray(booking?.services)
    ? booking.services.map(sanitizeStringArrayItem)
    : [];

  // Ensure upsellItems is array of strings, not objects
  const upsellItems = Array.isArray(booking?.upsellItems)
    ? booking.upsellItems.map(sanitizeStringArrayItem)
    : [];

  // Ensure feeBreakdown items are properly structured
  // This prevents React errors from rendering objects directly
  const feeBreakdown = Array.isArray(booking?.feeBreakdown)
    ? booking.feeBreakdown
        .filter((item: any) => item !== null && item !== undefined) // Remove null/undefined items
        .map((item: any) => {
          // Extract amount from various possible structures
          let amount = 0;
          if (item?.amount !== undefined) {
            amount = sanitizeFeeValue(item.amount);
          }
          if (amount === 0 && item?.fee !== undefined) {
            amount = sanitizeFeeValue(item.fee);
          }
          
          return {
            id: String(item?.id ?? `item-${Math.random().toString(36).substr(2, 9)}`),
            description: String(item?.description ?? item?.name ?? 'Service'),
            amount: amount, // Always a number, never an object
          };
        })
    : null;

  // Sanitize staffAssignments - ensure ALL nested objects are safe
  const staffAssignments = Array.isArray(booking?.staffAssignments)
    ? booking.staffAssignments.map((assignment: any) => {
        // Double-sanitize agreedFee to ensure it's never an object
        const rawFee = assignment?.agreedFee;
        let sanitizedFee = sanitizeFeeValue(rawFee);
        // If sanitizeFeeValue somehow returns an object (shouldn't happen, but be defensive)
        if (typeof sanitizedFee === 'object' && sanitizedFee !== null) {
          sanitizedFee = sanitizeFeeValue(sanitizedFee);
        }
        // Final check - must be a number
        if (typeof sanitizedFee !== 'number' || isNaN(sanitizedFee)) {
          sanitizedFee = 0;
        }
        
        return {
          id: String(assignment?.id ?? ''),
          role: String(assignment?.role ?? ''),
          agreedFee: sanitizedFee, // Always a number, never an object
          status: String(assignment?.status ?? ''),
          confirmationEmailSent: Boolean(assignment?.confirmationEmailSent),
          confirmationSentAt: assignment?.confirmationSentAt ?? null,
          // Ensure staff object is also clean
          staff: assignment?.staff
            ? {
                id: String(assignment.staff.id ?? ''),
                name: String(assignment.staff.name ?? ''),
                email: assignment.staff.email ? String(assignment.staff.email) : null,
                phone: assignment.staff.phone ? String(assignment.staff.phone) : null,
                roles: Array.isArray(assignment.staff.roles)
                  ? assignment.staff.roles.map(String)
                  : undefined,
              }
            : {
                id: '',
                name: 'Unknown',
                email: null,
              },
        };
      })
    : [];

  // Convert Date objects to ISO strings for JSON serialization
  const convertDate = (date: Date | string | null | undefined): string | null => {
    if (!date) return null;
    if (date instanceof Date) return date.toISOString();
    if (typeof date === 'string') return date;
    return null;
  };

  // Build sanitized booking object
  const sanitized: SanitizedBooking = {
    id: String(booking?.id ?? ''),
    name: String(booking?.name ?? ''),
    email: String(booking?.email ?? ''),
    phoneAreaCode: booking?.phoneAreaCode ? String(booking.phoneAreaCode) : null,
    phoneNumber: booking?.phoneNumber ? String(booking.phoneNumber) : null,
    clientAddress: booking?.clientAddress ? String(booking.clientAddress) : null,
    clientAddress2: booking?.clientAddress2 ? String(booking.clientAddress2) : null,
    clientTown: booking?.clientTown ? String(booking.clientTown) : null,
    clientCounty: booking?.clientCounty ? String(booking.clientCounty) : null,
    clientPostcode: booking?.clientPostcode ? String(booking.clientPostcode) : null,
    eventType: String(booking?.eventType ?? ''),
    eventDate: convertDate(booking?.eventDate) ?? '',
    ceremonyTime: convertDate(booking?.ceremonyTime),
    venueName: String(booking?.venueName ?? ''),
    venueAddress: booking?.venueAddress ? String(booking.venueAddress) : null,
    venueTown: booking?.venueTown ? String(booking.venueTown) : null,
    venuePostcode: booking?.venuePostcode ? String(booking.venuePostcode) : null,
    numberOfGuests: typeof booking?.numberOfGuests === 'number' ? booking.numberOfGuests : null,
    services,
    upsellItems,
    preferredDJ: booking?.preferredDJ ? String(booking.preferredDJ) : null,
    message: booking?.message ? String(booking.message) : null,
    budget: booking?.budget ? String(booking.budget) : null,
    status: String(booking?.status ?? ''),
    contactPreference: booking?.contactPreference ? String(booking.contactPreference) : null,
    djArrivalTime: booking?.djArrivalTime ? String(booking.djArrivalTime) : null,
    djStartTime: booking?.djStartTime ? String(booking.djStartTime) : null,
    djFinishTime: booking?.djFinishTime ? String(booking.djFinishTime) : null,
    djSetupLocation: booking?.djSetupLocation ? String(booking.djSetupLocation) : null,
    djParking: booking?.djParking ? String(booking.djParking) : null,
    soundLimiter: booking?.soundLimiter ?? null,
    venueIsPrivateHouse: booking?.venueIsPrivateHouse ?? null,
    venueWhat3Words: booking?.venueWhat3Words ? String(booking.venueWhat3Words) : null,
    venueLoadInNotes: booking?.venueLoadInNotes ? String(booking.venueLoadInNotes) : null,
    firstDance: booking?.firstDance ? String(booking.firstDance) : null,
    lastSong: booking?.lastSong ? String(booking.lastSong) : null,
    musicDislikes: booking?.musicDislikes ? String(booking.musicDislikes) : null,
    musicRequests: booking?.musicRequests ? String(booking.musicRequests) : null,
    musicNotesToDJ: booking?.musicNotesToDJ ? String(booking.musicNotesToDJ) : null,
    musicFileUrl: booking?.musicFileUrl ? String(booking.musicFileUrl) : null,
    venueContact: booking?.venueContact ? String(booking.venueContact) : null,
    venueAddress2: booking?.venueAddress2 ? String(booking.venueAddress2) : null,
    venueCounty: booking?.venueCounty ? String(booking.venueCounty) : null,
    venuePhoneAreaCode: booking?.venuePhoneAreaCode ? String(booking.venuePhoneAreaCode) : null,
    venuePhoneNumber: booking?.venuePhoneNumber ? String(booking.venuePhoneNumber) : null,
    assignedDJEmail: booking?.assignedDJEmail ? String(booking.assignedDJEmail) : null,
    assignedDJName: booking?.assignedDJName ? String(booking.assignedDJName) : null,
    bookingReference: booking?.bookingReference ? String(booking.bookingReference) : null,
    priority: String(booking?.priority ?? ''),
    conflictStatus: booking?.conflictStatus ? String(booking.conflictStatus) : null,
    assignedTo: booking?.assignedTo ? String(booking.assignedTo) : null,
    handoffStatus: booking?.handoffStatus ? String(booking.handoffStatus) : null,
    handoffNote: booking?.handoffNote ? String(booking.handoffNote) : null,
    finalBalance: booking?.finalBalance ? String(booking.finalBalance) : null,
    bookingFee: booking?.bookingFee ? String(booking.bookingFee) : null,
    adminNotes: booking?.adminNotes ? String(booking.adminNotes) : null,
    feeBreakdown,
    taxInclusive: booking?.taxInclusive ?? null,
    taxRate: typeof booking?.taxRate === 'number' ? booking.taxRate : null,
    selectedTemplate: booking?.selectedTemplate ? String(booking.selectedTemplate) : null,
    depositReceived: booking?.depositReceived ?? null,
    depositReceivedManual: booking?.depositReceivedManual ?? null,
    confirmedViaBookFromQuote: Boolean(booking?.confirmedViaBookFromQuote),
    depositInvoiceSentAt: convertDate(booking?.depositInvoiceSentAt),
    depositPaidClickedAt: convertDate(booking?.depositPaidClickedAt),
    updatedAt: convertDate(booking?.updatedAt) || undefined,
    lastEmailSentAt: convertDate(booking?.lastEmailSentAt),
    finalDetailsConfirmed: booking?.finalDetailsConfirmed ?? null,
    finalDetailsConfirmedManual: booking?.finalDetailsConfirmedManual ?? null,
    djWorksheetApproved: booking?.djWorksheetApproved ?? null,
    djWorksheetApprovedManual: booking?.djWorksheetApprovedManual ?? null,
    staffAssignments,
    // Preserve User relation if present
    User: booking?.User
      ? {
          id: String(booking.User.id),
          name: String(booking.User.name),
          email: String(booking.User.email),
        }
      : null,
    // Preserve bookingItems if present
    bookingItems: Array.isArray(booking?.bookingItems)
      ? booking.bookingItems.map((item: any) => ({
        id: String(item.id ?? ''),
        quantity: typeof item.quantity === 'number' ? item.quantity : 0,
        status: String(item.status ?? ''),
        HireItem: {
            id: String(item.HireItem?.id ?? ''),
            name: String(item.HireItem?.name ?? ''),
            price: typeof item.HireItem?.price === 'number' ? item.HireItem.price : 0,
            category: item.HireItem?.category ? String(item.HireItem.category) : null,
          },
        }))
      : undefined,
    // Preserve warehouseItems if present
    warehouseItems: Array.isArray(booking?.warehouseItems)
      ? booking.warehouseItems.map((item: any) => ({
        id: String(item.id ?? ''),
        quantity: typeof item.quantity === 'number' ? item.quantity : 0,
        WarehouseItem: {
            id: String(item.WarehouseItem?.id ?? ''),
            name: String(item.WarehouseItem?.name ?? ''),
            category: String(item.WarehouseItem?.category ?? ''),
            weight: typeof item.WarehouseItem?.weight === 'number' ? item.WarehouseItem.weight : null,
            size: item.WarehouseItem?.size ? String(item.WarehouseItem.size) : null,
          },
        }))
      : undefined,
    // Add emailThreads if provided
    emailThreads: emailThreads
      ? emailThreads.map((thread) => ({
          id: String(thread.id),
          subject: String(thread.subject),
          fromEmail: String(thread.fromEmail),
          lastMessageAt: thread.lastMessageAt instanceof Date 
            ? thread.lastMessageAt.toISOString() 
            : String(thread.lastMessageAt),
          isRead: Boolean(thread.isRead),
        }))
      : undefined,
  };

  return sanitized;
}

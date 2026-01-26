// Google Analytics 4 Event Tracking Utility
// Fires conversion events for key user actions

declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'js',
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}

/**
 * Track a GA4 event
 * Only fires if gtag is loaded
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
    console.log(`[Analytics] Event tracked: ${eventName}`, params);
  }
}

/**
 * Track enquiry form completion - CONVERSION EVENT
 * This should be set up as a conversion in GA4 Admin
 */
export function trackEnquiryComplete(params: {
  eventType?: string;
  eventDate?: string;
  source?: string;
}) {
  trackEvent('generate_lead', {
    currency: 'GBP',
    value: 1, // Placeholder value for lead
    event_category: 'enquiry',
    event_label: params.eventType || 'general',
    ...params,
  });
  
  // Also fire custom event for easier filtering
  trackEvent('enquiry_complete', {
    event_category: 'conversion',
    event_type: params.eventType,
    event_date: params.eventDate,
    source: params.source || 'contact_form',
  });
}

/**
 * Track booking confirmation (when enquiry converts to booking)
 */
export function trackBookingConfirmed(params: {
  bookingId?: string;
  eventType?: string;
  value?: number;
}) {
  trackEvent('purchase', {
    currency: 'GBP',
    value: params.value || 0,
    transaction_id: params.bookingId,
    event_category: 'booking',
    event_label: params.eventType,
  });
}

/**
 * Track guest song request submission
 */
export function trackGuestSongRequest(params: {
  coupleName?: string;
  songCount?: number;
}) {
  trackEvent('guest_song_request', {
    event_category: 'engagement',
    couple_name: params.coupleName,
    song_count: params.songCount,
  });
}

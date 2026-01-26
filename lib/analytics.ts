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
 * Check if analytics should be disabled (e.g., for internal users)
 */
function isAnalyticsDisabled(): boolean {
  if (typeof window === 'undefined') return true;
  
  // Check for debug/internal flag in localStorage
  // Set this in browser console: localStorage.setItem('disable_analytics', 'true')
  if (localStorage.getItem('disable_analytics') === 'true') {
    return true;
  }
  
  return false;
}

/**
 * Track a GA4 event
 * Only fires if gtag is loaded and not disabled
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>
) {
  if (isAnalyticsDisabled()) {
    console.log(`[Analytics] BLOCKED (internal): ${eventName}`, params);
    return;
  }
  
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
    console.log(`[Analytics] Event tracked: ${eventName}`, params);
  }
}

/**
 * Track enquiry form completion - CONVERSION EVENT
 * Uses existing GA4 event name: Form_Submission
 */
export function trackEnquiryComplete(params: {
  eventType?: string;
  eventDate?: string;
  source?: string;
}) {
  // Fire the existing event name that's already set up as a key event
  trackEvent('Form_Submission', {
    event_category: 'enquiry',
    event_type: params.eventType || 'general',
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

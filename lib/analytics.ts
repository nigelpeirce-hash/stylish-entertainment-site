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
 * Uses gtag when available; otherwise pushes to dataLayer so the event is queued
 * for when gtag loads (important for thank-you page where gtag may load after useEffect)
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>
) {
  if (isAnalyticsDisabled()) {
    return;
  }
  
  if (typeof window === 'undefined') return;

  if (window.gtag) {
    console.log("[Analytics] gtag event fired:", eventName, params);
    window.gtag('event', eventName, params);
  } else {
    console.warn("[Analytics] gtag not available, pushing to dataLayer:", eventName);
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: eventName,
      ...params,
    });
  }
}

/**
 * Track enquiry form completion - CONVERSION EVENT
 * Fires Form_Submission (custom) and generate_lead (GA4 recommended – mark as Key event in GA4 Admin)
 */
export function trackEnquiryComplete(params: {
  eventType?: string;
  eventDate?: string;
  source?: string;
}) {
  const payload = {
    event_category: 'enquiry',
    event_type: params.eventType || 'general',
    event_date: params.eventDate,
    source: params.source || 'contact_form',
  };
  trackEvent('Form_Submission', payload);
  // GA4 recommended event – in GA4 Admin → Events → mark "generate_lead" as Key event to see conversions
  trackEvent('generate_lead', { ...payload, method: params.source || 'contact_form' });
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

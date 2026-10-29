// Royal Agra Estate - Google Ads Conversion Tracking & Analytics Engine
// Official Tag ID: AW-18528029194 (Account: 814-741-2617 Real Estate)

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Safely dispatches custom events to Google Ads gtag
 */
export const trackEvent = (eventName: string, params: Record<string, any> = {}): void => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    try {
      window.gtag('event', eventName, params);
    } catch (err) {
      console.warn('[Google Tag] Event dispatch error:', err);
    }
  }
};

/**
 * Track high-intent lead generation when visitor submits consultation/booking form
 */
export const trackLeadSubmission = (lead: {
  buyerName?: string;
  phone?: string;
  email?: string;
  propertyTitle?: string;
  inquiryType?: string;
}): void => {
  trackEvent('generate_lead', {
    event_category: 'engagement',
    event_label: lead.propertyTitle || 'General Consultation Inquiry',
    inquiry_type: lead.inquiryType || 'General',
    send_to: 'AW-18528029194'
  });
};

/**
 * Track direct WhatsApp VIP Concierge chats
 */
export const trackWhatsAppClick = (propertyTitle?: string): void => {
  trackEvent('contact', {
    method: 'whatsapp',
    event_label: propertyTitle || 'Direct Concierge Chat',
    send_to: 'AW-18528029194'
  });
};

/**
 * Track direct phone calls to Royal Agra Estate
 */
export const trackPhoneClick = (): void => {
  trackEvent('contact', {
    method: 'phone',
    event_label: '+91 91490 79913',
    send_to: 'AW-18528029194'
  });
};

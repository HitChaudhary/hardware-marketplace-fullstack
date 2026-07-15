// Central WhatsApp business number used for price enquiries across the site.
// Format: country code + number, no spaces or symbols (matches ContactPage's +91 63538 99466).
export const WHATSAPP_NUMBER = '916353899466';

export function getWhatsappPriceLink(product) {
  const name = product?.name || 'this product';
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const message = `Hi, I'd like to know the price for: ${name}${url ? `\n${url}` : ''}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

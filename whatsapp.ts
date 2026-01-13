
import { CartItem } from './types';

const WHATSAPP_NUMBER = "919000000000"; // Replace with actual number

export const sendToWhatsApp = (cart: CartItem[], offerDetails: any) => {
  let message = `*Order Inquiry from Sudrsya Website*\n\n`;
  message += `*Hello, I want to order:*\n\n`;

  cart.forEach((item, index) => {
    message += `${index + 1}. *${item.name}*\n`;
    message += `   Code: ${item.code}\n`;
    message += `   Category: ${item.category}\n`;
    message += `   Quantity: ${item.quantity}\n`;
    message += `   Price: ₹${item.price}\n\n`;
  });

  if (offerDetails.freeItems.length > 0) {
    message += `*Offer Applied: Buy 2 Get 1 Free*\n`;
    message += `Free Item(s): ${offerDetails.freeItems.join(', ')}\n\n`;
  }

  message += `*Total Amount:* ₹${offerDetails.total}\n\n`;
  message += `Please confirm availability.`;

  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank');
};

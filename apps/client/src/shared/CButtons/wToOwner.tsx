import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

interface WhatsAppButtonProps {
  phoneNumber: string;
  listingTitle: string;
  ownerName: string;
  className?: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ phoneNumber, listingTitle, ownerName, className = '' }) => {
  const message = encodeURIComponent(`Hi ${ownerName}, I'm interested in your listing: "${listingTitle}". Can we discuss more details?`);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors ${className}`}
    >
      <FaWhatsapp className="mr-2" />
      Contact via WhatsApp
    </a>
  );
};

export default WhatsAppButton;
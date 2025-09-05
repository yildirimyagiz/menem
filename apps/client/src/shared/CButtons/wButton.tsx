import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

interface WhatsAppButtonProps {
  phoneNumber: string;
  listingTitle: string;
  ownerName: string;
  className?: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ phoneNumber, listingTitle, ownerName, className = '' }) => {
  const handleClick = async () => {
    const message = `Hi ${ownerName}, I'm interested in your listing: "${listingTitle}". Can we discuss more details?`;
    
    try {
      const response = await fetch('/api/send-whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, message }),
      });

      if (response.ok) {
        alert('Message sent successfully via WhatsApp!');
      } else {
        alert('Failed to send message via WhatsApp. Please try again later.');
      }
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      alert('An error occurred while sending the message. Please try again later.');
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors ${className}`}
    >
      <FaWhatsapp className="mr-2" />
      Contact via WhatsApp
    </button>
  );
};

export default WhatsAppButton;
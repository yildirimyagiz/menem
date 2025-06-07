import React from 'react';
import { FaTelegram } from 'react-icons/fa';

interface TelegramButtonProps {
  username: string;
  listingTitle: string;
  ownerName: string;
  className?: string;
}

const TelegramButton: React.FC<TelegramButtonProps> = ({ username, listingTitle, ownerName, className = '' }) => {
  const message = encodeURIComponent(`Hi ${ownerName}, I'm interested in your listing: "${listingTitle}". Can we discuss more details?`);
  const telegramUrl = `https://t.me/${username}?text=${message}`;

  return (
    <a
      href={telegramUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors ${className}`}
    >
      <FaTelegram className="mr-2" />
      Contact via Telegram
    </a>
  );
};

export default TelegramButton;
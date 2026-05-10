import React from 'react';

export default function WhatsAppShare({ text, url }) {
  const shareOnWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`, '_blank');
  };

  return (
    <button 
      onClick={shareOnWhatsApp}
      className="flex items-center justify-center gap-2 bg-green-500 text-white font-bold px-4 py-2 rounded-xl hover:bg-green-600 transition-colors w-full sm:w-auto"
    >
      <span>📲</span> Share on WhatsApp
    </button>
  );
}

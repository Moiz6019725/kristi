import React from "react";

const WhatsAppBTN = () => {
  const phoneNumber = "923157378892"; // Replace with your number in international format
  const message = "Hello! I want to chat with you."; // Optional default message
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-6 z-50 bg-green-600 h-15 w-15 p-2 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
    >
      <img src="/pngegg.png" alt="WhatsApp" className="h-full w-full invert" />
    </a>
  );
};

export default WhatsAppBTN;

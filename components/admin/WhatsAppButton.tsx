'use client';

import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  phone?: string | null;
  clientName?: string;
  disabled?: boolean;
}

export function WhatsAppButton({ phone, clientName, disabled }: WhatsAppButtonProps) {
  if (!phone) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed"
        title="Telefone não disponível"
      >
        <MessageCircle className="w-4 h-4" />
        <span className="text-sm">Sem telefone</span>
      </button>
    );
  }

  // Clean phone number (remove spaces, dashes, parentheses)
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  // Ensure it starts with country code (55 for Brazil)
  const phoneWithCountryCode = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
  
  // Create WhatsApp Web link
  const whatsappUrl = `https://wa.me/${phoneWithCountryCode}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-2 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      title={`Enviar mensagem para ${clientName || 'cliente'}`}
    >
      <MessageCircle className="w-4 h-4" />
      <span className="text-sm">WhatsApp</span>
    </a>
  );
}

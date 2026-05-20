import { useState, useEffect } from 'react';
import { X, Send, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const TELEGRAM_URL = 'https://t.me/Tramitesgt_bot';

export default function TelegramButton() {
  const { language } = useLanguage();
  const [showTooltip, setShowTooltip] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleOtherOpen = () => setShowTooltip(false);
    window.addEventListener('whatsapp-tooltip-opened', handleOtherOpen);
    return () => window.removeEventListener('whatsapp-tooltip-opened', handleOtherOpen);
  }, []);

  useEffect(() => {
    if (showTooltip) {
      window.dispatchEvent(new Event('telegram-tooltip-opened'));
    }
  }, [showTooltip]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTooltip(false);
    setDismissed(true);
  };

  const handleClick = () => {
    window.open(TELEGRAM_URL, '_blank', 'noopener,noreferrer');
  };

  const isEs = language === 'es';

  return (
    <div className={`fixed bottom-24 right-6 transition-all duration-300 ${showTooltip ? 'z-[60]' : 'z-50'}`}>
      {showTooltip && (
        <div className="absolute bottom-full right-0 mb-3 w-80 animate-fade-in-up">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-sky-600 to-sky-500 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .33z" />
                </svg>
                <span className="text-white font-semibold text-sm">Telegram</span>
              </div>
              <button
                onClick={handleDismiss}
                className="text-white/80 hover:text-white transition-colors p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-sky-50 p-2 rounded-full shrink-0 mt-0.5">
                  <Send className="w-4 h-4 text-sky-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 leading-snug">
                    {isEs
                      ? '¿Prefieres Telegram? Usa nuestro Bot'
                      : 'Prefer Telegram? Use our Bot'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {isEs
                      ? 'Consulta requisitos y pasos desde nuestro bot oficial de Telegram.'
                      : 'Check requirements and steps from our official Telegram bot.'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleClick}
                className="w-full bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium py-2.5 px-4 rounded-xl transition-all duration-200 hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {isEs ? 'Abrir Telegram' : 'Open Telegram'}
              </button>
            </div>
          </div>

          <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r border-b border-gray-100 transform rotate-45" />
        </div>
      )}

      <button
        onClick={() => {
          if (dismissed || showTooltip) {
            handleClick();
          } else {
            setShowTooltip(true);
          }
        }}
        className="group relative bg-sky-500 hover:bg-sky-600 text-white p-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        aria-label="Telegram"
      >
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .33z" />
        </svg>
      </button>
    </div>
  );
}

import React, { useState } from 'react';
import { Share2, Facebook, Twitter, Linkedin, Link2, Mail, MessageCircle, Check, X } from 'lucide-react';

interface SocialShareButtonProps {
  title: string;
  description?: string;
  url?: string;
  hashtags?: string[];
}

export default function SocialShareButton({
  title,
  description = '',
  url,
  hashtags = []
}: SocialShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = url || window.location.href;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const encodedHashtags = hashtags.map(tag => encodeURIComponent(tag)).join(',');

  const socialPlatforms = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:bg-blue-600',
      bgColor: 'bg-blue-600'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}${hashtags.length > 0 ? `&hashtags=${encodedHashtags}` : ''}`,
      color: 'hover:bg-sky-500',
      bgColor: 'bg-sky-500'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'hover:bg-blue-700',
      bgColor: 'bg-blue-700'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: `https://api.whatsapp.com/send?text=${encodedTitle}%0A%0A${encodedDescription ? encodedDescription + '%0A%0A' : ''}${encodedUrl}`,
      color: 'hover:bg-green-600',
      bgColor: 'bg-green-600'
    },
    {
      name: 'Email',
      icon: Mail,
      url: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
      color: 'hover:bg-gray-600',
      bgColor: 'bg-gray-600'
    }
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = (platform: typeof socialPlatforms[0]) => {
    window.open(platform.url, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  const handleNativeShare = async () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      {/* Share Button */}
      <button
        onClick={handleNativeShare}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-sm"
        title="Compartir trámite"
      >
        <Share2 className="h-4 w-4" />
        <span>Compartir</span>
      </button>

      {/* Share Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Share2 className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Compartir trámite</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-6">
              Comparte esta información con otras personas que puedan necesitarla
            </p>

            {/* Social Platforms */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-6">
              {socialPlatforms.map((platform) => {
                const Icon = platform.icon;
                return (
                  <button
                    key={platform.name}
                    onClick={() => handleShare(platform)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl hover:shadow-lg hover:scale-105 transition-all group bg-gray-50 border border-gray-200`}
                    title={`Compartir en ${platform.name}`}
                  >
                    <div className={`${platform.bgColor} text-white p-3 rounded-full group-hover:scale-110 transition-transform shadow-md`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-semibold text-gray-700">{platform.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Copy Link */}
            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm font-medium text-gray-700 mb-3">O copia el enlace directo</p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-700 overflow-hidden">
                  <p className="truncate font-mono text-xs">{shareUrl}</p>
                </div>
                <button
                  onClick={copyToClipboard}
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all shadow-sm whitespace-nowrap ${
                    copied
                      ? 'bg-green-100 text-green-700 border-2 border-green-500'
                      : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="h-5 w-5" />
                      <span>¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Link2 className="h-5 w-5" />
                      <span>Copiar enlace</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Share Stats Info */}
            <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-start gap-3">
                <Share2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">
                    Ayuda a otros ciudadanos
                  </p>
                  <p className="text-xs text-blue-700">
                    Compartir información verificada facilita el acceso de más personas a los servicios públicos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

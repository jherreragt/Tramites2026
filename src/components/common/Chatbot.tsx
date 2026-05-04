import React, { useState } from 'react';
import { MessageCircle, X, Send, User, Bot, Search, Building2, Clock, FileText } from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  message: string;
  timestamp: Date;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  relatedProcedures?: string[];
}

const faqs: FAQ[] = [
  {
    id: '1',
    question: '¿Cómo buscar un trámite?',
    answer: 'Hay varias formas: 1) Usa el buscador en la parte superior y escribe el nombre del trámite. 2) Ve a "Catálogo" y explora por categorías. 3) Usa el buscador rápido que aparece con sugerencias automáticas. 4) Navega por "Experiencias Guiadas" para trámites relacionados a un objetivo.',
    category: 'tramites',
    relatedProcedures: []
  },
  {
    id: '2',
    question: '¿Qué significa experiencia guiada?',
    answer: 'Son conjuntos de trámites organizados por objetivos. Por ejemplo, "Abrir un negocio" incluye registro de empresa, patente de comercio, inscripción SAT, etc. Te muestran el camino completo para lograr tu objetivo.',
    category: 'tramites',
    relatedProcedures: []
  },
  {
    id: '3',
    question: '¿Cómo uso el buscador con sugerencias?',
    answer: 'Al escribir verás 3 tipos de sugerencias: búsquedas recientes (si ya has usado el buscador), búsquedas populares (trámites más consultados), y palabras clave que coinciden. Navega con flechas del teclado y presiona Enter.',
    category: 'tramites',
    relatedProcedures: []
  },
  {
    id: '4',
    question: '¿Qué es el Observatorio Ciudadano?',
    answer: 'Es nuestra herramienta de análisis que evalúa eficiencia de procesos gubernamentales. Muestra estadísticas de tiempos, satisfacción ciudadana, digitalización y complejidad. Hace los procesos más transparentes.',
    category: 'observatorio'
  },
  {
    id: '5',
    question: '¿Cómo filtro por categoría?',
    answer: 'En el Catálogo, usa los filtros en la parte superior: por categorías (identidad, negocios, salud, etc.), tipo de usuario (persona/empresa), y modalidad (digital/presencial/mixto). Los filtros se actualizan en tiempo real.',
    category: 'tramites'
  },
  {
    id: '6',
    question: '¿Puedo hacer trámites aquí?',
    answer: 'No, este portal es informativo. Te damos toda la información para que llegues preparado a oficinas gubernamentales o portales oficiales. Incluimos requisitos, pasos, tiempos y enlaces directos.',
    category: 'general'
  },
  {
    id: '7',
    question: '¿Qué información tiene cada trámite?',
    answer: 'Cada trámite incluye: requisitos completos, pasos detallados, tiempos estimados, información institucional, costos, horarios, enlaces oficiales, y botón para compartir en redes sociales.',
    category: 'tramites'
  },
  {
    id: '8',
    question: '¿Cómo comparto un trámite?',
    answer: 'En cada página de trámite hay un botón "Compartir". Puedes compartir en Facebook, Twitter, LinkedIn, WhatsApp, Email, o copiar el enlace. Ayuda a otros ciudadanos compartiendo información útil.',
    category: 'general'
  }
];

const quickActions = [
  { icon: Search, label: 'Buscar trámite', action: 'search' },
  { icon: FileText, label: 'Experiencias guiadas', action: 'experiences' },
  { icon: Building2, label: 'Observatorio', action: 'observatory' },
  { icon: Clock, label: 'Usar filtros', action: 'filters' }
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      message: '¡Hola! Soy el asistente de Red Ciudadana. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre trámites, instituciones o usar las opciones rápidas.',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [showFAQs, setShowFAQs] = useState(true);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setShowFAQs(false);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        message: botResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    // Check for specific user questions
    if (input.includes('buscar') || input.includes('como busco') || input.includes('encontrar tramite')) {
      return 'Hay varias formas de buscar: 1) Usa el buscador en la parte superior y escribe el nombre del trámite. 2) Ve a "Catálogo" y explora por categorías. 3) Usa el buscador rápido con sugerencias automáticas. 4) Navega por "Experiencias Guiadas" para trámites relacionados a un objetivo. ¿Qué trámite necesitas?';
    }

    if (input.includes('experiencia guiada') || input.includes('experiencias') || input.includes('objetivo')) {
      return 'Las experiencias guiadas son conjuntos de trámites organizados por objetivos. Por ejemplo, "Abrir un negocio" incluye registro de empresa, patente de comercio, inscripción SAT, etc. Te muestran el camino completo para lograr tu objetivo. ¿Qué objetivo tienes en mente?';
    }

    if (input.includes('sugerencias') || input.includes('buscador') || input.includes('autocompletar')) {
      return 'Al escribir en el buscador verás 3 tipos de sugerencias: búsquedas recientes (si ya has usado el buscador), búsquedas populares (trámites más consultados), y palabras clave que coinciden. Navega con flechas del teclado y presiona Enter. ¿Quieres probarlo?';
    }

    if (input.includes('filtro') || input.includes('categoria') || input.includes('filtrar')) {
      return 'En el Catálogo puedes filtrar por: categorías (identidad, negocios, salud, etc.), tipo de usuario (persona/empresa), y modalidad (digital/presencial/mixto). Los filtros se actualizan en tiempo real. ¿Qué tipo de trámite buscas?';
    }

    if (input.includes('compartir') || input.includes('redes sociales') || input.includes('enviar')) {
      return 'En cada página de trámite hay un botón "Compartir". Puedes compartir en Facebook, Twitter, LinkedIn, WhatsApp, Email, o copiar el enlace. Ayuda a otros ciudadanos compartiendo información útil. ¿Te gustaría compartir algún trámite?';
    }

    if (input.includes('observatorio') || input.includes('analisis') || input.includes('estadisticas')) {
      return 'El Observatorio Ciudadano analiza la eficiencia de procesos gubernamentales. Muestra estadísticas de tiempos, satisfacción ciudadana, digitalización y complejidad. Hace los procesos más transparentes. ¿Te interesa ver el observatorio?';
    }

    if (input.includes('realizar') || input.includes('hacer tramite') || input.includes('aqui')) {
      return 'No, este portal es informativo. Te damos toda la información para que llegues preparado a oficinas gubernamentales o portales oficiales. Incluimos requisitos, pasos, tiempos y enlaces directos. ¿Qué trámite necesitas consultar?';
    }

    if (input.includes('informacion') || input.includes('que incluye') || input.includes('que tiene')) {
      return 'Cada trámite incluye: requisitos completos, pasos detallados, tiempos estimados, información institucional, costos, horarios, enlaces oficiales, y botón para compartir. Todo verificado y actualizado. ¿Quieres ver un ejemplo?';
    }

    if (input.includes('contacto') || input.includes('ayuda') || input.includes('soporte')) {
      return 'Puedes contactarnos por correo (info@redciudadana.org.gt) o visitar nuestro Centro de Ayuda con preguntas frecuentes. ¿Necesitas ayuda con algo específico?';
    }

    // Default response
    return 'Puedo ayudarte con: buscar trámites, explicar experiencias guiadas, usar el buscador con sugerencias, filtrar por categoría, compartir trámites, o consultar el observatorio. ¿Qué te gustaría saber?';
  };

  const handleFAQClick = (faq: FAQ) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: faq.question,
      timestamp: new Date()
    };

    const botMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      message: faq.answer,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, botMessage]);
    setShowFAQs(false);
  };

  const handleQuickAction = (action: string) => {
    let response = '';
    switch (action) {
      case 'search':
        response = 'Para buscar trámites: 1) Usa el buscador en la parte superior y escribe el nombre. 2) Ve a "Catálogo" para explorar por categorías. 3) Usa el buscador rápido con sugerencias automáticas. El buscador muestra búsquedas recientes, populares y palabras clave. ¿Qué trámite necesitas?';
        break;
      case 'experiences':
        response = 'Las experiencias guiadas agrupan trámites por objetivos. Por ejemplo, "Abrir un negocio" incluye todos los trámites necesarios: registro, patente, SAT, etc. Te muestran el camino completo paso a paso. Encuentra experiencias en el menú principal. ¿Qué objetivo tienes?';
        break;
      case 'observatory':
        response = 'El Observatorio analiza la eficiencia de procesos gubernamentales con estadísticas de: tiempos promedio, satisfacción ciudadana, nivel de digitalización y complejidad. Es transparencia en acción. Accede desde el menú principal. ¿Te interesa ver algún análisis?';
        break;
      case 'filters':
        response = 'En el Catálogo puedes filtrar por: 1) Categorías (identidad, negocios, salud, educación, etc.), 2) Tipo de usuario (persona física o empresa), 3) Modalidad (digital, presencial o mixto). Los resultados se actualizan en tiempo real. ¿Qué tipo de trámite buscas?';
        break;
    }

    const botMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'bot',
      message: response,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMessage]);
    setShowFAQs(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-GT', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 rounded-full shadow-xl hover:from-blue-500 hover:to-blue-400 transition-all hover:scale-110 transform"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircle className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Asistente Red Ciudadana</h3>
                  <p className="text-xs opacity-90">En línea</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`p-2 rounded-full ${message.type === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    {message.type === 'user' ? (
                      <User className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Bot className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                  <div className={`p-3 rounded-2xl ${message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                    <p className="text-sm">{message.message}</p>
                    <p className={`text-xs mt-1 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* FAQ Suggestions */}
            {showFAQs && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 font-medium">Preguntas frecuentes:</p>
                <div className="grid gap-2">
                  {faqs.slice(0, 4).map((faq) => (
                    <button
                      key={faq.id}
                      onClick={() => handleFAQClick(faq)}
                      className="text-left p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-xs text-blue-800"
                    >
                      {faq.question}
                    </button>
                  ))}
                </div>

                <p className="text-sm text-gray-600 font-medium mt-4">Acciones rápidas:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, index) => {
                    const IconComponent = action.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => handleQuickAction(action.action)}
                        className="flex items-center space-x-1 p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-xs text-gray-700"
                      >
                        <IconComponent className="h-4 w-4" />
                        <span>{action.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Pregúntame sobre Red Ciudadana..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <div className="flex justify-between items-center mt-2">
              <button
                onClick={() => setShowFAQs(true)}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                Ver preguntas frecuentes
              </button>
              <p className="text-xs text-gray-500">
                Presiona Enter para enviar
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
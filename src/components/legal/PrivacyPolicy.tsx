import React from 'react';
import { Shield, Eye, Lock, Database, Users, AlertTriangle, CheckCircle, Scale, Globe, Mail, Phone } from 'lucide-react';

export default function PrivacyPolicy() {
  const lastUpdated = "1 de enero de 2025";

  const sections = [
    {
      id: "introduction",
      title: "1. Introducción",
      icon: Shield,
      content: [
        "Red Ciudadana respeta su privacidad y se compromete a proteger sus datos personales.",
        "Esta Política de Privacidad explica cómo recopilamos, utilizamos, almacenamos y protegemos su información personal.",
        "Al utilizar nuestros servicios, usted acepta las prácticas descritas en esta política.",
        "Cumplimos con las leyes guatemaltecas de protección de datos y las mejores prácticas internacionales."
      ]
    },
    {
      id: "information-collected",
      title: "2. Información que Recopilamos",
      icon: Database,
      content: [
        "Información de identificación personal: nombre, correo electrónico, número de teléfono cuando nos contacta voluntariamente.",
        "Información de uso: páginas visitadas, tiempo de permanencia, acciones realizadas en el portal.",
        "Información técnica: dirección IP, tipo de navegador, sistema operativo, dispositivo utilizado.",
        "Cookies y tecnologías similares para mejorar la experiencia del usuario y analizar el uso del sitio.",
        "Información proporcionada en formularios de contacto, comentarios o solicitudes de información."
      ]
    },
    {
      id: "how-we-use",
      title: "3. Cómo Utilizamos su Información",
      icon: Eye,
      content: [
        "Proporcionar y mejorar nuestros servicios de información ciudadana.",
        "Responder a sus consultas y solicitudes de información.",
        "Enviar actualizaciones importantes sobre cambios en trámites o servicios (solo si se suscribe).",
        "Analizar el uso del portal para mejorar la experiencia del usuario.",
        "Generar estadísticas agregadas y anónimas para informes de impacto.",
        "Cumplir con obligaciones legales y proteger nuestros derechos legítimos."
      ]
    },
    {
      id: "information-sharing",
      title: "4. Compartir Información",
      icon: Users,
      content: [
        "No vendemos, alquilamos o comercializamos su información personal con terceros.",
        "Podemos compartir información agregada y anónima para fines de investigación o transparencia.",
        "Compartimos información solo cuando es requerido por ley o autoridad competente.",
        "Podemos compartir información con proveedores de servicios que nos ayudan a operar el portal (bajo estrictos acuerdos de confidencialidad).",
        "En caso de fusión o adquisición, la información podría transferirse bajo las mismas protecciones."
      ]
    },
    {
      id: "data-security",
      title: "5. Seguridad de los Datos",
      icon: Lock,
      content: [
        "Implementamos medidas técnicas y organizativas apropiadas para proteger su información.",
        "Utilizamos encriptación SSL/TLS para proteger la transmisión de datos.",
        "Acceso restringido a información personal solo para personal autorizado.",
        "Copias de seguridad regulares y sistemas de recuperación ante desastres.",
        "Monitoreo continuo de seguridad y actualizaciones de sistemas.",
        "Aunque tomamos todas las precauciones, ningún sistema es 100% seguro."
      ]
    },
    {
      id: "cookies",
      title: "6. Cookies y Tecnologías de Seguimiento",
      icon: Globe,
      content: [
        "Utilizamos cookies esenciales para el funcionamiento básico del sitio web.",
        "Cookies analíticas para entender cómo los usuarios interactúan con nuestro portal.",
        "Cookies de preferencias para recordar sus configuraciones y mejorar su experiencia.",
        "Puede configurar su navegador para rechazar cookies, aunque esto puede afectar la funcionalidad.",
        "No utilizamos cookies para publicidad dirigida o seguimiento comercial."
      ]
    },
    {
      id: "user-rights",
      title: "7. Sus Derechos",
      icon: CheckCircle,
      content: [
        "Derecho de acceso: puede solicitar información sobre los datos que tenemos sobre usted.",
        "Derecho de rectificación: puede solicitar la corrección de información inexacta.",
        "Derecho de eliminación: puede solicitar la eliminación de sus datos personales.",
        "Derecho de portabilidad: puede solicitar una copia de sus datos en formato estructurado.",
        "Derecho de oposición: puede oponerse al procesamiento de sus datos para ciertos fines.",
        "Para ejercer estos derechos, contáctenos a través de los medios proporcionados al final."
      ]
    },
    {
      id: "data-retention",
      title: "8. Retención de Datos",
      icon: Database,
      content: [
        "Conservamos su información personal solo durante el tiempo necesario para los fines establecidos.",
        "Información de contacto: hasta que solicite su eliminación o retire su consentimiento.",
        "Datos de uso y analíticos: generalmente por un período de 2 años.",
        "Información requerida por ley: según los plazos establecidos por la legislación aplicable.",
        "Cuando eliminamos datos, lo hacemos de manera segura e irreversible."
      ]
    },
    {
      id: "minors",
      title: "9. Menores de Edad",
      icon: Users,
      content: [
        "Nuestros servicios están dirigidos a personas mayores de 13 años.",
        "No recopilamos intencionalmente información personal de menores de 13 años.",
        "Si descubrimos que hemos recopilado información de un menor, la eliminaremos inmediatamente.",
        "Los padres o tutores pueden contactarnos si creen que hemos recopilado información de un menor.",
        "Recomendamos supervisión parental para el uso de internet por parte de menores."
      ]
    },
    {
      id: "changes",
      title: "10. Cambios a esta Política",
      icon: AlertTriangle,
      content: [
        "Podemos actualizar esta Política de Privacidad ocasionalmente para reflejar cambios en nuestras prácticas.",
        "Los cambios significativos serán notificados a través del portal web.",
        "La fecha de la última actualización siempre aparecerá al inicio de esta política.",
        "Le recomendamos revisar esta política periódicamente.",
        "El uso continuado de nuestros servicios después de cambios constituye aceptación de la nueva política."
      ]
    }
  ];

  const dataTypes = [
    {
      type: "Información Personal",
      description: "Nombre, email, teléfono",
      purpose: "Contacto y comunicación",
      retention: "Hasta solicitud de eliminación"
    },
    {
      type: "Datos de Uso",
      description: "Páginas visitadas, tiempo en sitio",
      purpose: "Mejora de servicios",
      retention: "2 años"
    },
    {
      type: "Información Técnica",
      description: "IP, navegador, dispositivo",
      purpose: "Seguridad y análisis",
      retention: "1 año"
    },
    {
      type: "Cookies",
      description: "Preferencias y configuración",
      purpose: "Experiencia personalizada",
      retention: "Según configuración"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Política de Privacidad
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-4">
            Cómo Red Ciudadana protege y maneja su información personal
          </p>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Última actualización:</strong> {lastUpdated}
            </p>
          </div>
        </div>

        {/* Data Summary Table */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
            <Database className="h-5 w-5 text-blue-600" />
            <span>Resumen de Datos que Manejamos</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Tipo de Información</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Descripción</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Propósito</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Retención</th>
                </tr>
              </thead>
              <tbody>
                {dataTypes.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-900">{item.type}</td>
                    <td className="py-3 px-4 text-gray-600">{item.description}</td>
                    <td className="py-3 px-4 text-gray-600">{item.purpose}</td>
                    <td className="py-3 px-4 text-gray-600">{item.retention}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Privacy Sections */}
        <div className="space-y-8">
          {sections.map((section) => {
            const IconComponent = section.icon;
            return (
              <div key={section.id} className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <IconComponent className="h-5 w-5 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                  </div>
                  <div className="space-y-4">
                    {section.content.map((paragraph, index) => (
                      <p key={index} className="text-gray-700 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Your Rights Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-blue-50 rounded-xl p-8 border border-blue-200">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <CheckCircle className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">Ejercer sus Derechos</h3>
            </div>
            <p className="text-gray-700 mb-6">
              Puede ejercer sus derechos de privacidad contactándonos a través de cualquiera de estos medios:
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-white p-4 rounded-xl mb-3 shadow-sm">
                <Mail className="h-6 w-6 text-blue-600 mx-auto" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Correo Electrónico</h4>
              <p className="text-sm text-gray-600 mb-3">privacidad@redciudadana.org.gt</p>
              <a
                href="mailto:privacidad@redciudadana.org.gt"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Enviar correo
              </a>
            </div>
            <div className="text-center">
              <div className="bg-white p-4 rounded-xl mb-3 shadow-sm">
                <Phone className="h-6 w-6 text-blue-600 mx-auto" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Teléfono</h4>
              <p className="text-sm text-gray-600 mb-3">+502 2440-0000</p>
              <a
                href="tel:+50224400000"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Llamar ahora
              </a>
            </div>
            <div className="text-center">
              <div className="bg-white p-4 rounded-xl mb-3 shadow-sm">
                <Globe className="h-6 w-6 text-blue-600 mx-auto" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Formulario Web</h4>
              <p className="text-sm text-gray-600 mb-3">Portal de contacto</p>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Ir al formulario
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            © 2025 Red Ciudadana Guatemala. Comprometidos con la protección de su privacidad.
          </p>
        </div>
      </div>
    </div>
  );
}
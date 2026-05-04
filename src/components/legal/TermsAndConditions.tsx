import React from 'react';
import { FileText, Shield, Users, AlertCircle, CheckCircle, Scale, Globe, Mail, Phone } from 'lucide-react';

export default function TermsAndConditions() {
  const lastUpdated = "1 de enero de 2025";

  const sections = [
    {
      id: "acceptance",
      title: "1. Aceptación de los Términos",
      icon: CheckCircle,
      content: [
        "Al acceder y utilizar el portal de información ciudadana de Red Ciudadana, usted acepta estar sujeto a estos Términos y Condiciones de uso.",
        "Si no está de acuerdo con alguno de estos términos, le pedimos que no utilice nuestros servicios.",
        "Red Ciudadana se reserva el derecho de modificar estos términos en cualquier momento, notificando a los usuarios a través del portal."
      ]
    },
    {
      id: "description",
      title: "2. Descripción del Servicio",
      icon: Globe,
      content: [
        "Red Ciudadana es una organización de sociedad civil que proporciona información verificada sobre trámites gubernamentales en Guatemala.",
        "Nuestro portal es únicamente informativo y no constituye un servicio oficial del gobierno guatemalteco.",
        "La información se recopila, verifica y actualiza constantemente por nuestro equipo de investigación ciudadana.",
        "No realizamos trámites por los usuarios; proporcionamos la información necesaria para que los ciudadanos puedan realizarlos por sí mismos."
      ]
    },
    {
      id: "user-responsibilities",
      title: "3. Responsabilidades del Usuario",
      icon: Users,
      content: [
        "Los usuarios se comprometen a utilizar el portal de manera responsable y conforme a la ley.",
        "No está permitido usar la información para fines comerciales sin autorización previa de Red Ciudadana.",
        "Los usuarios deben verificar la información en fuentes oficiales antes de realizar cualquier trámite.",
        "Está prohibido intentar acceder a áreas restringidas del sistema o interferir con su funcionamiento.",
        "Los usuarios son responsables de mantener la confidencialidad de sus credenciales de acceso."
      ]
    },
    {
      id: "information-accuracy",
      title: "4. Precisión de la Información",
      icon: Shield,
      content: [
        "Red Ciudadana se esfuerza por mantener información precisa y actualizada, pero no garantiza la exactitud absoluta de todos los datos.",
        "La información puede cambiar sin previo aviso por parte de las instituciones gubernamentales.",
        "Los usuarios deben confirmar los requisitos y procedimientos en las fuentes oficiales correspondientes.",
        "Red Ciudadana no se hace responsable por decisiones tomadas basándose únicamente en la información del portal."
      ]
    },
    {
      id: "intellectual-property",
      title: "5. Propiedad Intelectual",
      icon: FileText,
      content: [
        "Todo el contenido del portal, incluyendo textos, gráficos, logos, y software, es propiedad de Red Ciudadana o sus licenciantes.",
        "Los usuarios pueden utilizar la información para fines personales y no comerciales.",
        "Está permitido compartir enlaces al portal y citar la información con la debida atribución a Red Ciudadana.",
        "No está permitida la reproducción masiva o redistribución comercial del contenido sin autorización."
      ]
    },
    {
      id: "limitations",
      title: "6. Limitaciones de Responsabilidad",
      icon: AlertCircle,
      content: [
        "Red Ciudadana no será responsable por daños directos, indirectos, incidentales o consecuentes derivados del uso del portal.",
        "No garantizamos la disponibilidad continua del servicio ni la ausencia de errores técnicos.",
        "Los usuarios utilizan el portal bajo su propio riesgo y responsabilidad.",
        "Red Ciudadana no se hace responsable por el contenido de sitios web externos enlazados desde nuestro portal."
      ]
    },
    {
      id: "privacy",
      title: "7. Privacidad y Protección de Datos",
      icon: Shield,
      content: [
        "Red Ciudadana respeta la privacidad de sus usuarios y cumple con las leyes aplicables de protección de datos.",
        "Para información detallada sobre el manejo de datos personales, consulte nuestra Política de Privacidad.",
        "No vendemos, alquilamos o compartimos información personal con terceros para fines comerciales.",
        "Los usuarios tienen derecho a acceder, rectificar y eliminar sus datos personales."
      ]
    },
    {
      id: "modifications",
      title: "8. Modificaciones del Servicio",
      icon: Globe,
      content: [
        "Red Ciudadana se reserva el derecho de modificar, suspender o discontinuar cualquier aspecto del portal en cualquier momento.",
        "Las mejoras y actualizaciones se realizan para beneficio de los usuarios y la comunidad.",
        "Los cambios significativos serán comunicados a través del portal y nuestros canales oficiales.",
        "Los usuarios serán notificados con anticipación razonable sobre cambios que afecten significativamente el servicio."
      ]
    },
    {
      id: "applicable-law",
      title: "9. Ley Aplicable y Jurisdicción",
      icon: Scale,
      content: [
        "Estos términos se rigen por las leyes de la República de Guatemala.",
        "Cualquier disputa relacionada con el uso del portal será resuelta en los tribunales competentes de Guatemala.",
        "Red Ciudadana y los usuarios se someten a la jurisdicción de los tribunales guatemaltecos.",
        "En caso de conflicto entre estos términos y la ley aplicable, prevalecerá la ley."
      ]
    },
    {
      id: "contact",
      title: "10. Contacto",
      icon: Mail,
      content: [
        "Para preguntas sobre estos Términos y Condiciones, puede contactarnos:",
        "• Correo electrónico: legal@redciudadana.org.gt",
        "• Teléfono: +502 2440-0000",
        "• Dirección: Zona 1, Ciudad de Guatemala",
        "• Horario de atención: Lunes a Viernes, 8:00 AM - 5:00 PM"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Scale className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Términos y Condiciones
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-4">
            Términos y condiciones de uso del portal de información ciudadana de Red Ciudadana
          </p>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Última actualización:</strong> {lastUpdated}
            </p>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8 border border-gray-100">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 p-3 rounded-xl flex-shrink-0">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Introducción</h2>
              <p className="text-gray-700 leading-relaxed">
                Bienvenido al portal de información ciudadana de Red Ciudadana. Estos Términos y Condiciones 
                establecen las reglas y regulaciones para el uso de nuestro sitio web y servicios. Red Ciudadana 
                es una organización de sociedad civil comprometida con la transparencia y el acceso a la información 
                pública en Guatemala.
              </p>
            </div>
          </div>
        </div>

        {/* Terms Sections */}
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

        {/* Footer Notice */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-8 border border-blue-200">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <AlertCircle className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-blue-900">Aviso Importante</h3>
            </div>
            <p className="text-blue-800 mb-6">
              Al continuar utilizando nuestros servicios, usted confirma que ha leído, entendido y 
              acepta estos Términos y Condiciones en su totalidad.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:legal@redciudadana.org.gt"
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Mail className="h-4 w-4" />
                <span>Contactar Legal</span>
              </a>
              <a
                href="tel:+50224400000"
                className="inline-flex items-center space-x-2 border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-600 hover:text-white transition-colors font-medium"
              >
                <Phone className="h-4 w-4" />
                <span>Llamar</span>
              </a>
            </div>
          </div>
        </div>

        {/* Red Ciudadana Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            © 2025 Red Ciudadana Guatemala. Organización de sociedad civil comprometida con la transparencia.
          </p>
        </div>
      </div>
    </div>
  );
}
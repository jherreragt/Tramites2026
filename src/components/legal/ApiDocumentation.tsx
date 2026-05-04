import React from 'react';
import { 
  Code2, 
  Globe, 
  Database, 
  Terminal, 
  Copy, 
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import Breadcrumb from '../common/Breadcrumb';

export default function ApiDocumentation() {
  const [copied, setCopied] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const baseUrl = window.location.origin;

  const endpoints = [
    {
      method: 'GET',
      path: '/api/procedures',
      description: 'Obtiene el listado completo de trámites disponibles.',
      example: `${baseUrl}/api/procedures`
    },
    {
      method: 'GET',
      path: '/api/procedures?id={uuid}',
      description: 'Obtiene la información detallada de un trámite específico mediante su ID.',
      example: `${baseUrl}/api/procedures?id=123`
    },
    {
      method: 'GET',
      path: '/api/institutions',
      description: 'Obtiene el listado de todas las instituciones gubernamentales registradas.',
      example: `${baseUrl}/api/institutions`
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Breadcrumb variant="white" items={[{ label: 'API para Desarrolladores' }]} />
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/20">
              <Code2 className="w-12 h-12 text-blue-300" />
            </div>
            <div>
              <h1 className="text-4xl font-black mb-2 tracking-tight">API de Trámites GT</h1>
              <p className="text-blue-100 text-lg max-w-2xl opacity-90">
                Punto de acceso abierto para que desarrolladores y organizaciones puedan integrar la información de trámites en sus propias plataformas.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Start */}
            <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <Zap className="w-6 h-6 text-yellow-500" />
                Inicio Rápido
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Nuestra API es de acceso público y utiliza el formato **JSON** para todas las respuestas. No requiere autenticación para las consultas de lectura, facilitando la transparencia y el acceso a la información.
              </p>
              
              <div className="bg-gray-900 rounded-2xl p-6 relative group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(`fetch('${baseUrl}/api/procedures')\n  .then(res => res.json())\n  .then(data => console.log(data));`, 'js-example')}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {copied === 'js-example' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <pre className="text-blue-300 font-mono text-sm overflow-x-auto">
                  <code>{`fetch('${baseUrl}/api/procedures')
  .then(res => res.json())
  .then(data => console.log(data));`}</code>
                </pre>
              </div>
            </section>

            {/* Endpoints */}
            <section className="space-y-6">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <Terminal className="w-6 h-6 text-blue-600" />
                Endpoints Disponibles
              </h2>
              
              <div className="space-y-4">
                {endpoints.map((endpoint, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-green-100 text-green-700 font-black text-xs rounded-lg tracking-widest">
                          {endpoint.method}
                        </span>
                        <code className="text-blue-600 font-bold">{endpoint.path}</code>
                      </div>
                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                        {endpoint.description}
                      </p>
                      <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between group">
                        <code className="text-xs text-gray-500 truncate mr-4">
                          {endpoint.example}
                        </code>
                        <button 
                          onClick={() => copyToClipboard(endpoint.example, `endpoint-${index}`)}
                          className="flex-shrink-0 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          {copied === `endpoint-${index}` ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-indigo-900 rounded-3xl p-8 text-white shadow-xl">
              <ShieldCheck className="w-10 h-10 text-indigo-300 mb-6" />
              <h3 className="text-xl font-black mb-4">Uso Responsable</h3>
              <ul className="space-y-4 text-sm text-indigo-100 opacity-90">
                <li className="flex gap-3">
                  <ArrowRight className="w-4 h-4 text-indigo-300 flex-shrink-0 mt-0.5" />
                  No exceder los 100 llamados por minuto por IP.
                </li>
                <li className="flex gap-3">
                  <ArrowRight className="w-4 h-4 text-indigo-300 flex-shrink-0 mt-0.5" />
                  Incluir la atribución a "Red Ciudadana" en su aplicación.
                </li>
                <li className="flex gap-3">
                  <ArrowRight className="w-4 h-4 text-indigo-300 flex-shrink-0 mt-0.5" />
                  La información es pública bajo licencia Open Data.
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <Database className="w-10 h-10 text-blue-600 mb-6" />
              <h3 className="text-xl font-black text-gray-900 mb-4">Formato de Datos</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                Todos los datos se entregan en formato UTF-8 JSON. Los campos de fecha siguen el estándar ISO 8601.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <Globe className="w-4 h-4" />
                  Headers Soportados
                </div>
                <code className="block p-3 bg-gray-50 rounded-lg text-xs text-blue-700">
                  Content-Type: application/json
                  <br />
                  Access-Control-Allow-Origin: *
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

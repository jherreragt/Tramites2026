import { FileSpreadsheet, Database, Code, Layers, Monitor, ArrowRight, ArrowDown } from 'lucide-react';

const steps = [
  {
    icon: FileSpreadsheet,
    color: 'bg-emerald-100 text-emerald-600',
    border: 'border-emerald-200',
    label: 'Archivos CSV',
    sublabel: 'Datos originales',
    description: 'Hojas de calculo con datos recopilados por Red Ciudadana',
  },
  {
    icon: Code,
    color: 'bg-amber-100 text-amber-600',
    border: 'border-amber-200',
    label: 'Transformacion',
    sublabel: 'TypeScript / JSON',
    description: 'Los CSV se convierten a archivos .ts y .json estructurados',
  },
  {
    icon: Database,
    color: 'bg-blue-100 text-blue-600',
    border: 'border-blue-200',
    label: 'Capa de Datos',
    sublabel: 'Servicios & Hooks',
    description: 'Funciones de servicio y hooks de React consultan y filtran los datos',
  },
  {
    icon: Layers,
    color: 'bg-rose-100 text-rose-600',
    border: 'border-rose-200',
    label: 'Componentes',
    sublabel: 'React UI',
    description: 'Componentes visuales renderizan la informacion al usuario',
  },
  {
    icon: Monitor,
    color: 'bg-gray-100 text-gray-600',
    border: 'border-gray-200',
    label: 'Navegador',
    sublabel: 'Experiencia final',
    description: 'El ciudadano consulta tramites, instituciones y el observatorio',
  },
];

export default function DataFlowDiagram() {
  return (
    <div>
      <div className="hidden lg:flex items-start justify-between gap-2">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={i} className="flex items-center flex-1">
              <div className={`flex flex-col items-center text-center p-4 rounded-xl border ${step.border} bg-white flex-1 min-w-0`}>
                <div className={`p-3 rounded-xl ${step.color} mb-3`}>
                  <Icon className="w-6 h-6" />
                </div>
                <p className="font-semibold text-gray-900 text-sm">{step.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{step.sublabel}</p>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">{step.description}</p>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight className="w-5 h-5 text-gray-300 shrink-0 mx-1" />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex lg:hidden flex-col items-center gap-2">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={i} className="flex flex-col items-center w-full">
              <div className={`flex items-center gap-4 p-4 rounded-xl border ${step.border} bg-white w-full`}>
                <div className={`p-3 rounded-xl ${step.color} shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{step.label}</p>
                  <p className="text-xs text-gray-500">{step.sublabel}</p>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">{step.description}</p>
                </div>
              </div>
              {i < steps.length - 1 && (
                <ArrowDown className="w-5 h-5 text-gray-300 my-1" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface AcronymTooltipProps {
  acronym: string;
  children?: React.ReactNode;
  className?: string;
  inline?: boolean;
}

const acronymDefinitions: Record<string, { full: string; description: string }> = {
  'DPI': {
    full: 'Documento Personal de Identificación',
    description: 'Documento oficial de identidad emitido por RENAP que identifica a los ciudadanos guatemaltecos mayores de edad.'
  },
  'RENAP': {
    full: 'Registro Nacional de las Personas',
    description: 'Institución encargada del registro civil y emisión del DPI en Guatemala.'
  },
  'SAT': {
    full: 'Superintendencia de Administración Tributaria',
    description: 'Entidad encargada de la recaudación de impuestos y administración tributaria en Guatemala.'
  },
  'NIT': {
    full: 'Número de Identificación Tributaria',
    description: 'Número único asignado por la SAT para identificar a contribuyentes fiscales.'
  },
  'RTU': {
    full: 'Registro Tributario Unificado',
    description: 'Sistema de inscripción y actualización de datos de contribuyentes en la SAT.'
  },
  'IGSS': {
    full: 'Instituto Guatemalteco de Seguridad Social',
    description: 'Institución que administra el sistema de seguridad social en Guatemala.'
  },
  'IGN': {
    full: 'Instituto Geográfico Nacional',
    description: 'Institución encargada de la cartografía y catastro de Guatemala.'
  },
  'RNC': {
    full: 'Registro Nacional de Catastro',
    description: 'Sistema de registro de propiedades y bienes inmuebles.'
  },
  'MSPAS': {
    full: 'Ministerio de Salud Pública y Asistencia Social',
    description: 'Ministerio encargado de la salud pública en Guatemala.'
  },
  'MINEDUC': {
    full: 'Ministerio de Educación',
    description: 'Ministerio responsable de la educación pública en Guatemala.'
  },
  'MINECO': {
    full: 'Ministerio de Economía',
    description: 'Ministerio encargado del desarrollo económico y comercial.'
  },
  'MAGA': {
    full: 'Ministerio de Agricultura, Ganadería y Alimentación',
    description: 'Ministerio responsable del sector agropecuario y alimentario.'
  },
  'MEM': {
    full: 'Ministerio de Energía y Minas',
    description: 'Ministerio encargado del sector energético y minero.'
  },
  'TSE': {
    full: 'Tribunal Supremo Electoral',
    description: 'Órgano encargado de los procesos electorales en Guatemala.'
  },
  'MP': {
    full: 'Ministerio Público',
    description: 'Institución encargada de la investigación criminal y acusación penal.'
  },
  'OJ': {
    full: 'Organismo Judicial',
    description: 'Poder judicial de Guatemala, responsable de impartir justicia.'
  },
  'PNC': {
    full: 'Policía Nacional Civil',
    description: 'Fuerza de seguridad pública de Guatemala.'
  },
  'DIGEF': {
    full: 'Dirección General de Educación Física',
    description: 'Dirección encargada de la educación física en el sistema educativo.'
  },
  'ISBN': {
    full: 'International Standard Book Number',
    description: 'Número internacional normalizado del libro.'
  },
  'ISSN': {
    full: 'International Standard Serial Number',
    description: 'Número internacional normalizado de publicaciones seriadas.'
  }
};

export default function AcronymTooltip({
  acronym,
  children,
  className = '',
  inline = true
}: AcronymTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const definition = acronymDefinitions[acronym.toUpperCase()];

  if (!definition) {
    return <span className={className}>{children || acronym}</span>;
  }

  if (inline) {
    return (
      <span className={`relative inline-flex items-center gap-1 ${className}`}>
        <span className="font-medium">{children || acronym}</span>
        <button
          type="button"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onFocus={() => setShowTooltip(true)}
          onBlur={() => setShowTooltip(false)}
          className="inline-flex items-center justify-center text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded-full transition-colors"
          aria-label={`Información sobre ${acronym}`}
        >
          <Info className="h-3.5 w-3.5" />
        </button>
        {showTooltip && (
          <div className="absolute left-0 bottom-full mb-2 w-72 bg-gray-900 text-white text-xs rounded-lg shadow-xl p-3 z-50 pointer-events-none">
            <div className="font-semibold mb-1">{definition.full}</div>
            <div className="text-gray-300">{definition.description}</div>
            <div className="absolute left-4 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        )}
      </span>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="font-medium">{children || acronym}</span>
      <button
        type="button"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        className="relative inline-flex items-center justify-center text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded-full transition-colors"
        aria-label={`Información sobre ${acronym}`}
      >
        <Info className="h-4 w-4" />
        {showTooltip && (
          <div className="absolute left-0 bottom-full mb-2 w-72 bg-gray-900 text-white text-sm rounded-lg shadow-xl p-4 z-50 pointer-events-none">
            <div className="font-semibold mb-2">{definition.full}</div>
            <div className="text-gray-300">{definition.description}</div>
            <div className="absolute left-4 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        )}
      </button>
    </div>
  );
}

export function AcronymText({ text, className = '' }: { text: string; className?: string }) {
  const acronyms = Object.keys(acronymDefinitions);
  const regex = new RegExp(`\\b(${acronyms.join('|')})\\b`, 'gi');

  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        const upperPart = part.toUpperCase();
        if (acronyms.includes(upperPart)) {
          return (
            <AcronymTooltip key={index} acronym={upperPart}>
              {part}
            </AcronymTooltip>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}

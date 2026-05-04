import { type LucideIcon } from 'lucide-react';

interface DataSourceCardProps {
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  title: string;
  subtitle: string;
  file: string;
  format: string;
  fields: string[];
  recordCount: number;
  description: string;
}

export default function DataSourceCard({
  icon: Icon,
  iconColor,
  iconBg,
  title,
  subtitle,
  file,
  format,
  fields,
  recordCount,
  description,
}: DataSourceCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className={`p-3 rounded-xl ${iconBg} shrink-0`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">{description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
            {format}
          </span>
          <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-md">
            {recordCount} registros
          </span>
        </div>
      </div>

      <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Archivo fuente</p>
        <code className="text-xs text-gray-700 bg-white px-2.5 py-1 rounded-md border border-gray-200 inline-block mb-3">
          {file}
        </code>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 mt-2">Campos principales</p>
        <div className="flex flex-wrap gap-1.5">
          {fields.map((field) => (
            <span
              key={field}
              className="inline-block px-2 py-0.5 bg-white border border-gray-200 rounded text-xs text-gray-600"
            >
              {field}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

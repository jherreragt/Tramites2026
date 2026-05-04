import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Target,
  ArrowRight,
  Clock,
  FileText,
  Sprout,
  Globe,
  Leaf,
  Pill,
  Dna,
  Microscope,
  Package,
  FlaskConical,
  Store,
  Briefcase,
  Plane,
  Users,
  Home,
  GraduationCap,
  Award,
  Building2
} from 'lucide-react';
import { useExperiences } from '../../hooks/useExperiences';
import { useProcedures } from '../../hooks/useProcedures';
import loader from '../../assets/loader.gif';

const iconMap: Record<string, React.ElementType> = {
  Sprout,
  Globe,
  Leaf,
  Pill,
  Dna,
  Microscope,
  Package,
  FlaskConical,
  Target,
  Store,
  Briefcase,
  Plane,
  Users,
  Home,
  GraduationCap,
  Award,
  Building2
};

const colorMap: Record<string, { icon: string; bg: string }> = {
  'from-blue-500 to-blue-700': { icon: 'text-blue-600', bg: 'bg-blue-50' },
  'from-emerald-500 to-emerald-700': { icon: 'text-emerald-600', bg: 'bg-emerald-50' },
  'from-indigo-500 to-indigo-700': { icon: 'text-indigo-600', bg: 'bg-indigo-50' },
  'from-cyan-500 to-cyan-700': { icon: 'text-cyan-600', bg: 'bg-cyan-50' },
  'from-orange-500 to-orange-700': { icon: 'text-orange-600', bg: 'bg-orange-50' },
  'from-rose-500 to-rose-700': { icon: 'text-rose-600', bg: 'bg-rose-50' },
  'from-amber-500 to-amber-700': { icon: 'text-amber-600', bg: 'bg-amber-50' }
};

export default function ExperiencesSection() {
  const { experiences, loading: experiencesLoading } = useExperiences();
  const { procedures, loading: proceduresLoading } = useProcedures();

  const featuredExperiences = useMemo(() => {
    if (!experiences.length || !procedures.length) return [];

    return experiences.slice(0, 3).map(exp => {
      const procedureCount = procedures.filter(proc =>
        exp.ids_procedures.includes(proc.id.toString())
      ).length;

      const colors = colorMap[exp.color] || { icon: 'text-blue-600', bg: 'bg-blue-50' };

      return {
        id: exp.id,
        nombre: exp.nombre,
        descripcion: exp.descripcion,
        icon: iconMap[exp.icon] || Target,
        color: colors.icon,
        bgColor: colors.bg,
        hoverColor: 'hover:border-blue-500',
        proceduresCount: procedureCount,
        estimatedTime: exp.duracion_estimada,
        categoria: exp.categoria
      };
    });
  }, [experiences, procedures]);

  if (experiencesLoading || proceduresLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <img src={loader} alt="Cargando..." className="h-16 w-16 mx-auto mb-4" />
            <p className="text-gray-600">Cargando experiencias...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!featuredExperiences.length) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Target className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Experiencias Guiadas
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Descubre todos los trámites necesarios para alcanzar tus metas específicas
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {featuredExperiences.map((experience) => {
            const Icon = experience.icon;

            return (
              <div
                key={experience.id}
                className={`bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group border-2 border-transparent ${experience.hoverColor}`}
              >
                <div className={`${experience.bgColor} p-6`}>
                  <Icon className={`w-12 h-12 ${experience.color} mb-4 group-hover:scale-110 transition-transform`} />
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {experience.nombre}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {experience.descripcion}
                  </p>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      {experience.proceduresCount} trámite{experience.proceduresCount !== 1 ? 's' : ''}
                    </span>
                    <span className="text-xs px-3 py-1 rounded-full font-semibold bg-blue-100 text-blue-800">
                      {experience.categoria}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{experience.estimatedTime}</span>
                  </div>

                  <Link
                    to="/experiencias"
                    className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all group-hover:gap-3 mt-4"
                  >
                    Ver detalles
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            to="/experiencias"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:gap-3 text-lg"
          >
            Ver todas las experiencias
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </section>
  );
}

import React, { useMemo, useState, useEffect } from 'react';
import { useProcedures } from '../hooks/useProcedures';
import { useInstitutions } from '../hooks/useInstitutions';
import { observatoryService } from '../lib/data';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  FileText, Building2, Layers, CheckCircle2, Clock, 
  TrendingUp, BarChart3, PieChart as PieChartIcon, Users
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

const StatisticsPage: React.FC = () => {
  const { procedures, loading: procLoading } = useProcedures();
  const { institutions, loading: instLoading } = useInstitutions();
  const [observatoryData, setObservatoryData] = useState<any[]>([]);
  const [obsLoading, setObsLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchObs = async () => {
      const data = await observatoryService.getAll();
      setObservatoryData(data);
      setObsLoading(false);
    };
    fetchObs();
  }, []);

  const stats = useMemo(() => {
    if (procLoading || instLoading || obsLoading) return null;

    // Category data
    const categoryCounts: { [key: string]: number } = {};
    procedures.forEach(p => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });
    const categoryData = Object.entries(categoryCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Digitalization data
    const digitalCount = procedures.filter(p => p.is_digital).length;
    const digitalizationData = [
      { name: t('statisticsPage.digital'), value: digitalCount },
      { name: t('statisticsPage.inPerson'), value: procedures.length - digitalCount }
    ];

    // User Type data
    const userTypeCounts: { [key: string]: number } = {};
    procedures.forEach(p => {
      const type = p.user_type || 'General';
      userTypeCounts[type] = (userTypeCounts[type] || 0) + 1;
    });
    const userTypeData = Object.entries(userTypeCounts)
      .map(([name, value]) => ({ name, value }));

    // Complexity data (Average requirements per category)
    const categoryComplexity: { [key: string]: { total: number, count: number } } = {};
    procedures.forEach(p => {
      const reqs = Array.isArray(p.requirements) ? p.requirements.length : 0;
      if (!categoryComplexity[p.category]) {
        categoryComplexity[p.category] = { total: 0, count: 0 };
      }
      categoryComplexity[p.category].total += reqs;
      categoryComplexity[p.category].count += 1;
    });
    const complexityData = Object.entries(categoryComplexity)
      .map(([name, data]) => ({ 
        name, 
        value: parseFloat((data.total / data.count).toFixed(1)) 
      }))
      .sort((a, b) => b.value - a.value);

    // Average steps and requirements for cards
    let totalSteps = 0;
    let totalReqs = 0;
    procedures.forEach(p => {
      const steps = Array.isArray(p.steps) ? p.steps.length : 0;
      const reqs = Array.isArray(p.requirements) ? p.requirements.length : 0;
      totalSteps += steps;
      totalReqs += reqs;
    });

    const avgSteps = procedures.length > 0 ? (totalSteps / procedures.length).toFixed(1) : 0;
    const avgReqs = procedures.length > 0 ? (totalReqs / procedures.length).toFixed(1) : 0;

    // Top institutions by procedures
    const instProcCounts: { [key: string]: number } = {};
    procedures.forEach(p => {
      const instName = p.institutions?.name || 'N/A';
      instProcCounts[instName] = (instProcCounts[instName] || 0) + 1;
    });
    const topInstitutionsData = Object.entries(instProcCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    return {
      categoryData,
      digitalizationData,
      userTypeData,
      complexityData,
      avgSteps,
      avgReqs,
      topInstitutionsData,
      totalProcedures: procedures.length,
      totalInstitutions: institutions.length,
      digitalPercentage: procedures.length > 0 ? Math.round((digitalCount / procedures.length) * 100) : 0
    };
  }, [procedures, institutions, obsLoading, t]);

  if (procLoading || instLoading || obsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('statisticsPage.title')}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('statisticsPage.description')}
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{t('statisticsPage.totalProcedures')}</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProcedures}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <Building2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{t('statisticsPage.totalInstitutions')}</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalInstitutions}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="bg-orange-100 p-3 rounded-xl">
              <Layers className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{t('statisticsPage.avgSteps')}</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avgSteps}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-xl">
              <CheckCircle2 className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{t('statisticsPage.avgRequirements')}</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avgReqs}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Procedures by Category */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <BarChart3 className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Trámites por Categoría</h2>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.categoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={120} 
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Complexity by Category */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <Layers className="h-6 w-6 text-orange-600" />
              <h2 className="text-xl font-bold text-gray-900">Complejidad (Promedio Requisitos)</h2>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.complexityData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={120} 
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} requisitos`, 'Promedio']}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* User Types */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <Users className="h-6 w-6 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-900">Trámites por Tipo de Usuario</h2>
            </div>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.userTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.userTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Digitalization Level */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <PieChartIcon className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">{t('statisticsPage.digitalization')}</h2>
            </div>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.digitalizationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.digitalizationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Institutions */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">{t('statisticsPage.byInstitution')}</h2>
          </div>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.topInstitutionsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;

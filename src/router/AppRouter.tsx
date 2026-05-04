import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import GoogleAnalytics from '../components/common/GoogleAnalytics';
import HomePage from '../pages/HomePage';
import CatalogPage from '../pages/CatalogPage';
import CategoriesPage from '../pages/CategoriesPage';
import ProcedureDetailPage from '../pages/ProcedureDetailPage';
import InstitutionsPage from '../pages/InstitutionsPage';
import InstitutionDetailPage from '../pages/InstitutionDetailPage';
import ObservatoryPage from '../pages/ObservatoryPage';
import StatisticsPage from '../pages/StatisticsPage';
import AssistantPage from '../pages/AssistantPage';
import ExperiencesPage from '../pages/ExperiencesPage';
import HelpPage from '../pages/HelpPage';
import TermsPage from '../pages/TermsPage';
import PrivacyPage from '../pages/PrivacyPage';
import AccessibilityPage from '../pages/AccessibilityPage';
import AboutPage from '../pages/AboutPage';
import DatabasePage from '../pages/DatabasePage';
import NotFoundPage from '../pages/NotFoundPage';

// Admin Pages
import LoginPage from '../pages/admin/LoginPage';
import AdminLayout from '../components/admin/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminProcedures from '../pages/admin/AdminProcedures';
import AdminProcedureForm from '../pages/admin/AdminProcedureForm';
import AdminInstitutions from '../pages/admin/AdminInstitutions';
import AdminInstitutionForm from '../pages/admin/AdminInstitutionForm';
import AdminObservatory from '../pages/admin/AdminObservatory';
import AdminExperiences from '../pages/admin/AdminExperiences';
import AdminExperienceForm from '../pages/admin/AdminExperienceForm';
import AdminSettings from '../pages/admin/AdminSettings';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <GoogleAnalytics />
      <Routes>
        {/* Admin Protected Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="procedures" element={<AdminProcedures />} />
          <Route path="procedures/new" element={<AdminProcedureForm />} />
          <Route path="procedures/edit/:id" element={<AdminProcedureForm />} />
          <Route path="institutions" element={<AdminInstitutions />} />
          <Route path="institutions/new" element={<AdminInstitutionForm />} />
          <Route path="institutions/edit/:id" element={<AdminInstitutionForm />} />
          <Route path="observatory" element={<AdminObservatory />} />
          <Route path="experiences" element={<AdminExperiences />} />
          <Route path="experiences/new" element={<AdminExperienceForm />} />
          <Route path="experiences/edit/:id" element={<AdminExperienceForm />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Public Routes with standard Layout */}
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalogo" element={<CatalogPage />} />
              <Route path="/catalogo/:category" element={<CatalogPage />} />
              <Route path="/categorias" element={<CategoriesPage />} />
              <Route path="/tramite/:id" element={<ProcedureDetailPage />} />
              <Route path="/procedures/:id" element={<ProcedureDetailPage />} />
              <Route path="/instituciones" element={<InstitutionsPage />} />
              <Route path="/institutions" element={<InstitutionsPage />} />
              <Route path="/instituciones/:id" element={<InstitutionDetailPage />} />
              <Route path="/institutions/:id" element={<InstitutionDetailPage />} />
              <Route path="/observatorio" element={<ObservatoryPage />} />
              <Route path="/estadisticas" element={<StatisticsPage />} />
              <Route path="/asistente-tramites" element={<AssistantPage />} />
              <Route path="/experiencias" element={<ExperiencesPage />} />
              <Route path="/ayuda" element={<HelpPage />} />
              <Route path="/terminos" element={<TermsPage />} />
              <Route path="/privacidad" element={<PrivacyPage />} />
              <Route path="/accesibilidad" element={<AccessibilityPage />} />
              <Route path="/acerca-de" element={<AboutPage />} />
              <Route path="/base-de-datos" element={<DatabasePage />} />
              
              {/* Standalone pages inside Layout */}
              <Route path="/login" element={<LoginPage />} />
              
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
};

export default AppRouter;
import AppRouter from './router/AppRouter';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { ReportModalProvider } from './contexts/ReportModalContext';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ReportModalProvider>
          <AppRouter />
        </ReportModalProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
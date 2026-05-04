import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ReportModalContextType {
  isModalOpen: boolean;
  openReportModal: (procedureName?: string, institutionName?: string) => void;
  closeReportModal: () => void;
  setIsModalOpen: (open: boolean) => void;
  initialData: { procedureName: string; institutionName: string };
}

const ReportModalContext = createContext<ReportModalContextType | undefined>(undefined);

export function ReportModalProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialData, setInitialData] = useState({ procedureName: '', institutionName: '' });

  const openReportModal = (procedureName = '', institutionName = '') => {
    setInitialData({ procedureName, institutionName });
    setIsModalOpen(true);
  };

  const closeReportModal = () => {
    setIsModalOpen(false);
  };

  return (
    <ReportModalContext.Provider value={{ isModalOpen, openReportModal, closeReportModal, initialData, setIsModalOpen }}>
      {children}
    </ReportModalContext.Provider>
  );
}

export function useReportModal() {
  const context = useContext(ReportModalContext);
  if (context === undefined) {
    throw new Error('useReportModal must be used within a ReportModalProvider');
  }
  return context;
}

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DashboardData } from './types';

interface GlobalState {
  language: 'ar' | 'en';
  theme: 'light' | 'dark';
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  globalSearch: string;
  selectedPort: string | null;
  selectedVesselType: string | null;
  selectedShippingLine: string | null;
}

interface GlobalActions {
  setLanguage: (lang: 'ar' | 'en') => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setGlobalSearch: (search: string) => void;
  setSelectedPort: (port: string | null) => void;
  setSelectedVesselType: (type: string | null) => void;
  setSelectedShippingLine: (line: string | null) => void;
  refreshData: () => Promise<void>;
}

const GlobalContext = createContext<(GlobalState & GlobalActions) | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<GlobalState>({
    language: 'ar',
    theme: 'dark',
    data: null,
    loading: true,
    error: null,
    globalSearch: '',
    selectedPort: null,
    selectedVesselType: null,
    selectedShippingLine: null,
  });

  const fetchData = async () => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const res = await fetch('/api/dashboard');
      if (!res.ok) throw new Error('Failed to fetch data');
      const data: DashboardData = await res.json();
      setState(s => ({ ...s, data, loading: false }));
    } catch (err: any) {
      setState(s => ({ ...s, error: err.message, loading: false }));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (state.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.dir = state.language === 'ar' ? 'rtl' : 'ltr';
    root.lang = state.language;
  }, [state.theme, state.language]);

  const actions: GlobalActions = {
    setLanguage: (language) => setState(s => ({ ...s, language })),
    setTheme: (theme) => setState(s => ({ ...s, theme })),
    setGlobalSearch: (globalSearch) => setState(s => ({ ...s, globalSearch })),
    setSelectedPort: (selectedPort) => setState(s => ({ ...s, selectedPort })),
    setSelectedVesselType: (selectedVesselType) => setState(s => ({ ...s, selectedVesselType })),
    setSelectedShippingLine: (selectedShippingLine) => setState(s => ({ ...s, selectedShippingLine })),
    refreshData: fetchData,
  };

  return (
    <GlobalContext.Provider value={{ ...state, ...actions }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const ctx = useContext(GlobalContext);
  if (!ctx) throw new Error('useGlobal must be used within a GlobalProvider');
  return ctx;
};

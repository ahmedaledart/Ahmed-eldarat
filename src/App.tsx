/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GlobalProvider, useGlobal } from './context';
import { Header } from './components/Header';
import { StatCards } from './components/StatCards';
import { MapView } from './components/MapView';
import { MainTable } from './components/MainTable';
import { CostsTable } from './components/CostsTable';
import { VesselTypes } from './components/VesselTypes';
import { LibyanPorts } from './components/LibyanPorts';
import { ShippingLines } from './components/ShippingLines';
import { DashboardCharts } from './components/DashboardCharts';
import { Loader2 } from 'lucide-react';

function Dashboard() {
  const { loading, error } = useGlobal();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center text-teal-600 dark:text-teal-400">
          <Loader2 className="w-12 h-12 animate-spin mb-4" />
          <h2 className="text-xl font-medium tracking-wide">جاري تحميل منصة الشحن...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-xl border border-red-200 dark:border-red-800/50 max-w-lg text-center">
          <h2 className="text-lg font-bold mb-2">خطأ في تحميل البيانات</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-teal-500/30">
      <Header />
      
      <main className="max-w-[1600px] mx-auto p-4 md:p-6 space-y-6">
        <StatCards />
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <MapView />
            <DashboardCharts />
          </div>
          <div className="space-y-6">
            <LibyanPorts />
            <VesselTypes />
            <ShippingLines />
          </div>
        </div>

        <MainTable />
        <CostsTable />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <GlobalProvider>
      <Dashboard />
    </GlobalProvider>
  );
}

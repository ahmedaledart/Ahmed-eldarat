import { useGlobal } from '../context';
import { MapPin, Ship, Clock, ArrowRight } from 'lucide-react';

export function LibyanPorts() {
  const { data, language, selectedPort, setSelectedPort } = useGlobal();

  if (!data) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full max-h-[400px]">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 rounded-t-2xl">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-white flex items-center gap-2">
          <MapPin className="w-4 h-4 text-teal-500" />
          {language === 'ar' ? 'الموانئ الليبية' : 'Libyan Ports'}
        </h2>
        {selectedPort && (
          <button 
            onClick={() => setSelectedPort(null)}
            className="text-xs text-teal-600 dark:text-teal-400 hover:underline"
          >
            {language === 'ar' ? 'إظهار الكل' : 'Show All'}
          </button>
        )}
      </div>
      <div className="p-2 overflow-y-auto flex-1 custom-scrollbar">
        <div className="space-y-1">
          {data.libyanPorts.map((port) => {
            const isSelected = selectedPort === port.name_en;
            return (
              <button
                key={port.name_en}
                onClick={() => setSelectedPort(isSelected ? null : port.name_en)}
                className={`w-full text-right flex flex-col p-3 rounded-xl transition-all duration-200 ${
                  isSelected 
                    ? 'bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/30' 
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <div className="flex justify-between items-center w-full mb-2">
                  <div className="font-medium text-sm text-slate-800 dark:text-slate-200">
                    {language === 'ar' ? port.name_ar : port.name_en}
                  </div>
                  <div className="text-xs text-slate-500 font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                    {port.un_locode}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 w-full">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500">{language === 'ar' ? 'بالميناء' : 'In Port'}</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                      {port.current_ships}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500">{language === 'ar' ? 'قادمة' : 'Inbound'}</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                      {port.incoming_ships}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500">{language === 'ar' ? 'تكلفة الشحن' : 'Avg Cost'}</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {port.avg_cost}
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
}

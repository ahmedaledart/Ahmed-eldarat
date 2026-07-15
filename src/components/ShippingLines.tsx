import { useGlobal } from '../context';
import { Route } from 'lucide-react';

export function ShippingLines() {
  const { data, language, selectedShippingLine, setSelectedShippingLine } = useGlobal();

  if (!data) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full max-h-[300px]">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 rounded-t-2xl">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-white flex items-center gap-2">
          <Route className="w-4 h-4 text-purple-500" />
          {language === 'ar' ? 'خطوط الملاحة' : 'Shipping Lines'}
        </h2>
        {selectedShippingLine && (
          <button 
            onClick={() => setSelectedShippingLine(null)}
            className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
          >
            {language === 'ar' ? 'إظهار الكل' : 'Show All'}
          </button>
        )}
      </div>
      <div className="p-2 overflow-y-auto flex-1 custom-scrollbar">
        <div className="space-y-1">
          {data.shippingLines.map((line) => {
            const isSelected = selectedShippingLine === line.name;
            return (
              <button
                key={line.name}
                onClick={() => setSelectedShippingLine(isSelected ? null : line.name)}
                className={`w-full text-right flex justify-between items-center p-3 rounded-xl transition-all duration-200 ${
                  isSelected 
                    ? 'bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30' 
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <div>
                  <div className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    {line.name}
                    {line.status === 'Active' && <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex gap-2">
                    <span>{language === 'ar' ? 'سفن:' : 'Ships:'} {line.ships}</span>
                    <span>&bull;</span>
                    <span>{language === 'ar' ? 'رحلات:' : 'Trips:'} {line.trips}</span>
                  </div>
                </div>
                
                <div className="text-left rtl:text-right flex flex-col items-end">
                   <div className="text-xs text-slate-600 dark:text-slate-300">
                     {language === 'ar' ? 'متوسط السعر' : 'Avg Cost'}
                   </div>
                   <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{line.avg_cost}</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
}

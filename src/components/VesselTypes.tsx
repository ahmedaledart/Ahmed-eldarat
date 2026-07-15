import { useGlobal } from '../context';
import { Ship } from 'lucide-react';

export function VesselTypes() {
  const { data, language, selectedVesselType, setSelectedVesselType } = useGlobal();

  if (!data) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full max-h-[300px]">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 rounded-t-2xl">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-white flex items-center gap-2">
          <Ship className="w-4 h-4 text-blue-500" />
          {language === 'ar' ? 'أنواع السفن' : 'Vessel Types'}
        </h2>
        {selectedVesselType && (
          <button 
            onClick={() => setSelectedVesselType(null)}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            {language === 'ar' ? 'إظهار الكل' : 'Show All'}
          </button>
        )}
      </div>
      <div className="p-2 overflow-y-auto flex-1 custom-scrollbar">
        <div className="space-y-1">
          {data.vesselTypes.map((type) => {
            const isSelected = selectedVesselType === type.type_en;
            return (
              <button
                key={type.type_en}
                onClick={() => setSelectedVesselType(isSelected ? null : type.type_en)}
                className={`w-full text-right flex justify-between items-center p-3 rounded-xl transition-all duration-200 ${
                  isSelected 
                    ? 'bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30' 
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <div>
                  <div className="font-medium text-sm text-slate-800 dark:text-slate-200">
                    {language === 'ar' ? type.type_ar : type.type_en}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {language === 'ar' ? 'البضاعة:' : 'Cargo:'} <span className="text-slate-700 dark:text-slate-300">{type.top_cargo}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{type.count}</div>
                  <div className="text-[10px] text-slate-400">{type.percentage}%</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
}

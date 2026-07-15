import { useGlobal } from '../context';
import { Ship, Anchor, Clock, ArrowDownRight, ArrowUpRight, Navigation2, DollarSign, Activity, AlertCircle } from 'lucide-react';
import { useMemo } from 'react';

export function StatCards() {
  const { data, language, selectedPort, selectedVesselType, selectedShippingLine } = useGlobal();

  const filteredShips = useMemo(() => {
    if (!data) return [];
    return data.ships.filter(s => {
      if (selectedPort && s.libyan_port !== selectedPort) return false;
      if (selectedVesselType && s.vessel_type !== selectedVesselType) return false;
      if (selectedShippingLine && s.shipping_line !== selectedShippingLine) return false;
      return true;
    });
  }, [data, selectedPort, selectedVesselType, selectedShippingLine]);

  const filteredRates = useMemo(() => {
    if (!data) return [];
    return data.freightRates.filter(r => {
      if (selectedPort && r.destination_port !== selectedPort) return false;
      if (selectedVesselType && r.vessel_type !== selectedVesselType) return false;
      if (selectedShippingLine && r.shipping_line !== selectedShippingLine) return false;
      return true;
    });
  }, [data, selectedPort, selectedVesselType, selectedShippingLine]);

  if (!data) return null;

  const totalShips = filteredShips.length;
  const inPort = filteredShips.filter(s => s.vessel_status === 'In Port').length;
  const anchored = filteredShips.filter(s => s.vessel_status === 'Anchored').length;
  const delayed = filteredShips.filter(s => s.vessel_status === 'Delayed').length;
  const expected = filteredShips.filter(s => s.vessel_status === 'Expected').length;
  const activePorts = data.libyanPorts.length;
  
  const avgCost = filteredRates.length > 0 ? Math.round(filteredRates.reduce((acc, curr) => acc + curr.total_cost, 0) / filteredRates.length) : 0;
  const minCost = filteredRates.length > 0 ? Math.min(...filteredRates.map(r => r.total_cost)) : 0;
  const maxCost = filteredRates.length > 0 ? Math.max(...filteredRates.map(r => r.total_cost)) : 0;

  const stats = [
    { title: language === 'ar' ? 'إجمالي السفن' : 'Total Ships', value: totalShips, icon: Ship, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: language === 'ar' ? 'متجهة إلى ليبيا' : 'Inbound to Libya', value: expected, icon: Navigation2, color: 'text-teal-500', bg: 'bg-teal-500/10' },
    { title: language === 'ar' ? 'داخل الموانئ' : 'In Port', value: inPort, icon: Anchor, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { title: language === 'ar' ? 'في الانتظار' : 'Anchored', value: anchored, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { title: language === 'ar' ? 'سفن متأخرة' : 'Delayed Ships', value: delayed, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
    { title: language === 'ar' ? 'موانئ نشطة' : 'Active Ports', value: activePorts, icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { title: language === 'ar' ? 'متوسط سعر الشحن' : 'Avg Freight Cost', value: `$${avgCost}`, icon: DollarSign, color: 'text-sky-500', bg: 'bg-sky-500/10' },
    { title: language === 'ar' ? 'نطاق الأسعار' : 'Price Range', value: `$${minCost} - $${maxCost}`, icon: ArrowUpRight, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-8 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight">
              {stat.title}
            </h3>
            <div className={`p-1.5 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-white">
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
}

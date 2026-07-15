import { useGlobal } from '../context';
import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, DollarSign, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { format } from 'date-fns';

export function CostsTable() {
  const { data, language, globalSearch, selectedPort, selectedVesselType, selectedShippingLine } = useGlobal();
  const [sortField, setSortField] = useState<string>('total_cost');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.freightRates.filter(r => {
      if (selectedPort && r.destination_port !== selectedPort) return false;
      if (selectedVesselType && r.vessel_type !== selectedVesselType) return false;
      if (selectedShippingLine && r.shipping_line !== selectedShippingLine) return false;
      if (globalSearch) {
        const term = globalSearch.toLowerCase();
        if (!r.shipping_line.toLowerCase().includes(term) && 
            !r.origin_port.toLowerCase().includes(term) &&
            !r.destination_port.toLowerCase().includes(term)) {
          return false;
        }
      }
      return true;
    }).sort((a: any, b: any) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, selectedPort, selectedVesselType, selectedShippingLine, globalSearch, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const columns = [
    { key: 'origin_port', label_en: 'Origin Port', label_ar: 'ميناء الانطلاق' },
    { key: 'destination_port', label_en: 'Dest. Port', label_ar: 'ميناء الوصول' },
    { key: 'shipping_line', label_en: 'Shipping Line', label_ar: 'الخط الملاحي' },
    { key: 'container_size', label_en: 'Container', label_ar: 'نوع الحاوية' },
    { key: 'cargo_type', label_en: 'Cargo', label_ar: 'نوع البضاعة' },
    { key: 'base_rate', label_en: 'Base Rate', label_ar: 'السعر الأساسي' },
    { key: 'fees', label_en: 'Fees', label_ar: 'الرسوم الإضافية' },
    { key: 'total_cost', label_en: 'Total Cost', label_ar: 'التكلفة الإجمالية' },
    { key: 'transit_days', label_en: 'Transit Days', label_ar: 'مدة الرحلة' },
    { key: 'valid_until', label_en: 'Valid Until', label_ar: 'تاريخ الانتهاء' },
    { key: 'source', label_en: 'Source', label_ar: 'المصدر' },
    { key: 'price_status', label_en: 'Status', label_ar: 'الحالة' },
  ];

  if (!data) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-emerald-500" />
          {language === 'ar' ? 'أسعار الشحن والنقل' : 'Freight & Transport Costs'}
        </h2>
        <div className="text-xs text-slate-500 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
          {language === 'ar' ? 'جميع الأسعار بـ USD' : 'All prices in USD'}
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar max-h-[500px]">
        <table className="w-full text-sm text-left rtl:text-right text-slate-600 dark:text-slate-300">
          <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 backdrop-blur-md">
            <tr>
              {columns.map(col => (
                <th key={col.key} scope="col" className="px-6 py-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors whitespace-nowrap" onClick={() => handleSort(col.key)}>
                  <div className="flex items-center gap-2">
                    {language === 'ar' ? col.label_ar : col.label_en}
                    {sortField === col.key && (
                      sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((rate) => (
              <tr key={rate.id} className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-3 whitespace-nowrap">
                  <div className="font-medium text-slate-800 dark:text-slate-200">{rate.origin_port}</div>
                  <div className="text-xs text-slate-500">{rate.origin_country}</div>
                </td>
                <td className="px-6 py-3 whitespace-nowrap">
                  <div className="font-medium text-slate-800 dark:text-slate-200">{rate.destination_port}</div>
                  <div className="text-xs text-slate-500">{rate.destination_country}</div>
                </td>
                <td className="px-6 py-3 whitespace-nowrap font-medium">{rate.shipping_line}</td>
                <td className="px-6 py-3 whitespace-nowrap">
                  <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs font-mono">{rate.container_size}</span>
                </td>
                <td className="px-6 py-3 whitespace-nowrap">
                  {rate.cargo_type}
                </td>
                <td className="px-6 py-3 whitespace-nowrap font-mono text-xs">
                  ${rate.base_rate?.toLocaleString()}
                </td>
                <td className="px-6 py-3 whitespace-nowrap font-mono text-xs text-slate-500">
                  +${(rate.total_cost - (rate.base_rate || 0)).toLocaleString()}
                </td>
                <td className="px-6 py-3 whitespace-nowrap">
                  <div className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-1">
                    <span className="text-xs text-slate-500 font-normal">$</span>
                    {rate.total_cost.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-3 whitespace-nowrap">{rate.transit_days} {language === 'ar' ? 'أيام' : 'days'}</td>
                <td className="px-6 py-3 whitespace-nowrap text-xs">
                  {format(new Date(rate.valid_until), 'dd MMM yyyy')}
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-xs text-slate-500">
                  {rate.source}
                </td>
                <td className="px-6 py-3 whitespace-nowrap">
                  <span className={`px-2 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                    rate.price_status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                    rate.price_status === 'Quote' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
                    rate.price_status === 'Estimated' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {language === 'ar' ? (
                      rate.price_status === 'Confirmed' ? 'مؤكد' :
                      rate.price_status === 'Quote' ? 'عرض سعر' :
                      rate.price_status === 'Estimated' ? 'تقديري' :
                      rate.price_status === 'Market Average' ? 'متوسط سوق' : rate.price_status
                    ) : rate.price_status}
                  </span>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={12} className="px-6 py-12 text-center text-slate-500">
                  {language === 'ar' ? 'لا توجد بيانات مطابقة للبحث' : 'No matching data found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

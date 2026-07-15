import { useGlobal } from '../context';
import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Search, Download, FileSpreadsheet } from 'lucide-react';
import { format } from 'date-fns';

export function MainTable() {
  const { data, language, globalSearch, selectedPort, selectedVesselType, selectedShippingLine } = useGlobal();
  const [sortField, setSortField] = useState<string>('vessel_name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.ships.filter(s => {
      if (selectedPort && s.libyan_port !== selectedPort) return false;
      if (selectedVesselType && s.vessel_type !== selectedVesselType) return false;
      if (selectedShippingLine && s.shipping_line !== selectedShippingLine) return false;
      if (globalSearch) {
        const term = globalSearch.toLowerCase();
        if (!s.vessel_name.toLowerCase().includes(term) && 
            !s.imo.toString().includes(term) && 
            !s.mmsi.toString().includes(term) &&
            !s.shipping_line.toLowerCase().includes(term) &&
            !s.libyan_port.toLowerCase().includes(term)) {
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

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const columns = [
    { key: 'vessel_name', label_en: 'Vessel Name', label_ar: 'اسم السفينة' },
    { key: 'imo', label_en: 'IMO', label_ar: 'IMO' },
    { key: 'vessel_type', label_en: 'Type', label_ar: 'نوع السفينة' },
    { key: 'cargo_type', label_en: 'Cargo', label_ar: 'الشحنة' },
    { key: 'shipping_line', label_en: 'Shipping Line', label_ar: 'خط الملاحة' },
    { key: 'origin_port', label_en: 'Origin', label_ar: 'ميناء الانطلاق' },
    { key: 'libyan_port', label_en: 'Destination', label_ar: 'ميناء الوصول' },
    { key: 'eta', label_en: 'ETA', label_ar: 'وقت الوصول' },
    { key: 'vessel_status', label_en: 'Status', label_ar: 'الحالة' },
  ];

  if (!data) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 dark:bg-slate-800/50">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
          {language === 'ar' ? 'الجدول الرئيسي لحركة السفن' : 'Main Vessel Traffic Table'}
        </h2>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <FileSpreadsheet className="w-4 h-4 text-green-600" />
            {language === 'ar' ? 'تصدير Excel' : 'Export Excel'}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-sm text-left rtl:text-right text-slate-600 dark:text-slate-300">
          <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
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
            {paginatedData.map((ship, idx) => (
              <tr key={ship.id} className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-3 font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap">{ship.vessel_name}</td>
                <td className="px-6 py-3 font-mono text-xs">{ship.imo}</td>
                <td className="px-6 py-3 whitespace-nowrap">{language === 'ar' ? ship.vessel_type_ar : ship.vessel_type}</td>
                <td className="px-6 py-3 whitespace-nowrap">
                  {ship.cargo_type === 'Estimated' ? (
                    <span className="text-slate-500 italic">{language === 'ar' ? 'شحنة تقديرية' : 'Estimated'}</span>
                  ) : (
                    <span>{ship.cargo_type}</span>
                  )}
                </td>
                <td className="px-6 py-3 whitespace-nowrap">{ship.shipping_line}</td>
                <td className="px-6 py-3 whitespace-nowrap">{ship.origin_port} ({ship.origin_country})</td>
                <td className="px-6 py-3 font-medium whitespace-nowrap">{ship.libyan_port}</td>
                <td className="px-6 py-3 whitespace-nowrap">{format(new Date(ship.eta), 'dd MMM yyyy, HH:mm')}</td>
                <td className="px-6 py-3">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full border whitespace-nowrap ${
                    ship.vessel_status === 'In Port' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20' :
                    ship.vessel_status === 'Delayed' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20' :
                    ship.vessel_status === 'Expected' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' :
                    'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20'
                  }`}>
                    {language === 'ar' ? (
                      ship.vessel_status === 'In Port' ? 'بالميناء' :
                      ship.vessel_status === 'Delayed' ? 'متأخرة' :
                      ship.vessel_status === 'Expected' ? 'متوقعة' :
                      ship.vessel_status === 'Anchored' ? 'في الانتظار' :
                      ship.vessel_status === 'Departed' ? 'مغادرة' : ship.vessel_status
                    ) : ship.vessel_status}
                  </span>
                </td>
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                  {language === 'ar' ? 'لا توجد بيانات مطابقة للبحث' : 'No matching data found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500">
        <div>
          {language === 'ar' ? 'عرض' : 'Showing'} {(page - 1) * pageSize + 1} {language === 'ar' ? 'إلى' : 'to'} {Math.min(page * pageSize, filteredData.length)} {language === 'ar' ? 'من' : 'of'} {filteredData.length} {language === 'ar' ? 'سجل' : 'entries'}
        </div>
        <div className="flex gap-2 items-center">
          <select 
            value={pageSize} 
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-teal-500"
          >
            {[10, 25, 50, 100].map(size => <option key={size} value={size}>{size}</option>)}
          </select>
          <div className="flex gap-1">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {language === 'ar' ? 'السابق' : 'Prev'}
            </button>
            <button 
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {language === 'ar' ? 'التالي' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

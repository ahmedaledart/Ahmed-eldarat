import { useGlobal } from '../context';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef'];

export function DashboardCharts() {
  const { data, language, setSelectedPort } = useGlobal();

  if (!data) return null;

  const portData = data.libyanPorts.map(p => ({
    name: language === 'ar' ? p.name_ar : p.name_en,
    originalName: p.name_en,
    ships: p.current_ships + p.incoming_ships,
    cost: parseInt(p.avg_cost.replace('$', ''))
  })).sort((a, b) => b.ships - a.ships);

  const typeData = data.vesselTypes.map(t => ({
    name: language === 'ar' ? t.type_ar : t.type_en,
    value: t.percentage
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl text-xs border border-slate-700">
          <p className="font-bold mb-1">{label || payload[0].name}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">
          {language === 'ar' ? 'حركة السفن حسب الميناء' : 'Ship Traffic by Port'}
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={portData} 
              layout="vertical" 
              margin={{ top: 5, right: 30, left: language === 'ar' ? 30 : 0, bottom: 5 }}
              onClick={(data: any) => {
                if (data && data.activePayload) {
                  setSelectedPort(data.activePayload[0].payload.originalName);
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} horizontal={true} vertical={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#64748b' }} width={80} />
              <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(148, 163, 184, 0.1)'}} />
              <Bar dataKey="ships" name={language === 'ar' ? 'عدد السفن' : 'Ships'} fill="#0ea5e9" radius={[0, 4, 4, 0]} barSize={20} className="cursor-pointer" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">
          {language === 'ar' ? 'توزيع أنواع السفن' : 'Vessel Types Distribution'}
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={typeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {typeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-3 justify-center mt-2">
          {typeData.map((entry, index) => (
            <div key={index} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
              {entry.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

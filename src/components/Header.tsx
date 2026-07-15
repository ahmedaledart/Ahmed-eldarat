import { useGlobal } from '../context';
import { Search, Moon, Sun, Languages, RefreshCcw, Wifi } from 'lucide-react';
import { format } from 'date-fns';

export function Header() {
  const { theme, setTheme, language, setLanguage, refreshData, globalSearch, setGlobalSearch, data } = useGlobal();

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  const toggleLanguage = () => setLanguage(language === 'ar' ? 'en' : 'ar');

  const lastUpdate = data?.ships?.[0]?.last_updated || new Date().toISOString();

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-20 flex items-center justify-between gap-4">
        
        <div className="flex items-center gap-4">
          <img 
            src={theme === 'dark' 
              ? "https://i.postimg.cc/RVKHDgL2/nshrt-as%CA%BFar-alnft-w-alsl%CA%BF-covered-07-1-removebg-preview.png"
              : "https://i.postimg.cc/WzCZrrn8/cropped-NEW-LOGO-LTN-06-1-removebg-preview.png"} 
            alt="Logo" 
            className="h-12 w-auto object-contain"
          />
          <div className="hidden md:block">
            <h1 className="text-xl font-bold tracking-tight text-navy-900 dark:text-white">
              {language === 'ar' ? 'منصة متابعة السفن والشحن البحري في ليبيا' : 'Libya Maritime Dashboard'}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {language === 'ar' 
                ? 'منصة تفاعلية لمتابعة حركة السفن والموانئ وأسعار الشحن' 
                : 'Interactive platform for tracking vessels, ports, and freight rates'}
            </p>
          </div>
        </div>

        <div className="flex-1 max-w-md hidden lg:flex items-center relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder={language === 'ar' ? "بحث عام عن سفينة، ميناء، أو خط ملاحي..." : "Search vessel, port, or shipping line..."}
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800/50 border-none rounded-full text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {data?.is_live ? (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 rounded-full text-xs font-medium border border-green-200 dark:border-green-500/20">
              <Wifi className="w-3 h-3" />
              <span>{language === 'ar' ? 'بيانات مباشرة' : 'Live Data'}</span>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-500/10 text-slate-700 dark:text-slate-400 rounded-full text-xs font-medium border border-slate-200 dark:border-slate-500/20">
              <Wifi className="w-3 h-3 opacity-50" />
              <span>{language === 'ar' ? 'بيانات محفوظة' : 'Saved Data'}</span>
            </div>
          )}
          
          <div className="hidden sm:block text-xs text-slate-500 dark:text-slate-400 text-right">
            <div>{language === 'ar' ? 'آخر تحديث' : 'Last update'}</div>
            <div className="font-mono">{format(new Date(data?.last_updated || lastUpdate), 'dd MMM HH:mm:ss')}</div>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-full p-1 border border-slate-200 dark:border-slate-700">
            <button 
              onClick={refreshData}
              className="p-2 rounded-full hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              title={language === 'ar' ? 'تحديث البيانات' : 'Refresh Data'}
            >
              <RefreshCcw className="w-4 h-4" />
            </button>
            <button 
              onClick={toggleLanguage}
              className="p-2 rounded-full hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              title="Change Language"
            >
              <Languages className="w-4 h-4" />
            </button>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}

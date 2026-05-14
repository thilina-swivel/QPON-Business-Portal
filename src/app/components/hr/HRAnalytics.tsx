import React, { useState, useMemo, useEffect } from 'react';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Area, PieChart, Pie, Cell,
} from 'recharts';
import {
  TrendingUp, Download, FileText, Users,
  ChevronDown, ChevronUp, Medal, Search,
  CheckCircle2, Utensils, Fuel, ShoppingCart, Pill, ShoppingBag,
  Wallet, BarChart3, Info,
  CalendarDays, ChevronLeft, ChevronRight, FileSpreadsheet,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { cn } from '../../lib/utils';
import { useTheme } from 'next-themes@0.4.6';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

// ─── Types ────────────────────────────────────────────────────────────────────

type DeptSortKey = 'name' | 'employees' | 'totalSavings' | 'avgPerEmployee' | 'redemptionRate';
type SortDir = 'asc' | 'desc';

interface TrendMonth { label: string; savings: number; cost: number; date: Date; }
interface CategoryItem { label: string; amount: number; color: string; icon: React.ElementType; }
interface Department { name: string; employees: number; totalSavings: number; avgPerEmployee: number; redemptionRate: number; }
interface TopEmployee { rank: number; name: string; department: string; tier: 'Silver' | 'Gold'; savings: number; }
interface EmpBreakdownRow { name: string; department: string; tier: 'Bronze' | 'Silver' | 'Gold'; qponsUsed: number; lastRedemption: string; }
interface RatePoint { label: string; rate: number; date: Date; }

// ─── Demo Data ────────────────────────────────────────────────────────────────

const TREND_DATA: TrendMonth[] = [
  { label: 'Jun', savings: 1680000, cost: 480000, date: new Date(2025, 5, 1) },
  { label: 'Jul', savings: 1785000, cost: 510000, date: new Date(2025, 6, 1) },
  { label: 'Aug', savings: 1838000, cost: 525000, date: new Date(2025, 7, 1) },
  { label: 'Sep', savings: 1890000, cost: 540000, date: new Date(2025, 8, 1) },
  { label: 'Oct', savings: 1944000, cost: 555000, date: new Date(2025, 9, 1) },
  { label: 'Nov', savings: 1995000, cost: 570000, date: new Date(2025, 10, 1) },
  { label: 'Dec', savings: 2048000, cost: 585000, date: new Date(2025, 11, 1) },
  { label: 'Jan', savings: 1995000, cost: 570000, date: new Date(2026, 0, 1) },
  { label: 'Feb', savings: 2030000, cost: 580000, date: new Date(2026, 1, 1) },
  { label: 'Mar', savings: 2065000, cost: 590000, date: new Date(2026, 2, 1) },
  { label: 'Apr', savings: 2083000, cost: 595000, date: new Date(2026, 3, 1) },
  { label: 'May', savings: 2100000, cost: 600000, date: new Date(2026, 4, 1) },
];

const ACTIVATION_TREND: RatePoint[] = [
  { label: 'Jun', rate: 72.5, date: new Date(2025, 5, 1) },
  { label: 'Jul', rate: 75.8, date: new Date(2025, 6, 1) },
  { label: 'Aug', rate: 78.2, date: new Date(2025, 7, 1) },
  { label: 'Sep', rate: 80.1, date: new Date(2025, 8, 1) },
  { label: 'Oct', rate: 81.5, date: new Date(2025, 9, 1) },
  { label: 'Nov', rate: 83.0, date: new Date(2025, 10, 1) },
  { label: 'Dec', rate: 84.2, date: new Date(2025, 11, 1) },
  { label: 'Jan', rate: 85.0, date: new Date(2026, 0, 1) },
  { label: 'Feb', rate: 85.8, date: new Date(2026, 1, 1) },
  { label: 'Mar', rate: 86.5, date: new Date(2026, 2, 1) },
  { label: 'Apr', rate: 87.2, date: new Date(2026, 3, 1) },
  { label: 'May', rate: 88.0, date: new Date(2026, 4, 1) },
];

const REDEMPTION_TREND: RatePoint[] = [
  { label: 'Jun', rate: 82.0, date: new Date(2025, 5, 1) },
  { label: 'Jul', rate: 83.5, date: new Date(2025, 6, 1) },
  { label: 'Aug', rate: 84.8, date: new Date(2025, 7, 1) },
  { label: 'Sep', rate: 85.5, date: new Date(2025, 8, 1) },
  { label: 'Oct', rate: 86.0, date: new Date(2025, 9, 1) },
  { label: 'Nov', rate: 86.8, date: new Date(2025, 10, 1) },
  { label: 'Dec', rate: 87.5, date: new Date(2025, 11, 1) },
  { label: 'Jan', rate: 87.0, date: new Date(2026, 0, 1) },
  { label: 'Feb', rate: 87.8, date: new Date(2026, 1, 1) },
  { label: 'Mar', rate: 88.0, date: new Date(2026, 2, 1) },
  { label: 'Apr', rate: 88.3, date: new Date(2026, 3, 1) },
  { label: 'May', rate: 88.5, date: new Date(2026, 4, 1) },
];

const CATEGORIES: CategoryItem[] = [
  { label: 'Dining',   amount: 672000, color: '#E35000', icon: Utensils },
  { label: 'Fuel',     amount: 441000, color: '#3B82F6', icon: Fuel },
  { label: 'Grocery',  amount: 399000, color: '#10B981', icon: ShoppingCart },
  { label: 'Pharmacy', amount: 294000, color: '#8B5CF6', icon: Pill },
  { label: 'Retail',   amount: 294000, color: '#F59E0B', icon: ShoppingBag },
];

const DEPARTMENTS: Department[] = [
  { name: 'Engineering', employees: 45, totalSavings: 378000, avgPerEmployee: 8400, redemptionRate: 96 },
  { name: 'Operations',  employees: 52, totalSavings: 364000, avgPerEmployee: 7000, redemptionRate: 90 },
  { name: 'Finance',     employees: 38, totalSavings: 285000, avgPerEmployee: 7500, redemptionRate: 89 },
  { name: 'IT',          employees: 35, totalSavings: 280000, avgPerEmployee: 8000, redemptionRate: 91 },
  { name: 'Sales',       employees: 44, totalSavings: 264000, avgPerEmployee: 6000, redemptionRate: 86 },
  { name: 'HR',          employees: 32, totalSavings: 224000, avgPerEmployee: 7000, redemptionRate: 94 },
  { name: 'Marketing',   employees: 28, totalSavings: 168000, avgPerEmployee: 6000, redemptionRate: 82 },
  { name: 'Legal',       employees: 18, totalSavings: 108000, avgPerEmployee: 6000, redemptionRate: 78 },
];

const TOP10: TopEmployee[] = [
  { rank: 1,  name: 'Bimal Seneviratne',      department: 'Engineering', tier: 'Gold', savings: 9500 },
  { rank: 2,  name: 'Chamara Wickramasinghe', department: 'Operations',  tier: 'Gold', savings: 9100 },
  { rank: 3,  name: 'Priya Maheswaran',       department: 'HR',          tier: 'Gold', savings: 8900 },
  { rank: 4,  name: 'Nimal Perera',           department: 'Engineering', tier: 'Gold', savings: 8400 },
  { rank: 5,  name: 'Nuwan Jayasinghe',       department: 'IT',          tier: 'Gold', savings: 8200 },
  { rank: 6,  name: 'Vindya Ranasinghe',      department: 'HR',          tier: 'Gold', savings: 7900 },
  { rank: 7,  name: 'Sandun Rathnayake',      department: 'IT',          tier: 'Gold', savings: 7800 },
  { rank: 8,  name: 'Sachini Bandara',        department: 'Marketing',   tier: 'Gold', savings: 7500 },
  { rank: 9,  name: 'Kavindi Silva',          department: 'HR',          tier: 'Gold', savings: 7200 },
  { rank: 10, name: 'Harini Jayasuriya',      department: 'Finance',     tier: 'Gold', savings: 6800 },
];

const EMP_BREAKDOWN: EmpBreakdownRow[] = [
  { name: 'Bimal Seneviratne',      department: 'Engineering', tier: 'Gold',   qponsUsed: 28, lastRedemption: '2026-05-13' },
  { name: 'Chamara Wickramasinghe', department: 'Operations',  tier: 'Gold',   qponsUsed: 27, lastRedemption: '2026-05-12' },
  { name: 'Priya Maheswaran',       department: 'HR',          tier: 'Gold',   qponsUsed: 25, lastRedemption: '2026-05-11' },
  { name: 'Nimal Perera',           department: 'Engineering', tier: 'Silver', qponsUsed: 19, lastRedemption: '2026-05-10' },
  { name: 'Nuwan Jayasinghe',       department: 'IT',          tier: 'Silver', qponsUsed: 18, lastRedemption: '2026-05-09' },
  { name: 'Vindya Ranasinghe',      department: 'HR',          tier: 'Silver', qponsUsed: 17, lastRedemption: '2026-05-08' },
  { name: 'Sandun Rathnayake',      department: 'IT',          tier: 'Bronze', qponsUsed: 9,  lastRedemption: '2026-05-07' },
  { name: 'Sachini Bandara',        department: 'Marketing',   tier: 'Bronze', qponsUsed: 8,  lastRedemption: '2026-05-06' },
  { name: 'Kavindi Silva',          department: 'HR',          tier: 'Gold',   qponsUsed: 26, lastRedemption: '2026-05-05' },
  { name: 'Harini Jayasuriya',      department: 'Finance',     tier: 'Silver', qponsUsed: 16, lastRedemption: '2026-05-04' },
  { name: 'Dilshan Wickramasinghe', department: 'Engineering', tier: 'Gold',   qponsUsed: 24, lastRedemption: '2026-05-03' },
  { name: 'Amaya Fernando',         department: 'Marketing',   tier: 'Bronze', qponsUsed: 7,  lastRedemption: '2026-05-02' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtShort = (n: number) => {
  if (n >= 1000000) return `LKR ${(n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1)}M`;
  if (n >= 1000)    return `LKR ${(n / 1000).toFixed(0)}k`;
  return `LKR ${n.toLocaleString()}`;
};
const fmtFull = (n: number) => `LKR ${n.toLocaleString('en-LK')}`;


// ─── Skeleton ─────────────────────────────────────────────────────────────────

function HRAnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><Skeleton className="h-7 w-32 mb-2" /><Skeleton className="h-4 w-40" /></div>
        <Skeleton className="h-9 w-48" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardContent className="p-5"><Skeleton className="h-4 w-24 mb-2" /><Skeleton className="h-8 w-32" /></CardContent>
          </Card>
        ))}
      </div>
      <Card className="border-none shadow-sm"><CardContent className="p-5"><Skeleton className="h-52 w-full" /></CardContent></Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm"><CardContent className="p-5 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</CardContent></Card>
        <Card className="border-none shadow-sm"><CardContent className="p-5 space-y-4">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}</CardContent></Card>
      </div>
    </div>
  );
}

// ─── HRAnalytics ─────────────────────────────────────────────────────────────

interface HRAnalyticsProps { onNavigate: (view: string) => void; }

function ExportBtn() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 px-2 sm:px-3 flex-shrink-0">
          <Download className="w-3.5 h-3.5 sm:mr-1.5" />
          <span className="hidden sm:inline text-sm">Export</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <FileText className="w-4 h-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem>
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function HRAnalytics({ onNavigate: _onNavigate }: HRAnalyticsProps) {
  const { theme, resolvedTheme } = useTheme();
  const isDark = theme === 'dark' || resolvedTheme === 'dark';
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // ── Date picker state ──
  const [dateRange, setDateRange]                 = useState('thismonth');
  const [showDatePicker, setShowDatePicker]       = useState(false);
  const [currentMonth, setCurrentMonth]           = useState(new Date().getMonth());
  const [currentYear, setCurrentYear]             = useState(new Date().getFullYear());
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate]     = useState<Date | null>(null);
  const [hoverDate, setHoverDate]                 = useState<Date | null>(null);

  // ── Other state ──
  const [deptSortKey, setDeptSortKey]       = useState<DeptSortKey>('totalSavings');
  const [deptSortDir, setDeptSortDir]       = useState<SortDir>('desc');

  // ── Date picker helpers ──
  const getDateRangeDisplay = () => {
    if (dateRange === 'custom' && selectedStartDate) {
      const fmt = (d: Date) => {
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
      };
      return selectedEndDate ? `${fmt(selectedStartDate)} – ${fmt(selectedEndDate)}` : fmt(selectedStartDate);
    }
    const labels: Record<string, string> = {
      thismonth:    'This Month',
      last3months:  'Last 3 Months',
      last6months:  'Last 6 Months',
      last12months: 'Last 12 Months',
      custom:       'Custom Range',
    };
    return labels[dateRange] ?? 'This Month';
  };

  const handlePresetSelect = (preset: string) => {
    setDateRange(preset);
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setShowDatePicker(false);
  };

  const getDaysInMonth     = (m: number, y: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (m: number, y: number) => new Date(y, m, 1).getDay();

  const isSameDay = (d1: Date | null, d2: Date | null) => {
    if (!d1 || !d2) return false;
    return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
  };

  const isInRange = (date: Date) => {
    if (!selectedStartDate) return false;
    const end = (hoverDate && !selectedEndDate) ? hoverDate : selectedEndDate;
    if (!end) return false;
    const [s, e] = selectedStartDate < end ? [selectedStartDate, end] : [end, selectedStartDate];
    return date >= s && date <= e;
  };

  const isRangeStart = (date: Date) => {
    if (!selectedStartDate || !selectedEndDate) return isSameDay(date, selectedStartDate);
    return isSameDay(date, selectedStartDate) || isSameDay(date, selectedEndDate);
  };

  const handleDateClick = (day: number) => {
    const clicked = new Date(currentYear, currentMonth, day);
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(clicked);
      setSelectedEndDate(null);
      setDateRange('custom');
    } else {
      if (clicked < selectedStartDate) { setSelectedEndDate(selectedStartDate); setSelectedStartDate(clicked); }
      else setSelectedEndDate(clicked);
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay    = getFirstDayOfMonth(currentMonth, currentYear);
    const days        = [];
    const dayNames    = ['S','M','T','W','T','F','S'];
    const months      = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    for (let i = 0; i < firstDay; i++) days.push(<div key={`e-${i}`} />);
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const sel  = isRangeStart(date);
      const inR  = isInRange(date);
      const tod  = isSameDay(date, new Date());
      days.push(
        <button key={day} onClick={() => handleDateClick(day)}
          onMouseEnter={() => setHoverDate(date)} onMouseLeave={() => setHoverDate(null)}
          className={`h-7 text-xs transition-colors relative ${
            sel ? 'bg-[#E35000] text-white font-semibold rounded-md z-10'
            : inR ? 'bg-orange-50 dark:bg-orange-900/30 text-[#E35000] dark:text-orange-300'
            : tod ? 'font-semibold text-[#E35000] dark:text-orange-400'
            : 'hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200'
          }`}
        >{day}</button>
      );
    }

    return (
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => { if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); } else setCurrentMonth(m => m - 1); }} className="p-0.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded transition-colors">
            <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-200" />
          </button>
          <div className="flex items-center gap-2">
            <select value={currentMonth} onChange={e => setCurrentMonth(Number(e.target.value))} className="text-xs font-medium text-gray-700 dark:text-white bg-transparent border-none focus:outline-none cursor-pointer">
              {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
            </select>
            <select value={currentYear} onChange={e => setCurrentYear(Number(e.target.value))} className="text-xs font-medium text-gray-700 dark:text-white bg-transparent border-none focus:outline-none cursor-pointer">
              {Array.from({ length: 10 }, (_, i) => currentYear - 5 + i).map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <button onClick={() => { if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); } else setCurrentMonth(m => m + 1); }} className="p-0.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded transition-colors">
            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-200" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-0.5 mb-1">
          {dayNames.map((d, i) => <div key={i} className="text-center text-[10px] font-medium text-gray-400 py-1">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-0.5">{days}</div>
        {selectedStartDate && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-[#2A2A2A]">
            <p className="text-[10px] text-gray-600 dark:text-gray-300">
              <span className="font-medium">Selected: </span>
              {selectedStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              {selectedEndDate && ` – ${selectedEndDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
            </p>
          </div>
        )}
      </div>
    );
  };

  // Charts always show full 12-month data regardless of the date picker selection
  const chartTrend = TREND_DATA;
  const combinedChartTrend = TREND_DATA.map((t, i) => ({
    label:      t.label,
    savings:    t.savings,
    activation: ACTIVATION_TREND[i]?.rate ?? null,
    redemption: REDEMPTION_TREND[i]?.rate ?? null,
  }));

  // ── Tooltip style ──
  const ttStyle = {
    contentStyle: { backgroundColor: isDark ? '#0A0A0A' : '#fff', border: isDark ? '1px solid #2A2A2A' : 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontSize: '12px' },
    labelStyle:   { color: isDark ? '#fff' : '#000', fontWeight: 'bold' as const },
    itemStyle:    { color: isDark ? '#fff' : '#000' },
    cursor:       { fill: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' },
  };

  const cardHead = 'border-b border-gray-100 dark:border-[#2A2A2A] bg-gradient-to-r from-gray-50 to-white dark:from-[#0A0A0A] dark:to-[#141414] transition-colors duration-300 pt-4 pb-3 px-5';

  // ── Department sort ──
  const sortedDepts = useMemo(() => [...DEPARTMENTS].sort((a, b) => {
    const av = a[deptSortKey], bv = b[deptSortKey];
    const cmp = typeof av === 'string' ? (av as string).localeCompare(bv as string) : (av as number) - (bv as number);
    return deptSortDir === 'asc' ? cmp : -cmp;
  }), [deptSortKey, deptSortDir]);

  const handleDeptSort = (key: DeptSortKey) => {
    if (key === deptSortKey) setDeptSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setDeptSortKey(key); setDeptSortDir('desc'); }
  };

  const totalCat = CATEGORIES.reduce((a, c) => a + c.amount, 0);

  const DeptColHeader = ({ col, label, right = false }: { col: DeptSortKey; label: string; right?: boolean }) => (
    <th className={cn('px-3 py-3 cursor-pointer select-none group', right && 'text-right')} onClick={() => handleDeptSort(col)}>
      <div className={cn('flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors', right && 'justify-end')}>
        {label}
        {deptSortKey === col
          ? (deptSortDir === 'asc' ? <ChevronUp className="w-3 h-3 text-[#E35000]" /> : <ChevronDown className="w-3 h-3 text-[#E35000]" />)
          : <ChevronDown className="w-3 h-3 text-gray-300 dark:text-gray-600" />}
      </div>
    </th>
  );

  // ── Export dropdown — matches Analytics.tsx pattern ──

  return (
    <div className="space-y-6 pb-20 lg:pb-0">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0E2250] dark:text-white transition-colors duration-300">Analytics</h2>
          <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">Axora Technologies · May 2026</p>
        </div>

        <div className="relative self-start sm:self-auto">
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1C1C1C] border border-gray-300 dark:border-[#2A2A2A] rounded-lg hover:bg-gray-50 dark:hover:bg-[#141414] transition-colors duration-300"
          >
            <CalendarDays className="w-4 h-4 text-gray-500 dark:text-gray-200" />
            <span className="text-sm text-gray-700 dark:text-white">{getDateRangeDisplay()}</span>
            <ChevronRight className={`w-4 h-4 text-gray-400 dark:text-gray-300 transition-transform ${showDatePicker ? 'rotate-90' : ''}`} />
          </button>

          {showDatePicker && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowDatePicker(false)} />
              <div className="fixed md:absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:top-full md:right-0 md:left-auto md:translate-x-0 md:translate-y-0 md:mt-2 bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C] rounded-lg shadow-2xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.7)] border border-gray-200 dark:border-[#2A2A2A] overflow-hidden z-50 flex w-[95vw] max-w-[420px] md:w-[420px] transition-colors duration-300">
                <div className="w-36 bg-gray-50 dark:bg-[#0A0A0A] border-r border-gray-200 dark:border-[#2A2A2A] p-1.5 transition-colors duration-300">
                  {[
                    { label: 'This Month',     value: 'thismonth'    },
                    { label: 'Last 3 Months',  value: 'last3months'  },
                    { label: 'Last 6 Months',  value: 'last6months'  },
                    { label: 'Last 12 Months', value: 'last12months' },
                  ].map(p => (
                    <button key={p.value} onClick={() => handlePresetSelect(p.value)}
                      className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors ${
                        dateRange === p.value && !selectedStartDate
                          ? 'bg-[#E35000] text-white font-medium'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10'
                      }`}
                    >{p.label}</button>
                  ))}
                </div>
                <div className="flex-1">
                  {renderCalendar()}
                  <div className="flex gap-2 px-3 pb-3">
                    <Button className="flex-1 bg-gray-100 dark:bg-[#2A2A2A] hover:bg-gray-200 dark:hover:bg-[#1C1C1C] text-gray-700 dark:text-white border-none text-xs py-1.5 transition-colors duration-300"
                      onClick={() => { setSelectedStartDate(null); setSelectedEndDate(null); setShowDatePicker(false); }}>
                      Cancel
                    </Button>
                    <Button className="flex-1 bg-[#E35000] hover:bg-[#c44500] text-white border-none text-xs py-1.5 transition-colors duration-300"
                      onClick={() => { if (selectedStartDate) { setDateRange('custom'); setShowDatePicker(false); } }}
                      disabled={!selectedStartDate}>
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: Wallet, bg: 'bg-gradient-to-br from-blue-500 to-blue-600', bgLight: 'bg-blue-50',
            border: 'border-l-blue-500',
            label: 'Company Cost', tooltip: 'Total subscription cost paid by the company for QPON this month.',
            value: 'LKR 600k',
            badge: <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full"><TrendingUp className="w-3 h-3" /><span className="text-xs font-semibold">May</span></div>,
            sub: <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 transition-colors duration-300">May 2026</p>,
          },
          {
            icon: TrendingUp, bg: 'bg-gradient-to-br from-emerald-500 to-emerald-600', bgLight: 'bg-emerald-50',
            border: 'border-l-emerald-500',
            label: 'Staff Savings', tooltip: 'Total savings generated by all activated employees this month.',
            value: 'LKR 2.1M',
            badge: <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full"><TrendingUp className="w-3 h-3" /><span className="text-xs font-semibold">+12%</span></div>,
            sub: <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 transition-colors duration-300">vs prev month</p>,
          },
          {
            icon: BarChart3, bg: 'bg-gradient-to-br from-violet-500 to-violet-600', bgLight: 'bg-violet-50',
            border: 'border-l-violet-500',
            label: 'ROI Ratio', tooltip: 'Savings ÷ Cost: for every LKR spent on QPON, employees save this multiple.',
            value: '3.5:1',
            badge: <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full"><TrendingUp className="w-3 h-3" /><span className="text-xs font-semibold">ROI</span></div>,
            sub: <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 transition-colors duration-300">savings ÷ cost</p>,
          },
          {
            icon: Users, bg: 'bg-gradient-to-br from-teal-500 to-teal-600', bgLight: 'bg-teal-50',
            border: 'border-l-teal-500',
            label: 'Redemption Rate', tooltip: 'Percentage of activated employees who used their QPON benefit at least once.',
            value: '88.5%',
            badge: <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full"><TrendingUp className="w-3 h-3" /><span className="text-xs font-semibold">+2.1%</span></div>,
            sub: <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 transition-colors duration-300">used QPON ≥ once</p>,
          },
        ].map((card) => (
          <Card key={card.label} className={`border-none shadow-lg hover:shadow-xl dark:shadow-2xl transition-all duration-300 relative group border-l-4 ${card.border} bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C]`}>
            <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
              <div className={`absolute top-0 right-0 w-32 h-32 ${card.bgLight} dark:bg-transparent rounded-full blur-3xl opacity-30 -mr-16 -mt-16 group-hover:opacity-50 transition-opacity`} />
            </div>
            <CardContent className="p-5 relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${card.bg} shadow-lg`}>
                  <card.icon className="w-5 h-5 text-white" />
                </div>
                {card.badge}
              </div>
              <div className="flex items-center gap-1.5 mb-1">
                <p className="text-xs font-medium text-gray-500 dark:text-blue-300/70 uppercase tracking-wide transition-colors duration-300">{card.label}</p>
                <div className="group/tooltip relative">
                  <Info className="w-3.5 h-3.5 text-gray-400 dark:text-blue-300/50 cursor-help transition-colors duration-300" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block w-56 z-50">
                    <div className="bg-gray-900 dark:bg-[#0A0A0A] text-white text-xs rounded-lg p-3 shadow-xl border border-transparent dark:border-gray-700">
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-[#0A0A0A] rotate-45"></div>
                      {card.tooltip}
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-[#0E2250] dark:text-white transition-colors duration-300">{card.value}</h3>
              {card.sub}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Savings vs Cost (3/4) + Category Pie (1/4) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Savings vs Cost — 3/4 */}
        <Card className="lg:col-span-3 border-none shadow-md bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C]">
          <CardHeader className={cardHead}>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <CardTitle className="text-[#0E2250] dark:text-white text-base sm:text-[18px] transition-colors duration-300">
                    Monthly Savings vs Company Cost
                  </CardTitle>
                  <div className="group/tooltip relative">
                    <Info className="w-4 h-4 text-gray-400 cursor-help flex-shrink-0" />
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover/tooltip:block w-64 z-50 pointer-events-none">
                      <div className="bg-gray-900 dark:bg-[#0A0A0A] text-white text-xs rounded-lg p-3 shadow-xl border border-transparent dark:border-[#2A2A2A]">
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-[#0A0A0A] rotate-45" />
                        Compare what the company pays for QPON against the total savings employees earn each month, to track ROI over time.
                      </div>
                    </div>
                  </div>
                </div>
                <ExportBtn />
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-emerald-400 opacity-80" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Employee Savings</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg width="18" height="10" className="flex-shrink-0">
                    <line x1="0" y1="5" x2="18" y2="5" stroke="#E35000" strokeWidth="2" strokeDasharray="4 2" />
                    <circle cx="9" cy="5" r="2" fill="#E35000" />
                  </svg>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Company Cost</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-4">
            <div className="h-52" style={{ minHeight: 208 }}>
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartTrend} margin={{ top: 5, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradBarSavings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor="#10B981" stopOpacity={0.95} />
                        <stop offset="100%" stopColor="#6EE7B7" stopOpacity={0.6} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#2A2A2A' : '#f0f0f0'} vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={(v: number) => v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : `${v/1000}k`} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={52} />
                    <Tooltip contentStyle={ttStyle.contentStyle} labelStyle={ttStyle.labelStyle} itemStyle={ttStyle.itemStyle} cursor={ttStyle.cursor} formatter={(v: number, name: string) => [fmtShort(v), name]} />
                    <Bar dataKey="savings" name="Employee Savings" fill="url(#gradBarSavings)" radius={[4,4,0,0]} maxBarSize={40} />
                    <Line type="monotone" dataKey="cost" name="Company Cost" stroke="#E35000" strokeWidth={2} strokeDasharray="5 3" dot={{ fill: '#E35000', r: 3, strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Savings by Category — 1/4 — Pie chart */}
        <Card className="border-none shadow-md bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C]">
          <CardHeader className={cardHead}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <CardTitle className="text-[#0E2250] dark:text-white text-base sm:text-[18px] transition-colors duration-300">By Category</CardTitle>
                <div className="group/tooltip relative">
                  <Info className="w-4 h-4 text-gray-400 cursor-help flex-shrink-0" />
                  <div className="absolute top-full right-0 mt-2 hidden group-hover/tooltip:block w-52 z-50 pointer-events-none">
                    <div className="bg-gray-900 dark:bg-[#0A0A0A] text-white text-xs rounded-lg p-3 shadow-xl border border-transparent dark:border-[#2A2A2A]">
                      <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900 dark:bg-[#0A0A0A] rotate-45" />
                      Breakdown of employee savings by spend category this month.
                    </div>
                  </div>
                </div>
              </div>
              <ExportBtn />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-3 flex flex-col items-center">
            <div className="w-full" style={{ height: 180 }}>
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={CATEGORIES}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={72}
                      paddingAngle={3}
                      dataKey="amount"
                      nameKey="label"
                    >
                      {CATEGORIES.map((cat) => (
                        <Cell key={cat.label} fill={cat.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={ttStyle.contentStyle}
                      labelStyle={ttStyle.labelStyle}
                      itemStyle={ttStyle.itemStyle}
                      formatter={(v: number, name: string) => [fmtShort(v), name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="space-y-1.5 w-full mt-1">
              {CATEGORIES.map(({ label, amount, color }) => (
                <div key={label} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-gray-600 dark:text-gray-300">{label}</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white tabular-nums">
                    {((amount / totalCat) * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Trend Report ── */}
      <Card className="border-none shadow-md bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C]">
        <CardHeader className={cardHead}>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <CardTitle className="text-[#0E2250] dark:text-white text-base sm:text-[18px] transition-colors duration-300">
                  Trend Report
                </CardTitle>
                <div className="group/tooltip relative">
                  <Info className="w-4 h-4 text-gray-400 cursor-help flex-shrink-0" />
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover/tooltip:block w-72 z-50 pointer-events-none">
                    <div className="bg-gray-900 dark:bg-[#0A0A0A] text-white text-xs rounded-lg p-3 shadow-xl border border-transparent dark:border-[#2A2A2A]">
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-[#0A0A0A] rotate-45" />
                      <p className="font-semibold mb-1">Three metrics in one view:</p>
                      <p className="text-white/70 leading-relaxed"><span className="text-emerald-400 font-medium">Savings Growth</span> — total LKR saved each month (left axis). <span className="text-blue-400 font-medium">Activation Rate</span> — % of enrolled employees who activated. <span className="text-teal-400 font-medium">Redemption Rate</span> — % who used QPON at least once (right axis).</p>
                    </div>
                  </div>
                </div>
              </div>
              <ExportBtn />
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-emerald-400 opacity-80" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Employee Savings Growth</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-8 h-0.5 rounded-full bg-blue-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Activation Rate</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-8 h-0.5 rounded-full bg-teal-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Redemption Rate</span>
              </div>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 ml-auto">Last 12 Months · {combinedChartTrend.length} months</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-5 pt-4">
          <div style={{ height: 240, minHeight: 240 }}>
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={combinedChartTrend} margin={{ top: 5, right: 52, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradCombinedSavings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#10B981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#2A2A2A' : '#f0f0f0'} vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tickFormatter={(v: number) => v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : `${v/1000}k`} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={52} />
                  <YAxis yAxisId="right" orientation="right" domain={[60, 100]} tickFormatter={(v: number) => `${v}%`} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={38} />
                  <Tooltip
                    contentStyle={ttStyle.contentStyle}
                    labelStyle={ttStyle.labelStyle}
                    itemStyle={ttStyle.itemStyle}
                    cursor={ttStyle.cursor}
                    formatter={(value: number, name: string) => {
                      if (name === 'Employee Savings Growth') return [fmtShort(value), name];
                      return [`${value}%`, name];
                    }}
                  />
                  <Area yAxisId="left" type="monotone" dataKey="savings" name="Employee Savings Growth" stroke="#10B981" strokeWidth={2} fill="url(#gradCombinedSavings)" dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }} activeDot={{ r: 5, fill: '#10B981', stroke: isDark ? '#141414' : '#fff', strokeWidth: 2 }} />
                  <Line yAxisId="right" type="monotone" dataKey="activation" name="Activation Rate"  stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6', r: 3, strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }} />
                  <Line yAxisId="right" type="monotone" dataKey="redemption" name="Redemption Rate" stroke="#14B8A6" strokeWidth={2} dot={{ fill: '#14B8A6', r: 3, strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }} />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>
          {combinedChartTrend.length > 1 && (
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-[#2A2A2A] grid grid-cols-3 gap-4 text-[10px] text-gray-400">
              <div>
                <p>Cumulative savings</p>
                <p className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs mt-0.5">{fmtShort(chartTrend.reduce((a, b) => a + b.savings, 0))}</p>
              </div>
              <div>
                <p>Activation</p>
                <p className="font-semibold text-blue-600 dark:text-blue-400 text-xs mt-0.5">
                  {ACTIVATION_TREND[0]?.rate ?? '–'}% → {ACTIVATION_TREND[ACTIVATION_TREND.length - 1]?.rate ?? '–'}%
                </p>
              </div>
              <div>
                <p>Redemption</p>
                <p className="font-semibold text-teal-600 dark:text-teal-400 text-xs mt-0.5">
                  {REDEMPTION_TREND[0]?.rate ?? '–'}% → {REDEMPTION_TREND[REDEMPTION_TREND.length - 1]?.rate ?? '–'}%
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Department Breakdown + Top 10 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Department Breakdown */}
        <Card className="border-none shadow-md bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C]">
          <CardHeader className={cardHead}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <CardTitle className="text-[#0E2250] dark:text-white text-base sm:text-[18px] transition-colors duration-300">Department Breakdown</CardTitle>
                <div className="group/tooltip relative">
                  <Info className="w-4 h-4 text-gray-400 cursor-help flex-shrink-0" />
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover/tooltip:block w-64 z-50 pointer-events-none">
                    <div className="bg-gray-900 dark:bg-[#0A0A0A] text-white text-xs rounded-lg p-3 shadow-xl border border-transparent dark:border-[#2A2A2A]">
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-[#0A0A0A] rotate-45" />
                      See which teams are saving the most. Click any column to sort. Redemption colour: green ≥ 90%, amber ≥ 80%, red below.
                    </div>
                  </div>
                </div>
              </div>
              <ExportBtn />
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-[#2A2A2A] bg-gray-50/50 dark:bg-white/2">
                  <DeptColHeader col="name"           label="Department" />
                  <DeptColHeader col="employees"      label="Emp"        right />
                  <DeptColHeader col="totalSavings"   label="Saved"      right />
                  <DeptColHeader col="redemptionRate" label="Redemp."    right />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-[#2A2A2A]">
                {sortedDepts.map((dept, idx) => (
                  <tr key={dept.name} className="hover:bg-gray-50 dark:hover:bg-white/2 transition-colors">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        {deptSortKey === 'totalSavings' && idx === 0 && <span className="text-amber-500 text-sm">🏆</span>}
                        <span className="font-medium text-gray-900 dark:text-white text-xs">{dept.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right text-gray-600 dark:text-gray-300 text-xs">{dept.employees}</td>
                    <td className="px-3 py-3 text-right font-semibold text-gray-900 dark:text-white text-xs">{fmtShort(dept.totalSavings)}</td>
                    <td className="px-3 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <div className="w-10 h-1.5 rounded-full bg-gray-100 dark:bg-[#2A2A2A] overflow-hidden hidden sm:block">
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${dept.redemptionRate}%`, backgroundColor: dept.redemptionRate >= 90 ? '#10B981' : dept.redemptionRate >= 80 ? '#F59E0B' : '#EF4444' }} />
                        </div>
                        <span className={cn('text-xs font-semibold', dept.redemptionRate >= 90 ? 'text-emerald-600 dark:text-emerald-400' : dept.redemptionRate >= 80 ? 'text-amber-600 dark:text-amber-400' : 'text-red-500')}>
                          {dept.redemptionRate}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Top 10 */}
        <Card className="border-none shadow-md bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C]">
          <CardHeader className={cardHead}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <CardTitle className="text-[#0E2250] dark:text-white text-base sm:text-[18px] transition-colors duration-300">Top 10 — Savings This Month</CardTitle>
                <div className="group/tooltip relative">
                  <Info className="w-4 h-4 text-gray-400 cursor-help flex-shrink-0" />
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover/tooltip:block w-60 z-50 pointer-events-none">
                    <div className="bg-gray-900 dark:bg-[#0A0A0A] text-white text-xs rounded-lg p-3 shadow-xl border border-transparent dark:border-[#2A2A2A]">
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-[#0A0A0A] rotate-45" />
                      Employees who saved the most this month. Toggle anonymise to hide names when sharing with stakeholders.
                    </div>
                  </div>
                </div>
              </div>
              <ExportBtn />
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-4">
            <div className="space-y-3">
              {TOP10.map(emp => {
                const barPct    = (emp.savings / TOP10[0].savings) * 100;
                const rankColor = emp.rank === 1 ? 'bg-amber-400 text-amber-900' : emp.rank === 2 ? 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-100' : emp.rank === 3 ? 'bg-orange-300 dark:bg-orange-700 text-orange-900 dark:text-orange-100' : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400';
                const barColor  = emp.rank === 1 ? '#F59E0B' : emp.rank <= 3 ? '#10B981' : '#6EE7B7';
                return (
                  <div key={emp.rank} className="flex items-center gap-3">
                    <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0', rankColor)}>{emp.rank}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{emp.name}</span>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 flex-shrink-0 hidden sm:inline">{emp.department}</span>
                          <Medal className="w-3 h-3 text-amber-500 flex-shrink-0" />
                        </div>
                        <span className="text-xs font-semibold text-gray-900 dark:text-white flex-shrink-0 ml-2 tabular-nums">{fmtFull(emp.savings)}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-100 dark:bg-[#2A2A2A] overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${barPct}%`, backgroundColor: barColor }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Employee Breakdown ── */}
      <EmployeeBreakdown />
    </div>
  );
}

function EmployeeBreakdown() {
  const [deptFilter, setDeptFilter] = useState('All');
  const [tierFilter, setTierFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const departments = ['All', ...Array.from(new Set(EMP_BREAKDOWN.map(r => r.department))).sort()];
  const tiers = ['All', 'Bronze', 'Silver', 'Gold'];

  const filtered = useMemo(() => EMP_BREAKDOWN.filter(r =>
    (deptFilter === 'All' || r.department === deptFilter) &&
    (tierFilter === 'All' || r.tier === tierFilter) &&
    (searchQuery === '' || r.name.toLowerCase().includes(searchQuery.toLowerCase()))
  ), [deptFilter, tierFilter, searchQuery]);

  const tierColor = (t: string) =>
    t === 'Gold' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
    : t === 'Bronze' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300'
    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300';

  const cardHead = 'border-b border-gray-100 dark:border-[#2A2A2A] bg-gradient-to-r from-gray-50 to-white dark:from-[#0A0A0A] dark:to-[#141414] transition-colors duration-300 pt-4 pb-3 px-5';

  return (
    <Card className="border-none shadow-md bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C]">
      <CardHeader className={cardHead}>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <CardTitle className="text-[#0E2250] dark:text-white text-base sm:text-[18px] transition-colors duration-300">Employee Breakdown</CardTitle>
            <div className="group/tooltip relative">
              <Info className="w-4 h-4 text-gray-400 cursor-help flex-shrink-0" />
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover/tooltip:block w-64 z-50 pointer-events-none">
                <div className="bg-gray-900 dark:bg-[#0A0A0A] text-white text-xs rounded-lg p-3 shadow-xl border border-transparent dark:border-[#2A2A2A]">
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-[#0A0A0A] rotate-45" />
                  Per-employee QPONs usage and last redemption date for the selected period.
                </div>
              </div>
            </div>
          </div>
          <ExportBtn />
        </div>
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name…"
              className="text-xs pl-8 pr-3 py-1.5 w-44 rounded-lg border border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#1C1C1C] text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:border-[#E35000] transition-colors"
            />
          </div>
          {/* Department filter */}
          <div className="relative flex-shrink-0">
            <select
              value={deptFilter}
              onChange={e => setDeptFilter(e.target.value)}
              className="appearance-none text-xs pl-3 pr-8 py-1.5 rounded-lg border border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#1C1C1C] text-gray-700 dark:text-gray-300 focus:outline-none focus:border-[#E35000] cursor-pointer transition-colors"
            >
              {departments.map(d => <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
          {/* Tier filter */}
          <div className="relative flex-shrink-0">
            <select
              value={tierFilter}
              onChange={e => setTierFilter(e.target.value)}
              className="appearance-none text-xs pl-3 pr-8 py-1.5 rounded-lg border border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#1C1C1C] text-gray-700 dark:text-gray-300 focus:outline-none focus:border-[#E35000] cursor-pointer transition-colors"
            >
              {tiers.map(t => <option key={t} value={t}>{t === 'All' ? 'All Tiers' : t}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-[#2A2A2A] bg-gray-50/50 dark:bg-white/2">
              {['Name', 'Department', 'Tier', 'QPONs Used', 'Last Redemption'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-[#2A2A2A]">
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-gray-400">No employees match the selected filters.</td></tr>
            ) : filtered.map(row => (
              <tr key={row.name} className="hover:bg-gray-50 dark:hover:bg-white/2 transition-colors">
                <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white">{row.name}</td>
                <td className="px-5 py-3.5 text-gray-600 dark:text-gray-400 text-xs">{row.department}</td>
                <td className="px-5 py-3.5">
                  <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider', tierColor(row.tier))}>
                    {row.tier}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-gray-100 dark:bg-[#2A2A2A] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#E35000]"
                        style={{ width: `${(row.qponsUsed / 30) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-gray-900 dark:text-white tabular-nums">{row.qponsUsed}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-gray-600 dark:text-gray-400 text-xs tabular-nums">{row.lastRedemption}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

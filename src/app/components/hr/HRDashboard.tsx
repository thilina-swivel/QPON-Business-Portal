import React from 'react';
import {
  Users, UserCheck, UserX, TrendingUp, Wallet, BarChart3,
  RefreshCw, Send, ChevronRight, ChevronLeft, ChevronDown, Activity, FileText, CreditCard,
  Star, Zap, Clock, CheckCircle2, ArrowUpRight, Building2,
  BadgeCheck, AlertCircle, ReceiptText, Medal, CalendarDays,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { cn } from '../../lib/utils';

type HRDashboardState = 'populated' | 'loading' | 'empty';

interface HRDashboardProps {
  onNavigate?: (view: string) => void;
}

// ── Demo data ────────────────────────────────────────────────────────────────

const COMPANY = 'Cinnamon Hotels & Resorts';
const CURRENT_MONTH = 'May 2026';

const kpiData = {
  totalSeats: { silver: 600, gold: 250, total: 850 },
  activated: 812,
  pending: 38,
  totalSavings: 3591000,
  avgSaving: 4421,
  cost: 510000,
  ratioSavings: 1785000,
  ratio: 3.5,
};

const activityFeed = [
  { id: 1,  type: 'activation', message: 'Nimal Perera activated their account',           time: '2 min ago',   icon: UserCheck },
  { id: 2,  type: 'upgrade',    message: 'Kavindi Silva upgraded to Gold',                  time: '14 min ago',  icon: Medal },
  { id: 3,  type: 'report',     message: 'Monthly savings report sent to HR team',          time: '1 hr ago',    icon: FileText },
  { id: 4,  type: 'activation', message: 'Dilshan Wickramasinghe activated their account', time: '1 hr ago',    icon: UserCheck },
  { id: 5,  type: 'invoice',    message: 'Invoice #INV-0512 generated — LKR 510,000',      time: '3 hr ago',    icon: ReceiptText },
  { id: 6,  type: 'activation', message: 'Amaya Fernando activated their account',         time: '5 hr ago',    icon: UserCheck },
  { id: 7,  type: 'upgrade',    message: 'Ruwan Jayawardena upgraded to Gold',             time: '8 hr ago',    icon: Medal },
  { id: 8,  type: 'activation', message: 'Thilini Rathnayaka activated their account',    time: '10 hr ago',   icon: UserCheck },
  { id: 9,  type: 'resend',     message: 'Activation links resent to 12 employees',        time: '1 day ago',   icon: Send },
  { id: 10, type: 'admin',      message: 'Admin updated company billing address',          time: '2 days ago',  icon: Building2 },
];

const feedIconColor: Record<string, string> = {
  activation: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
  upgrade:    'bg-amber-50  dark:bg-amber-900/30  text-amber-600  dark:text-amber-400',
  report:     'bg-blue-50   dark:bg-blue-900/30   text-blue-600   dark:text-blue-400',
  invoice:    'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  resend:     'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
  admin:      'bg-gray-100  dark:bg-gray-800      text-gray-600   dark:text-gray-400',
};

// ── Skeleton Loading State ───────────────────────────────────────────────────

function HRDashboardSkeleton() {
  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 bg-gray-200 dark:bg-[#1C1C1C]" />
          <Skeleton className="h-4 w-48 bg-gray-200 dark:bg-[#1C1C1C]" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-36 rounded-lg bg-gray-200 dark:bg-[#1C1C1C]" />
          <Skeleton className="h-9 w-24 rounded-lg bg-gray-200 dark:bg-[#1C1C1C]" />
        </div>
      </div>

      {/* KPI skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className={cn("border-none shadow-md bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C]", i === 5 ? 'xl:col-span-1' : '')}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <Skeleton className="h-10 w-10 rounded-xl bg-gray-200 dark:bg-[#2A2A2A]" />
                <Skeleton className="h-5 w-14 rounded-full bg-gray-200 dark:bg-[#2A2A2A]" />
              </div>
              <Skeleton className="h-3 w-20 mb-2 bg-gray-200 dark:bg-[#2A2A2A]" />
              <Skeleton className="h-7 w-28 bg-gray-200 dark:bg-[#2A2A2A]" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activation bar skeleton */}
      <Card className="border-none shadow-md bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C]">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <Skeleton className="h-5 w-40 bg-gray-200 dark:bg-[#2A2A2A]" />
            <Skeleton className="h-8 w-32 rounded-lg bg-gray-200 dark:bg-[#2A2A2A]" />
          </div>
          <Skeleton className="h-3 w-full rounded-full bg-gray-200 dark:bg-[#2A2A2A]" />
        </CardContent>
      </Card>

      {/* Feed + shortcuts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-md bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C]">
          <CardHeader><Skeleton className="h-5 w-28 bg-gray-200 dark:bg-[#2A2A2A]" /></CardHeader>
          <CardContent className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 pb-3 border-b border-gray-50 dark:border-[#2A2A2A] last:border-0">
                <Skeleton className="h-8 w-8 rounded-full flex-shrink-0 bg-gray-200 dark:bg-[#2A2A2A]" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-52 bg-gray-200 dark:bg-[#2A2A2A]" />
                  <Skeleton className="h-3 w-16 bg-gray-200 dark:bg-[#2A2A2A]" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-none shadow-md bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C]">
          <CardHeader><Skeleton className="h-5 w-32 bg-gray-200 dark:bg-[#2A2A2A]" /></CardHeader>
          <CardContent className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl bg-gray-200 dark:bg-[#2A2A2A]" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ── Empty State ──────────────────────────────────────────────────────────────

function HRDashboardEmpty({ onNavigate }: { onNavigate?: (v: string) => void }) {
  const steps = [
    { n: 1, label: 'Upload your employee roster', desc: 'Import names, emails, and seat tiers via CSV or add manually.', done: false },
    { n: 2, label: 'Assign Silver & Gold seats',   desc: 'Allocate seat types to match your benefit tiers.',              done: false },
    { n: 3, label: 'Send activation links',        desc: 'One click sends personalised WhatsApp links to all employees.',  done: false },
  ];

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0E2250] dark:text-white">{COMPANY} — HR Portal</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">No employees set up yet</p>
        </div>
      </div>

      {/* Zeroed KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: 'Total Seats',        value: '—',   icon: Users,        bg: 'bg-gradient-to-br from-blue-500 to-blue-600',    border: 'border-l-blue-500' },
          { label: 'Activated',          value: '0',   icon: UserCheck,    bg: 'bg-gradient-to-br from-emerald-500 to-emerald-600', border: 'border-l-emerald-500' },
          { label: 'Pending',            value: '—',   icon: UserX,        bg: 'bg-gradient-to-br from-[#E35000] to-[#FF6B35]', border: 'border-l-orange-500' },
          { label: 'Staff Savings',      value: 'LKR 0', icon: Wallet,     bg: 'bg-gradient-to-br from-teal-500 to-teal-600',   border: 'border-l-teal-500' },
          { label: 'Avg per Employee',   value: '—',   icon: TrendingUp,   bg: 'bg-gradient-to-br from-violet-500 to-violet-600', border: 'border-l-violet-500' },
          { label: 'ROI Ratio',          value: '—:—', icon: BarChart3,    bg: 'bg-gradient-to-br from-amber-500 to-amber-600',  border: 'border-l-amber-500' },
        ].map((c, i) => (
          <Card key={i} className={`border-none shadow-sm border-l-4 ${c.border} bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C] opacity-60`}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${c.bg} shadow-md`}><c.icon className="w-4 h-4 text-white" /></div>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 px-2 py-0.5 bg-gray-100 dark:bg-[#2A2A2A] rounded-full">No data</span>
              </div>
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-1">{c.label}</p>
              <p className="text-xl font-bold text-gray-300 dark:text-gray-600">{c.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main empty CTA */}
      <Card className="border-none shadow-lg bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C]">
        <CardContent className="flex flex-col items-center justify-center py-16 px-8 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#E35000]/10 to-[#FF6B35]/10 dark:from-[#E35000]/20 flex items-center justify-center mb-6">
            <Users className="w-10 h-10 text-[#E35000]" />
          </div>
          <h3 className="text-xl font-bold text-[#0E2250] dark:text-white mb-2">Set up your employee benefit</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mb-10 leading-relaxed">
            Add your team to start tracking activations, savings, and your ROI. It takes less than 5 minutes.
          </p>

          {/* Setup steps */}
          <div className="w-full max-w-lg space-y-3 mb-8">
            {steps.map((s) => (
              <div key={s.n} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 dark:border-[#2A2A2A] text-left">
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#2A2A2A] flex items-center justify-center flex-shrink-0 text-sm font-bold text-gray-400 dark:text-gray-500">{s.n}</div>
                <div>
                  <p className="font-semibold text-[#0E2250] dark:text-white text-sm">{s.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate?.('hr-employees')}
            className="flex items-center gap-2 px-6 py-3 bg-[#E35000] hover:bg-[#c44500] text-white rounded-lg transition-all text-sm font-medium shadow-lg shadow-orange-500/20"
          >
            <Users className="w-4 h-4" />
            Add Employees to Get Started
          </button>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Main (Populated) Dashboard ───────────────────────────────────────────────

const hrPresets = [
  { value: 'thismonth',    label: 'This Month' },
  { value: 'lastmonth',    label: 'Last Month' },
  { value: 'last3months',  label: 'Last 3 Months' },
  { value: 'thisyear',     label: 'This Year' },
];

export function HRDashboard({ onNavigate }: HRDashboardProps) {
  const [dashboardState] = React.useState<HRDashboardState>('populated');
  const [lastRefreshed, setLastRefreshed] = React.useState('Just now');
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Date picker state
  const [dateRange, setDateRange] = React.useState('thismonth');
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear());
  const [selectedStartDate, setSelectedStartDate] = React.useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = React.useState<Date | null>(null);
  const [hoverDate, setHoverDate] = React.useState<Date | null>(null);

  const getDateRangeDisplay = () => {
    if (dateRange === 'custom' && selectedStartDate) {
      const fmt = (d: Date) => {
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
      };
      return selectedEndDate
        ? `${fmt(selectedStartDate)} – ${fmt(selectedEndDate)}`
        : fmt(selectedStartDate);
    }
    return hrPresets.find((p) => p.value === dateRange)?.label ?? 'This Month';
  };

  const handlePresetSelect = (preset: string) => {
    setDateRange(preset);
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setShowDatePicker(false);
  };

  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const isSameDay = (d1: Date | null, d2: Date | null) => {
    if (!d1 || !d2) return false;
    return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
  };

  const isInRange = (date: Date) => {
    if (!selectedStartDate) return false;
    const end = hoverDate && !selectedEndDate ? hoverDate : selectedEndDate;
    if (!end) return false;
    const start = selectedStartDate < end ? selectedStartDate : end;
    const endD = selectedStartDate < end ? end : selectedStartDate;
    return date >= start && date <= endD;
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
      if (clicked < selectedStartDate) {
        setSelectedEndDate(selectedStartDate);
        setSelectedStartDate(clicked);
      } else {
        setSelectedEndDate(clicked);
      }
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    for (let i = 0; i < firstDay; i++) days.push(<div key={`e-${i}`} />);

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isSelected = isRangeStart(date);
      const inRange = isInRange(date);
      const isToday = isSameDay(date, new Date());
      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          onMouseEnter={() => setHoverDate(date)}
          onMouseLeave={() => setHoverDate(null)}
          className={cn(
            'h-7 text-xs transition-colors relative',
            isSelected ? 'bg-[#E35000] text-white font-semibold rounded-md z-10' :
            inRange ? 'bg-orange-50 dark:bg-orange-900/30 text-[#E35000] dark:text-orange-300' :
            isToday ? 'font-semibold text-[#E35000] dark:text-orange-400' :
            'hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200'
          )}
        >
          {day}
        </button>
      );
    }

    return (
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => {
              if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y: number) => y - 1); }
              else setCurrentMonth((m: number) => m - 1);
            }}
            className="p-0.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-200" />
          </button>
          <div className="flex items-center gap-2">
            <select
              value={currentMonth}
              onChange={(e) => setCurrentMonth(Number(e.target.value))}
              className="text-xs font-medium text-gray-700 dark:text-white bg-transparent border-none focus:outline-none cursor-pointer"
            >
              {monthNames.map((m, i) => <option key={i} value={i}>{m}</option>)}
            </select>
            <select
              value={currentYear}
              onChange={(e) => setCurrentYear(Number(e.target.value))}
              className="text-xs font-medium text-gray-700 dark:text-white bg-transparent border-none focus:outline-none cursor-pointer"
            >
              {Array.from({ length: 10 }, (_, i) => currentYear - 5 + i).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => {
              if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y: number) => y + 1); }
              else setCurrentMonth((m: number) => m + 1);
            }}
            className="p-0.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-200" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-0.5 mb-1">
          {dayNames.map((d, i) => (
            <div key={i} className="text-center text-[10px] font-medium text-gray-400 py-1">{d}</div>
          ))}
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

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshed('Just now');
    }, 1200);
  };

  const activationPct = Math.round((kpiData.activated / kpiData.totalSeats.total) * 100);

  if (dashboardState === 'loading') return <HRDashboardSkeleton />;
  if (dashboardState === 'empty') return <HRDashboardEmpty onNavigate={onNavigate} />;

  return (
    <div className="space-y-6 pb-20 lg:pb-0">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0E2250] dark:text-white">{COMPANY}</h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm text-gray-500 dark:text-gray-400">{CURRENT_MONTH}</span>
            <span className="text-gray-300 dark:text-gray-600">·</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs text-gray-400 dark:text-gray-500">Refreshed {lastRefreshed}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Date range picker */}
          <div className="relative">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#2A2A2A] rounded-lg hover:bg-gray-50 dark:hover:bg-[#1C1C1C] transition-colors text-sm text-gray-600 dark:text-gray-300"
            >
              <CalendarDays className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span>{getDateRangeDisplay()}</span>
              <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform", showDatePicker && "rotate-180")} />
            </button>

            {showDatePicker && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowDatePicker(false)} />
                <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C] rounded-lg shadow-2xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.7)] border border-gray-200 dark:border-[#2A2A2A] overflow-hidden z-50 flex w-[360px]">
                  {/* Presets */}
                  <div className="w-36 bg-gray-50 dark:bg-[#0A0A0A] border-r border-gray-200 dark:border-[#2A2A2A] p-1.5 flex-shrink-0">
                    {hrPresets.map((preset) => (
                      <button
                        key={preset.value}
                        onClick={() => handlePresetSelect(preset.value)}
                        className={cn(
                          'w-full text-left px-2 py-1.5 rounded text-xs transition-colors',
                          dateRange === preset.value && !selectedStartDate
                            ? 'bg-[#E35000] text-white font-medium'
                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10'
                        )}
                      >
                        {preset.label}
                      </button>
                    ))}
                    <div className="my-1.5 border-t border-gray-200 dark:border-[#2A2A2A]" />
                    <button
                      onClick={() => setDateRange('custom')}
                      className={cn(
                        'w-full text-left px-2 py-1.5 rounded text-xs transition-colors',
                        dateRange === 'custom' && selectedStartDate
                          ? 'bg-[#E35000] text-white font-medium'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10'
                      )}
                    >
                      Custom Range
                    </button>
                  </div>

                  {/* Calendar */}
                  <div className="flex-1 min-w-0">
                    {renderCalendar()}
                    <div className="flex gap-2 px-3 pb-3">
                      <Button
                        className="flex-1 bg-gray-100 dark:bg-[#2A2A2A] hover:bg-gray-200 dark:hover:bg-[#1C1C1C] text-gray-700 dark:text-white border-none text-xs py-1.5"
                        onClick={() => {
                          setSelectedStartDate(null);
                          setSelectedEndDate(null);
                          setShowDatePicker(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="flex-1 bg-[#E35000] hover:bg-[#c44500] text-white border-none text-xs py-1.5"
                        onClick={() => {
                          if (selectedStartDate) {
                            setDateRange('custom');
                            setShowDatePicker(false);
                          }
                        }}
                        disabled={!selectedStartDate}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Refresh */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-[#2A2A2A] rounded-lg hover:bg-gray-50 dark:hover:bg-[#1C1C1C] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">

        {/* 1 — Total Seats */}
        <Card className="border-none shadow-lg border-l-4 border-l-blue-500 bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C] overflow-hidden group hover:shadow-xl transition-all duration-300">
          <CardContent className="p-5 relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 dark:bg-transparent rounded-full blur-2xl opacity-40 -mr-8 -mt-8 group-hover:opacity-60 transition-opacity" />
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg"><Users className="w-4 h-4 text-white" /></div>
            </div>
            <p className="text-[10px] font-semibold text-gray-400 dark:text-blue-300/60 uppercase tracking-widest mb-1">Total Seats</p>
            <p className="text-2xl font-bold text-[#0E2250] dark:text-white mb-2">{kpiData.totalSeats.total.toLocaleString()}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-[#2A2A2A] text-gray-500 dark:text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />Silver {kpiData.totalSeats.silver}
              </span>
              <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />Gold {kpiData.totalSeats.gold}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* 2 — Activated */}
        <Card className="border-none shadow-lg border-l-4 border-l-emerald-500 bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C] overflow-hidden group hover:shadow-xl transition-all duration-300">
          <CardContent className="p-5 relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-50 dark:bg-transparent rounded-full blur-2xl opacity-40 -mr-8 -mt-8 group-hover:opacity-60 transition-opacity" />
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg"><UserCheck className="w-4 h-4 text-white" /></div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">{activationPct}%</span>
            </div>
            <p className="text-[10px] font-semibold text-gray-400 dark:text-blue-300/60 uppercase tracking-widest mb-1">Activated</p>
            <p className="text-2xl font-bold text-[#0E2250] dark:text-white">{kpiData.activated.toLocaleString()}</p>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">of {kpiData.totalSeats.total} employees</p>
          </CardContent>
        </Card>

        {/* 3 — Pending */}
        <Card className="border-none shadow-lg border-l-4 border-l-orange-500 bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C] overflow-hidden group hover:shadow-xl transition-all duration-300">
          <CardContent className="p-5 relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-orange-50 dark:bg-transparent rounded-full blur-2xl opacity-40 -mr-8 -mt-8 group-hover:opacity-60 transition-opacity" />
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#E35000] to-[#FF6B35] shadow-lg"><UserX className="w-4 h-4 text-white" /></div>
              <button className="flex items-center gap-1 text-[10px] font-semibold text-[#E35000] hover:text-[#c44500] bg-orange-50 dark:bg-[#E35000]/10 px-2 py-1 rounded-full transition-colors">
                <Send className="w-2.5 h-2.5" />Resend All
              </button>
            </div>
            <p className="text-[10px] font-semibold text-gray-400 dark:text-blue-300/60 uppercase tracking-widest mb-1">Pending</p>
            <p className="text-2xl font-bold text-[#0E2250] dark:text-white">{kpiData.pending}</p>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">not yet activated</p>
          </CardContent>
        </Card>

        {/* 4 — Total Staff Savings */}
        <Card className="border-none shadow-lg border-l-4 border-l-teal-500 bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C] overflow-hidden group hover:shadow-xl transition-all duration-300">
          <CardContent className="p-5 relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-teal-50 dark:bg-transparent rounded-full blur-2xl opacity-40 -mr-8 -mt-8 group-hover:opacity-60 transition-opacity" />
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 shadow-lg"><Wallet className="w-4 h-4 text-white" /></div>
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                <TrendingUp className="w-3 h-3" />+12%
              </div>
            </div>
            <p className="text-[10px] font-semibold text-gray-400 dark:text-blue-300/60 uppercase tracking-widest mb-1">Staff Savings</p>
            <p className="text-lg font-bold text-[#0E2250] dark:text-white">LKR {(kpiData.totalSavings / 1000).toFixed(0)}K</p>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">this month</p>
          </CardContent>
        </Card>

        {/* 5 — Average Saving */}
        <Card className="border-none shadow-lg border-l-4 border-l-violet-500 bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C] overflow-hidden group hover:shadow-xl transition-all duration-300">
          <CardContent className="p-5 relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-violet-50 dark:bg-transparent rounded-full blur-2xl opacity-40 -mr-8 -mt-8 group-hover:opacity-60 transition-opacity" />
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 shadow-lg"><Star className="w-4 h-4 text-white" /></div>
            </div>
            <p className="text-[10px] font-semibold text-gray-400 dark:text-blue-300/60 uppercase tracking-widest mb-1">Avg / Employee</p>
            <p className="text-lg font-bold text-[#0E2250] dark:text-white">LKR {kpiData.avgSaving.toLocaleString()}</p>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">per person this month</p>
          </CardContent>
        </Card>

        {/* 6 — ROI Ratio (prominent) */}
        <Card className="border-none shadow-xl border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-500 to-amber-600 overflow-hidden group hover:shadow-2xl transition-all duration-300 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-transparent" />
          <CardContent className="p-5 relative z-10">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-white/20 shadow-md"><BarChart3 className="w-4 h-4 text-white" /></div>
              <span className="text-[10px] font-bold text-white/80 bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wide">ROI</span>
            </div>
            <p className="text-[10px] font-semibold text-white/70 uppercase tracking-widest mb-1">Cost vs Savings</p>
            <p className="text-3xl font-black text-white mb-1">{kpiData.ratio}:1</p>
            <div className="space-y-0.5">
              <p className="text-[10px] text-white/70">Cost: LKR {(kpiData.cost / 1000).toFixed(0)}K</p>
              <p className="text-[10px] text-white/90 font-semibold">Savings: LKR {(kpiData.ratioSavings / 1000).toFixed(0)}K</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Activation Summary Bar ── */}
      <Card className="border-none shadow-lg bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C]">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-semibold text-[#0E2250] dark:text-white">Activation Progress</h3>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-xs text-gray-400 dark:text-gray-500">Live</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                <span className="font-semibold text-[#E35000]">{kpiData.pending} pending</span>
              </span>
              <button className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#E35000] hover:bg-[#c44500] px-3 py-1.5 rounded-lg transition-colors shadow-sm">
                <Send className="w-3 h-3" />Resend {kpiData.pending} links
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{kpiData.activated.toLocaleString()} activated</span>
              <span className="font-semibold text-[#0E2250] dark:text-white">{activationPct}%</span>
              <span>{kpiData.totalSeats.total.toLocaleString()} total</span>
            </div>
            <div className="h-3 bg-gray-100 dark:bg-[#2A2A2A] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-700"
                style={{ width: `${activationPct}%` }}
              />
            </div>
            <div className="flex items-center gap-4 text-[10px] text-gray-400 dark:text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />Activated ({kpiData.activated})</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-200 dark:bg-[#3A3A3A] inline-block" />Pending ({kpiData.pending})</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Activity Feed + Quick Nav ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Activity Feed */}
        <Card className="lg:col-span-2 border-none shadow-lg bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C]">
          <CardHeader className="border-b border-gray-100 dark:border-[#2A2A2A]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-[#0E2250] dark:text-white text-base">Activity Feed</CardTitle>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-xs text-gray-400 dark:text-gray-500">Live</span>
                </div>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500">Last 10 events</span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-50 dark:divide-[#2A2A2A]">
              {activityFeed.map((event) => {
                const Icon = event.icon;
                const colorClass = feedIconColor[event.type] ?? feedIconColor.admin;
                return (
                  <div key={event.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <div className={cn("p-2 rounded-full flex-shrink-0", colorClass)}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <p className="flex-1 text-sm text-[#0E2250] dark:text-gray-200 leading-snug">{event.message}</p>
                    <span className="text-[11px] text-gray-400 dark:text-gray-500 whitespace-nowrap flex-shrink-0">{event.time}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Navigation */}
        <div className="space-y-4">
          <Card className="border-none shadow-lg bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C]">
            <CardHeader className="border-b border-gray-100 dark:border-[#2A2A2A]">
              <CardTitle className="text-[#0E2250] dark:text-white text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {[
                {
                  label: 'Employees',
                  desc: 'Manage roster & seats',
                  icon: Users,
                  view: 'hr-employees',
                  color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
                },
                {
                  label: 'Analytics',
                  desc: 'Savings & usage trends',
                  icon: BarChart3,
                  view: 'hr-analytics',
                  color: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400',
                },
                {
                  label: 'Billing',
                  desc: 'Invoices & plan details',
                  icon: CreditCard,
                  view: 'hr-billing',
                  color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
                },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => onNavigate?.(item.view)}
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 dark:border-[#2A2A2A] hover:border-[#E35000] hover:bg-orange-50/30 dark:hover:bg-white/5 transition-all duration-200 group"
                >
                  <div className={cn("p-2.5 rounded-lg flex-shrink-0", item.color)}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-[#0E2250] dark:text-white">{item.label}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{item.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-[#E35000] transition-colors" />
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Plan summary mini-card */}
          <Card className="border-none shadow-md bg-gradient-to-br from-[#0E2250] to-[#1a3a7a] dark:from-[#141414] dark:to-[#1C1C1C]">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <BadgeCheck className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-white/80 uppercase tracking-wide">Active Plan</span>
              </div>
              <p className="text-white font-bold text-sm mb-1">Enterprise — 850 seats</p>
              <p className="text-white/60 text-xs mb-3">Renews 1 Jun 2026</p>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-white/50">Next invoice</span>
                <span className="text-white/80 font-semibold">LKR 510,000</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import {
  Users, UserCheck, UserX, TrendingUp, Wallet, BarChart3,
  RefreshCw, Send, FileText, CreditCard,
  Star, Building2, ReceiptText, Medal, Info,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { cn } from '../../lib/utils';

type HRDashboardState = 'populated' | 'loading' | 'empty';

interface HRDashboardProps {
  onNavigate?: (view: string) => void;
}

// ── Demo data ────────────────────────────────────────────────────────────────

const COMPANY = 'Axora Technologies';
const CURRENT_MONTH = 'May 2026';

const kpiData = {
  totalSeats: { silver: 200, gold: 150, total: 500 },
  activated: 312,
  pending: 188,
  totalSavings: 3591000,
  avgSaving: 4421,
  cost: 510000,
  ratioSavings: 1785000,
  ratio: 3,
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
    { n: 3, label: 'Send activation links',        desc: 'One click sends personalised SMS links to all employees.',  done: false },
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
            className="flex items-center gap-2 px-6 py-3 bg-[#C44500] hover:bg-[#a03800] text-white rounded-lg transition-all text-sm font-medium shadow-lg shadow-orange-500/20"
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


export function HRDashboard({ onNavigate }: HRDashboardProps) {
  const [dashboardState] = React.useState<HRDashboardState>('populated');
  const [lastRefreshed, setLastRefreshed] = React.useState('Just now');
  const [isRefreshing, setIsRefreshing] = React.useState(false);


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
          <h2 className="text-2xl font-bold text-[#0E2250] dark:text-white transition-colors duration-300">{COMPANY}</h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">{CURRENT_MONTH}</span>
            <span className="text-gray-300 dark:text-gray-600">·</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs text-gray-400 dark:text-gray-500">Refreshed {lastRefreshed}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {[
          {
            icon: Users, bg: 'bg-gradient-to-br from-blue-500 to-blue-600', bgLight: 'bg-blue-50',
            border: 'border-l-blue-500',
            label: 'Total Seats', tooltip: 'Total licensed seats across all tiers (Silver + Gold).',
            value: null,
            badge: <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full"><TrendingUp className="w-3 h-3" /><span className="text-xs font-semibold">{activationPct}%</span></div>,
            sub: (
              <>
                <div className="flex items-center gap-1.5 flex-nowrap mt-1">
                  <span className="text-2xl font-bold text-[#0E2250] dark:text-white transition-colors duration-300">{kpiData.totalSeats.total.toLocaleString()}</span>
                  <span className="text-gray-300 dark:text-gray-600 text-sm">|</span>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-medium whitespace-nowrap">
                    {kpiData.activated} Activated
                  </span>
                  <span className="text-gray-300 dark:text-gray-600 text-sm">|</span>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-orange-100 dark:bg-[#E35000]/20 text-[#E35000] font-semibold ring-1 ring-[#E35000]/30 whitespace-nowrap">
                    {kpiData.pending} Pending
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" /> Next QPON refresh: Jun 1, 2026
                </p>
              </>
            ),
          },
          {
            icon: Wallet, bg: 'bg-gradient-to-br from-teal-500 to-teal-600', bgLight: 'bg-teal-50',
            border: 'border-l-teal-500',
            label: 'Staff Savings', tooltip: 'Total savings generated by activated employees this month.',
            value: `LKR ${(kpiData.totalSavings / 1000).toFixed(0)}K`,
            badge: <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full"><TrendingUp className="w-3 h-3" /><span className="text-xs font-semibold">+12%</span></div>,
            sub: <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 transition-colors duration-300">this month</p>,
          },
          {
            icon: Star, bg: 'bg-gradient-to-br from-violet-500 to-violet-600', bgLight: 'bg-violet-50',
            border: 'border-l-violet-500',
            label: 'Avg / Employee', tooltip: 'Average savings per active employee for the current month.',
            value: `LKR ${kpiData.avgSaving.toLocaleString()}`,
            badge: <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full"><TrendingUp className="w-3 h-3" /><span className="text-xs font-semibold">+5.2%</span></div>,
            sub: <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 transition-colors duration-300">per person this month</p>,
          },
          {
            icon: BarChart3, bg: 'bg-gradient-to-br from-emerald-500 to-emerald-600', bgLight: 'bg-emerald-50',
            border: 'border-l-emerald-500',
            label: 'Cost vs Savings', tooltip: 'ROI ratio: total employee savings divided by your subscription cost.',
            value: `${kpiData.ratio}:1`,
            badge: <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full"><TrendingUp className="w-3 h-3" /><span className="text-xs font-semibold">ROI</span></div>,
            sub: (
              <div className="flex items-center gap-3 mt-1">
                <p className="text-[10px] text-gray-400 dark:text-gray-500 transition-colors duration-300">Cost <span className="font-medium text-gray-600 dark:text-gray-300">LKR {(kpiData.cost / 1000).toFixed(0)}K</span></p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 transition-colors duration-300">Saved <span className="font-medium text-emerald-600 dark:text-emerald-400">LKR {(kpiData.ratioSavings / 1000).toFixed(0)}K</span></p>
              </div>
            ),
          },
        ].map((card) => (
          <Card key={card.label} className={`border-none shadow-lg hover:shadow-xl dark:shadow-2xl transition-all duration-300 overflow-hidden relative group border-l-4 ${card.border} bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C]`}>
            <div className={`absolute top-0 right-0 w-32 h-32 ${card.bgLight} dark:bg-transparent rounded-full blur-3xl opacity-30 -mr-16 -mt-16 group-hover:opacity-50 transition-opacity`} />
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
              {card.value != null && <h3 className="text-2xl font-bold text-[#0E2250] dark:text-white transition-colors duration-300">{card.value}</h3>}
              {card.sub}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Activation Summary Bar ── */}
      <Card className="border-none shadow-lg hover:shadow-xl dark:shadow-2xl transition-all duration-300 bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C]">
        <CardHeader className="border-b border-gray-100 dark:border-[#2A2A2A] bg-gradient-to-r from-gray-50 to-white dark:from-[#0A0A0A] dark:to-[#141414] transition-colors duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <CardTitle className="text-[#0E2250] dark:text-white transition-colors duration-300">Activation Progress</CardTitle>
              <div className="group/tooltip relative">
                <Info className="w-3.5 h-3.5 text-gray-400 dark:text-blue-300/50 cursor-help transition-colors duration-300" />
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover/tooltip:block w-64 z-50">
                  <div className="bg-gray-900 dark:bg-[#0A0A0A] text-white text-xs rounded-lg p-3 shadow-xl border border-transparent dark:border-gray-700">
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-[#0A0A0A] rotate-45"></div>
                    Percentage of seats where employees have activated their QPON benefit.
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                <span className="font-semibold text-[#E35000]">{kpiData.pending} pending</span>
              </span>
              <button className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#C44500] hover:bg-[#a03800] px-3 py-1.5 rounded-lg transition-colors shadow-sm">
                <Send className="w-3 h-3" />Resend {kpiData.pending} links
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5">
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
        <Card className="lg:col-span-2 border-none shadow-lg hover:shadow-xl dark:shadow-2xl transition-all duration-300 bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C]">
          <CardHeader className="border-b border-gray-100 dark:border-[#2A2A2A] bg-gradient-to-r from-gray-50 to-white dark:from-[#0A0A0A] dark:to-[#141414] transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <CardTitle className="text-[#0E2250] dark:text-white transition-colors duration-300">Recent Activity</CardTitle>
                <div className="group/tooltip relative">
                  <Info className="w-3.5 h-3.5 text-gray-400 dark:text-blue-300/50 cursor-help transition-colors duration-300" />
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover/tooltip:block w-64 z-50">
                    <div className="bg-gray-900 dark:bg-[#0A0A0A] text-white text-xs rounded-lg p-3 shadow-xl border border-transparent dark:border-gray-700">
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-[#0A0A0A] rotate-45"></div>
                      Real-time log of employee activations, upgrades, invoices, and admin actions.
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-full">
                <div className="w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Live</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5">
            <div className="space-y-4">
              {activityFeed.map((event) => {
                const Icon = event.icon;
                const colorClass = feedIconColor[event.type] ?? feedIconColor.admin;
                return (
                  <div key={event.id} className="flex items-center gap-3 border-b border-gray-50 dark:border-[#2A2A2A] last:border-0 pb-4 last:pb-0 transition-colors duration-300">
                    <div className={cn("p-2 rounded-lg flex-shrink-0", colorClass)}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#0E2250] dark:text-white text-[14px] transition-colors duration-300 leading-snug">{event.message}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 dark:text-blue-300/60 whitespace-nowrap flex-shrink-0 transition-colors duration-300">{event.time}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions + Top Employees */}
        <div className="space-y-6">
          <Card className="border-none shadow-lg hover:shadow-xl dark:shadow-2xl transition-all duration-300 bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C]">
            <CardHeader className="border-b border-gray-100 dark:border-[#2A2A2A] bg-gradient-to-r from-gray-50 to-white dark:from-[#0A0A0A] dark:to-[#141414] transition-colors duration-300">
              <CardTitle className="text-[#0E2250] dark:text-white transition-colors duration-300">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <button
                  onClick={() => onNavigate?.('hr-employees')}
                  className="w-full flex items-center gap-2 px-3 py-2 bg-[#C44500] hover:bg-[#a03800] text-white rounded-lg transition-all text-sm"
                >
                  <Users className="w-4 h-4" />
                  <span>Add Employees</span>
                </button>
                <button
                  onClick={() => onNavigate?.('hr-analytics')}
                  className="w-full flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#1C1C1C] hover:bg-gray-50 dark:hover:bg-[#141414] text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-[#2A2A2A] rounded-lg transition-all text-sm duration-300"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>View Analytics</span>
                </button>
                <button
                  onClick={() => onNavigate?.('hr-billing')}
                  className="w-full flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#1C1C1C] hover:bg-gray-50 dark:hover:bg-[#141414] text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-[#2A2A2A] rounded-lg transition-all text-sm duration-300"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Manage Billing</span>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Top 5 Performing Employees */}
          <Card className="border-none shadow-lg hover:shadow-xl dark:shadow-2xl transition-all duration-300 bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C]">
            <CardHeader className="border-b border-gray-100 dark:border-[#2A2A2A] bg-gradient-to-r from-gray-50 to-white dark:from-[#0A0A0A] dark:to-[#141414] transition-colors duration-300">
              <div className="flex items-center gap-1.5">
                <CardTitle className="text-[#0E2250] dark:text-white transition-colors duration-300">Top Performing Employees</CardTitle>
                <div className="group/tooltip relative">
                  <Info className="w-3.5 h-3.5 text-gray-400 dark:text-blue-300/50 cursor-help transition-colors duration-300" />
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover/tooltip:block w-64 z-50">
                    <div className="bg-gray-900 dark:bg-[#0A0A0A] text-white text-xs rounded-lg p-3 shadow-xl border border-transparent dark:border-gray-700">
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-[#0A0A0A] rotate-45"></div>
                      Ranked by total savings generated through coupon redemptions this month.
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { rank: 1, name: 'Nimal Perera',           tier: 'Gold',   savings: 'LKR 12,400', coupons: 32, rankBg: 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white' },
                  { rank: 2, name: 'Kavindi Silva',          tier: 'Gold',   savings: 'LKR 10,800', coupons: 28, rankBg: 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' },
                  { rank: 3, name: 'Dilshan Wickramasinghe', tier: 'Silver', savings: 'LKR 8,200',  coupons: 24, rankBg: 'bg-gradient-to-br from-orange-300 to-orange-400 text-white' },
                  { rank: 4, name: 'Amaya Fernando',         tier: 'Silver', savings: 'LKR 7,600',  coupons: 22, rankBg: 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700' },
                  { rank: 5, name: 'Ruwan Jayawardena',      tier: 'Gold',   savings: 'LKR 6,900',  coupons: 19, rankBg: 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700' },
                ].map((emp) => (
                  <div key={emp.rank} className="flex items-center gap-3 p-2.5 rounded-lg border border-gray-100 dark:border-[#2A2A2A] hover:border-[#E35000] hover:bg-orange-50/30 dark:hover:bg-white/5 transition-all duration-300">
                    <div className={`flex items-center justify-center w-7 h-7 rounded-full font-bold text-xs shadow-md flex-shrink-0 ${emp.rankBg}`}>
                      {emp.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-[#0E2250] dark:text-white text-[14px] truncate transition-colors duration-300">{emp.name}</h4>
                      <p className="text-[12px] text-gray-500 dark:text-gray-400 transition-colors duration-300">{emp.tier}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{emp.savings}</p>
                      <p className="text-[10px] text-gray-500 dark:text-blue-300/60 transition-colors duration-300">{emp.coupons} coupons</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

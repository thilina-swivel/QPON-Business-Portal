import React, { useState, useEffect } from 'react';
import {
  FileText, Download, CreditCard, TrendingUp, Mail, Bell,
  Building2, CheckCircle2, Clock, AlertTriangle,
  AlertCircle, Info, RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { cn } from '../../lib/utils';
import { useTheme } from 'next-themes@0.4.6';

// ─── Types ────────────────────────────────────────────────────────────────────

type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue';

interface Invoice {
  id: string;
  period: string;
  silver: number;
  gold: number;
  total: number;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  paidOn?: string;
  hasProration?: boolean;
}

// ─── Demo Data ────────────────────────────────────────────────────────────────

const INVOICES: Invoice[] = [
  { id: 'INV-2026-05', period: 'May 2026',      silver: 290, gold: 198, total: 600000, status: 'Pending',  issueDate: '2026-05-01', dueDate: '2026-05-31' },
  { id: 'INV-2026-04', period: 'April 2026',    silver: 285, gold: 195, total: 595200, status: 'Paid',     issueDate: '2026-04-01', dueDate: '2026-04-30', paidOn: '2026-04-18', hasProration: true },
  { id: 'INV-2026-03', period: 'March 2026',    silver: 280, gold: 192, total: 587400, status: 'Paid',     issueDate: '2026-03-01', dueDate: '2026-03-31', paidOn: '2026-03-22' },
  { id: 'INV-2026-02', period: 'February 2026', silver: 275, gold: 190, total: 580000, status: 'Paid',     issueDate: '2026-02-01', dueDate: '2026-02-28', paidOn: '2026-02-19' },
  { id: 'INV-2026-01', period: 'January 2026',  silver: 270, gold: 185, total: 568000, status: 'Paid',     issueDate: '2026-01-01', dueDate: '2026-01-31', paidOn: '2026-01-23' },
  { id: 'INV-2025-12', period: 'December 2025', silver: 265, gold: 182, total: 558600, status: 'Overdue',  issueDate: '2025-12-01', dueDate: '2025-12-31' },
  { id: 'INV-2025-11', period: 'November 2025', silver: 260, gold: 178, total: 547200, status: 'Paid',     issueDate: '2025-11-01', dueDate: '2025-11-30', paidOn: '2025-11-25' },
  { id: 'INV-2025-10', period: 'October 2025',  silver: 255, gold: 175, total: 537000, status: 'Paid',     issueDate: '2025-10-01', dueDate: '2025-10-31', paidOn: '2025-10-28' },
];

const PAYMENT_METHODS = [
  { id: 'invoice', label: 'Company Invoice',    icon: Building2,  desc: 'Monthly invoice issued on the 1st; pay by bank transfer within 30 days', gatewayNote: '' },
  { id: 'card',    label: 'Credit / Debit Card', icon: CreditCard, desc: 'Add a card once — auto-charged on the 1st of each month', gatewayNote: 'Processed via Gene Payment Gateway' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtLKR   = (n: number) => `LKR ${n.toLocaleString('en-LK')}`;
const fmtShort = (n: number) => n >= 1000000 ? `LKR ${(n / 1000000).toFixed(1)}M` : `LKR ${(n / 1000).toFixed(0)}k`;

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: InvoiceStatus }) {
  const cfg = {
    Paid:    { bg: 'bg-emerald-100 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-400', Icon: CheckCircle2 },
    Pending: { bg: 'bg-amber-100 dark:bg-amber-900/20',     text: 'text-amber-700 dark:text-amber-400',     Icon: Clock         },
    Overdue: { bg: 'bg-red-100 dark:bg-red-900/20',         text: 'text-red-700 dark:text-red-400',         Icon: AlertTriangle  },
  }[status];
  return (
    <span className={cn('inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap', cfg.bg, cfg.text)}>
      <cfg.Icon className="w-3 h-3" />
      {status}
    </span>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function HRBillingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><Skeleton className="h-7 w-24 mb-2" /><Skeleton className="h-4 w-44" /></div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardContent className="p-5"><Skeleton className="h-4 w-24 mb-2" /><Skeleton className="h-8 w-32" /></CardContent>
          </Card>
        ))}
      </div>
      <Card className="border-none shadow-sm">
        <CardContent className="p-5 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── HRBilling ────────────────────────────────────────────────────────────────

interface HRBillingProps { onNavigate: (view: string) => void; }

export function HRBilling({ onNavigate: _onNavigate }: HRBillingProps) {
  const { theme, resolvedTheme } = useTheme();
  const isDark = theme === 'dark' || resolvedTheme === 'dark';
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const [activeTab, setActiveTab]                 = useState<'invoices' | 'settings'>('invoices');
  const [downloadingId, setDownloadingId]         = useState<string | null>(null);
  const [showOverdueBanner, setShowOverdueBanner] = useState(true);
  const [failedPayment, setFailedPayment]         = useState(true);
  const [toast, setToast]                         = useState<{ msg: string; type: 'success' | 'info' } | null>(null);

  // Settings state
  const [paymentMethod, setPaymentMethod] = useState('invoice');
  const [invoiceEmail, setInvoiceEmail]   = useState('finance@axoratech.com');
  const [ccEmail, setCcEmail]             = useState('');
  const [notifyInvoice, setNotifyInvoice] = useState(true);
  const [notifyOverdue, setNotifyOverdue] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);

  const showToast = (msg: string, type: 'success' | 'info' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const handleDownload = (invoiceId: string) => {
    setDownloadingId(invoiceId);
    setTimeout(() => { setDownloadingId(null); showToast(`${invoiceId}.pdf downloaded`); }, 1200);
  };

  const handleSaveSettings = () => {
    setSavingSettings(true);
    setTimeout(() => { setSavingSettings(false); showToast('Billing settings saved — changes take effect next billing cycle'); }, 1000);
  };

  const cardHead = 'border-b border-gray-100 dark:border-[#2A2A2A] bg-gradient-to-r from-gray-50 to-white dark:from-[#0A0A0A] dark:to-[#141414] transition-colors duration-300 pt-4 pb-3 px-5';

  const overdueInvoices = INVOICES.filter(i => i.status === 'Overdue');
  const overdueTotal    = overdueInvoices.reduce((a, b) => a + b.total, 0);
  const ytdTotal        = INVOICES.filter(i => i.status === 'Paid' && i.issueDate.startsWith('2026')).reduce((a, b) => a + b.total, 0);
  const currentPending  = INVOICES.find(i => i.status === 'Pending');

  if (!mounted) return <HRBillingSkeleton />;

  return (
    <div className="space-y-6 pb-20 lg:pb-0">

      {/* ── Header ── */}
      <div>
        <h2 className="text-2xl font-bold text-[#0E2250] dark:text-white transition-colors duration-300">Billing</h2>
        <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">Axora Technologies · Gold Plan · 500 Seats</p>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-[#1C1C1C] rounded-xl w-fit transition-colors duration-300">
        {([
          { id: 'invoices', label: 'Invoices' },
          { id: 'settings', label: 'Billing Settings' },
        ] as const).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              activeTab === tab.id
                ? 'bg-white dark:bg-[#141414] text-[#0E2250] dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            )}
          >
            {tab.label}
            {tab.id === 'invoices' && overdueInvoices.length > 0 && (
              <span className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold">
                {overdueInvoices.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════ INVOICES TAB */}
      {activeTab === 'invoices' && (
        <div className="space-y-6">

          {/* Failed payment banner */}
          {failedPayment && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-300 dark:border-red-700/50">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                  Your last payment failed. Update your payment method to avoid suspension.
                </p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">
                  Access continues until <strong>Jun 15, 2026</strong>. Update by <strong>Jun 15, 2026</strong> to avoid suspension.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setActiveTab('settings')}
                  className="text-xs font-semibold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Update Now
                </button>
                <button
                  onClick={() => setFailedPayment(false)}
                  className="text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors text-lg leading-none px-1"
                >×</button>
              </div>
            </div>
          )}

          {/* Overdue banner */}
          {overdueInvoices.length > 0 && showOverdueBanner && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/40">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                  {overdueInvoices.length} overdue invoice — {fmtLKR(overdueTotal)} outstanding
                </p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-0.5 leading-relaxed">
                  {overdueInvoices.map(i => i.id).join(', ')} is past the 30-day payment term. Contact <span className="font-medium">finance@qpon.lk</span> if you need assistance.
                </p>
              </div>
              <button
                onClick={() => setShowOverdueBanner(false)}
                className="text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors text-lg leading-none flex-shrink-0 px-1"
              >×</button>
            </div>
          )}

          {/* KPI cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                border: 'border-l-amber-500', bgLight: 'bg-amber-50',
                label: 'Current Month Due',
                tooltip: 'Total amount due for the current billing period, payable by the end of this month.',
                value: fmtShort(currentPending?.total ?? 0),
                badge: <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-full"><span className="text-xs font-semibold">Due May 31</span></div>,
                sub: <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 transition-colors duration-300">May 2026</p>,
                span: '',
              },
              {
                border: 'border-l-blue-500', bgLight: 'bg-blue-50',
                label: 'YTD Spend',
                tooltip: 'Total amount invoiced and paid from January to the current month this year.',
                value: fmtShort(ytdTotal),
                badge: <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full"><TrendingUp className="w-3 h-3" /><span className="text-xs font-semibold">+8%</span></div>,
                sub: <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 transition-colors duration-300">Jan – May 2026</p>,
                span: '',
              },
              {
                border: 'border-l-emerald-500', bgLight: 'bg-emerald-50',
                label: 'Next Invoice',
                tooltip: 'Estimated date and amount for the next automatically generated invoice.',
                value: 'Jun 1, 2026',
                badge: <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full"><span className="text-xs font-semibold">~Est.</span></div>,
                sub: (
                  <>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 transition-colors duration-300">~{fmtShort(currentPending?.total ?? 0)} estimated</p>
                    <p className="text-[10px] text-teal-600 dark:text-teal-400 mt-1.5 flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" /> QPON refresh: Jun 1, 2026 · 488 allocations remaining
                    </p>
                  </>
                ),
                span: 'col-span-2 lg:col-span-1',
              },
            ].map((card) => (
              <Card key={card.label} className={`${card.span} border-none shadow-lg hover:shadow-xl dark:shadow-2xl transition-all duration-300 relative group border-l-4 ${card.border} bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C]`}>
                <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                  <div className={`absolute top-0 right-0 w-32 h-32 ${card.bgLight} dark:bg-transparent rounded-full blur-3xl opacity-30 -mr-16 -mt-16 group-hover:opacity-50 transition-opacity`} />
                </div>
                <CardContent className="p-5 relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-medium text-gray-500 dark:text-blue-300/70 uppercase tracking-wide transition-colors duration-300">{card.label}</p>
                      <div className="group/tooltip relative">
                        <Info className="w-3.5 h-3.5 text-gray-400 dark:text-blue-300/50 cursor-help transition-colors duration-300" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block w-56 z-50">
                          <div className="bg-gray-900 dark:bg-[#0A0A0A] text-white text-xs rounded-lg p-3 shadow-xl border border-transparent dark:border-gray-700">
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-[#0A0A0A] rotate-45" />
                            {card.tooltip}
                          </div>
                        </div>
                      </div>
                    </div>
                    {card.badge}
                  </div>
                  <h3 className="text-2xl font-bold text-[#0E2250] dark:text-white transition-colors duration-300">{card.value}</h3>
                  {card.sub}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Invoice table */}
          <Card className="border-none shadow-md bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C]">
            <CardHeader className={cardHead}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <CardTitle className="text-[#0E2250] dark:text-white text-base sm:text-[18px] transition-colors duration-300">
                    Invoice History
                  </CardTitle>
                  <div className="group/tooltip relative">
                    <Info className="w-4 h-4 text-gray-400 cursor-help flex-shrink-0" />
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover/tooltip:block w-64 z-50 pointer-events-none">
                      <div className="bg-gray-900 dark:bg-[#0A0A0A] text-white text-xs rounded-lg p-3 shadow-xl border border-transparent dark:border-[#2A2A2A]">
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-[#0A0A0A] rotate-45" />
                        Invoices are auto-generated on the 1st of each month. PDFs include Silver and Gold seat counts, proration line items, and total due.
                      </div>
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500">{INVOICES.length} invoices · newest first</span>
              </div>
            </CardHeader>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-[#2A2A2A] bg-gray-50/50 dark:bg-white/2">
                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Invoice</th>
                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Period</th>
                    <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-gray-400">Silver Seats</th>
                    <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-gray-400">Gold Seats</th>
                    <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-gray-400">Total (LKR)</th>
                    <th className="px-5 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-[#2A2A2A]">
                  {INVOICES.map(inv => (
                    <tr
                      key={inv.id}
                      className={cn(
                        'hover:bg-gray-50 dark:hover:bg-white/2 transition-colors',
                        inv.status === 'Overdue' && 'bg-red-50/40 dark:bg-red-900/5'
                      )}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white text-xs">{inv.id}</p>
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{inv.issueDate}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-700 dark:text-gray-300 text-xs">{inv.period}</td>
                      <td className="px-5 py-4 text-right">
                        <span className="inline-flex items-center justify-end gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                          <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 flex-shrink-0" />
                          {inv.silver}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="inline-flex items-center justify-end gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                          <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                          {inv.gold}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <p className="font-semibold text-gray-900 dark:text-white text-xs tabular-nums">{fmtLKR(inv.total)}</p>
                        {inv.hasProration && (
                          <p className="text-[10px] text-blue-500 dark:text-blue-400 mt-0.5">+ proration</p>
                        )}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <StatusBadge status={inv.status} />
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleDownload(inv.id)}
                          disabled={downloadingId === inv.id}
                          className={cn(
                            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors',
                            downloadingId === inv.id
                              ? 'text-gray-400 border-gray-200 dark:border-[#2A2A2A] cursor-wait'
                              : 'text-[#E35000] border-[#E35000]/30 hover:bg-[#E35000]/5 dark:border-[#E35000]/40'
                          )}
                        >
                          {downloadingId === inv.id
                            ? <><RefreshCw className="w-3 h-3 animate-spin" />Preparing</>
                            : <><Download className="w-3 h-3" />PDF</>
                          }
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card list */}
            <div className="md:hidden divide-y divide-gray-100 dark:divide-[#2A2A2A]">
              {INVOICES.map(inv => (
                <div
                  key={inv.id}
                  className={cn('p-4 space-y-2.5', inv.status === 'Overdue' && 'bg-red-50/40 dark:bg-red-900/5')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-xs">{inv.id}</p>
                        <p className="text-[10px] text-gray-400">{inv.period}</p>
                      </div>
                    </div>
                    <StatusBadge status={inv.status} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-400 flex-shrink-0" />{inv.silver} Silver</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />{inv.gold} Gold</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-semibold text-gray-900 dark:text-white text-xs tabular-nums">{fmtLKR(inv.total)}</span>
                      <button
                        onClick={() => handleDownload(inv.id)}
                        disabled={downloadingId === inv.id}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border text-[#E35000] border-[#E35000]/30 hover:bg-[#E35000]/5 transition-colors disabled:opacity-50"
                      >
                        {downloadingId === inv.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                        PDF
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ══════════════════════════════════════════════════ BILLING SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="space-y-6 max-w-2xl">

          {/* Payment Method */}
          <Card className="border-none shadow-md bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C]">
            <CardHeader className={cardHead}>
              <div className="flex items-center gap-1.5">
                <CardTitle className="text-[#0E2250] dark:text-white text-base sm:text-[18px] transition-colors duration-300">Payment Method</CardTitle>
                <div className="group/tooltip relative">
                  <Info className="w-4 h-4 text-gray-400 cursor-help flex-shrink-0" />
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover/tooltip:block w-64 z-50 pointer-events-none">
                    <div className="bg-gray-900 dark:bg-[#0A0A0A] text-white text-xs rounded-lg p-3 shadow-xl border border-transparent dark:border-[#2A2A2A]">
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-[#0A0A0A] rotate-45" />
                      Changes take effect from the next billing cycle. No action needed from QPON — changes apply automatically.
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              {PAYMENT_METHODS.map(pm => {
                const isSelected = paymentMethod === pm.id;
                return (
                  <button
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id)}
                    className={cn(
                      'w-full text-left flex items-start gap-4 p-4 rounded-xl border transition-all duration-200',
                      isSelected
                        ? 'border-[#E35000] bg-[#E35000]/5 dark:bg-[#E35000]/10'
                        : 'border-gray-200 dark:border-[#2A2A2A] hover:border-gray-300 dark:hover:border-gray-600 bg-transparent'
                    )}
                  >
                    <div className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors',
                      isSelected ? 'bg-[#E35000]' : 'bg-gray-100 dark:bg-white/5'
                    )}>
                      <pm.icon className={cn('w-5 h-5', isSelected ? 'text-white' : 'text-gray-500 dark:text-gray-400')} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={cn('text-sm font-semibold', isSelected ? 'text-[#E35000]' : 'text-gray-900 dark:text-white')}>{pm.label}</p>
                        {isSelected && (
                          <span className="text-[10px] bg-[#E35000]/10 text-[#E35000] px-2 py-0.5 rounded-full font-semibold border border-[#E35000]/20">Active</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{pm.desc}</p>
                      {pm.gatewayNote && (
                        <p className="text-[10px] text-[#E35000]/80 dark:text-[#E35000]/70 mt-0.5 font-medium">{pm.gatewayNote}</p>
                      )}
                    </div>
                    <div className={cn(
                      'w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all',
                      isSelected ? 'border-[#E35000]' : 'border-gray-300 dark:border-gray-600'
                    )}>
                      {isSelected && <div className="w-[10px] h-[10px] rounded-full bg-[#E35000]" />}
                    </div>
                  </button>
                );
              })}

            </CardContent>
          </Card>

          {/* Invoice Recipients */}
          <Card className="border-none shadow-md bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C]">
            <CardHeader className={cardHead}>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <CardTitle className="text-[#0E2250] dark:text-white text-base sm:text-[18px] transition-colors duration-300">Invoice Recipients</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Primary Invoice Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={invoiceEmail}
                  onChange={e => setInvoiceEmail(e.target.value)}
                  placeholder="finance@yourcompany.com"
                  className="w-full px-3 py-2.5 text-sm bg-white dark:bg-[#1C1C1C] border border-gray-300 dark:border-[#2A2A2A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E35000]/30 focus:border-[#E35000] text-gray-900 dark:text-white placeholder-gray-400 transition-colors"
                />
                <p className="text-[11px] text-gray-400 mt-1.5">Invoice PDFs and payment reminders are sent to this address</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  CC Email <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="email"
                  value={ccEmail}
                  onChange={e => setCcEmail(e.target.value)}
                  placeholder="cfo@yourcompany.com"
                  className="w-full px-3 py-2.5 text-sm bg-white dark:bg-[#1C1C1C] border border-gray-300 dark:border-[#2A2A2A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E35000]/30 focus:border-[#E35000] text-gray-900 dark:text-white placeholder-gray-400 transition-colors"
                />
                <p className="text-[11px] text-gray-400 mt-1.5">Secondary recipient copied on all billing communications</p>
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card className="border-none shadow-md bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C]">
            <CardHeader className={cardHead}>
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-gray-400" />
                <CardTitle className="text-[#0E2250] dark:text-white text-base sm:text-[18px] transition-colors duration-300">Notification Preferences</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-5">
              {[
                {
                  label: 'Invoice issued',
                  desc:  'Notify when a new invoice is generated on the 1st of each month',
                  value: notifyInvoice,
                  toggle: () => setNotifyInvoice(v => !v),
                },
                {
                  label: 'Overdue reminders',
                  desc:  'Email reminders at due date, +7 days, and +14 days if payment is not received',
                  value: notifyOverdue,
                  toggle: () => setNotifyOverdue(v => !v),
                },
              ].map(pref => (
                <div key={pref.label} className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{pref.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{pref.desc}</p>
                  </div>
                  <button
                    onClick={pref.toggle}
                    aria-checked={pref.value}
                    role="switch"
                    className="relative flex-shrink-0 rounded-full transition-colors duration-200 focus:outline-none mt-0.5"
                    style={{ width: 44, height: 24, background: pref.value ? '#E35000' : '#D1D5DB' }}
                  >
                    <span
                      className="absolute rounded-full bg-white"
                      style={{
                        width: 18, height: 18, top: 3, left: 3,
                        boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
                        transform: pref.value ? 'translateX(20px)' : 'translateX(0px)',
                        transition: 'transform 0.2s ease',
                      }}
                    />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Save */}
          <div className="flex items-center justify-between gap-3 pb-4">
            <p className="text-xs text-gray-400 dark:text-gray-500">Changes take effect from the next billing cycle on the 1st of next month</p>
            <button
              onClick={handleSaveSettings}
              disabled={savingSettings}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#E35000] hover:bg-[#c44500] disabled:opacity-60 transition-colors shadow-md flex-shrink-0"
            >
              {savingSettings && <RefreshCw className="w-4 h-4 animate-spin" />}
              {savingSettings ? 'Saving…' : 'Save Settings'}
            </button>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className={cn(
          'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-sm font-medium pointer-events-none whitespace-nowrap',
          toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-[#0E2250] text-white'
        )}>
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          {toast.msg}
        </div>
      )}
    </div>
  );
}

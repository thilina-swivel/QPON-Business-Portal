import React, { useState, useEffect } from 'react';
import {
  FileText, TrendingUp,
  CheckCircle2, Clock, AlertTriangle,
  AlertCircle, Info, RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { cn } from '../../lib/utils';

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
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const [showOverdueBanner, setShowOverdueBanner] = useState(true);
  const [failedPayment, setFailedPayment]         = useState(true);


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
        <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">Axora Technologies · Growth Plan · 500 Seats</p>
      </div>

      {/* ══════════════════════════════════════════════════════ INVOICES */}
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
              <button
                onClick={() => setFailedPayment(false)}
                className="text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors text-lg leading-none px-1 flex-shrink-0"
              >×</button>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                border: 'border-l-amber-500', bgLight: 'bg-amber-50',
                label: 'Current Month Due',
                tooltip: 'Total amount due for the current billing period, payable by the end of this month.',
                value: fmtShort(currentPending?.total ?? 0),
                badge: <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full flex-shrink-0"><span className="text-[11px] font-semibold">Due May 31</span></div>,
                sub: <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 transition-colors duration-300">May 2026</p>,
                span: '',
              },
              {
                border: 'border-l-blue-500', bgLight: 'bg-blue-50',
                label: 'YTD Spend',
                tooltip: 'Total amount invoiced and paid from January to the current month this year.',
                value: fmtShort(ytdTotal),
                badge: <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full flex-shrink-0"><TrendingUp className="w-3 h-3" /><span className="text-[11px] font-semibold">+8%</span></div>,
                sub: <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 transition-colors duration-300">Jan – May 2026</p>,
                span: '',
              },
              {
                border: 'border-l-emerald-500', bgLight: 'bg-emerald-50',
                label: 'Next Invoice',
                tooltip: 'Estimated date and amount for the next automatically generated invoice.',
                value: 'Jun 1, 2026',
                badge: <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full flex-shrink-0"><span className="text-[11px] font-semibold">~Est.</span></div>,
                sub: (
                  <>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 transition-colors duration-300">~{fmtShort(currentPending?.total ?? 0)} estimated</p>
                    <p className="text-[10px] text-teal-600 dark:text-teal-400 mt-1.5 flex items-center gap-1 flex-wrap">
                      <RefreshCw className="w-3 h-3 flex-shrink-0" /> QPON refresh: Jun 1, 2026 · 488 remaining
                    </p>
                  </>
                ),
                span: 'sm:col-span-2 lg:col-span-1',
              },
            ].map((card) => (
              <Card key={card.label} className={`${card.span} border-none shadow-lg hover:shadow-xl dark:shadow-2xl transition-all duration-300 relative group border-l-4 ${card.border} bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C]`}>
                <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                  <div className={`absolute top-0 right-0 w-32 h-32 ${card.bgLight} dark:bg-transparent rounded-full blur-3xl opacity-30 -mr-16 -mt-16 group-hover:opacity-50 transition-opacity`} />
                </div>
                <CardContent className="p-4 sm:p-5 relative z-10">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <p className="text-[11px] sm:text-xs font-medium text-gray-500 dark:text-blue-300/70 uppercase tracking-wide transition-colors duration-300 leading-tight">{card.label}</p>
                      <div className="group/tooltip relative flex-shrink-0">
                        <Info className="w-3.5 h-3.5 text-gray-400 dark:text-blue-300/50 cursor-help transition-colors duration-300" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block w-52 z-50">
                          <div className="bg-gray-900 dark:bg-[#0A0A0A] text-white text-xs rounded-lg p-3 shadow-xl border border-transparent dark:border-gray-700">
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-[#0A0A0A] rotate-45" />
                            {card.tooltip}
                          </div>
                        </div>
                      </div>
                    </div>
                    {card.badge}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#0E2250] dark:text-white transition-colors duration-300">{card.value}</h3>
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>


    </div>
  );
}

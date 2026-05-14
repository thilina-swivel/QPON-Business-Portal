import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Users, UserCheck, UserX, Search,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  UserPlus, UploadCloud, Download, Trash2, Eye, Send, Medal,
  AlertCircle, CheckCircle2, X, FileText, Phone,
  Utensils, Fuel, ShoppingCart, Pill, ArrowLeft,
  Check, TrendingUp, Building2, Activity,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { Input } from '../ui/input';
import { cn } from '../../lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type Tier = 'Bronze' | 'Silver' | 'Gold';
type ActivationStatus = 'Activated' | 'Pending';
type EmpView = 'list' | 'add' | 'bulk' | 'detail';
type BulkStep = 'upload' | 'preview' | 'success';
type SortKey = 'name' | 'department' | 'tier' | 'status' | 'dateJoined' | 'savingsThisMonth';
type SortDir = 'asc' | 'desc';

interface Employee {
  id: string;
  name: string;
  department: string;
  tier: Tier;
  status: ActivationStatus;
  phone: string;
  dateJoined: string;
  savingsThisMonth: number;
  totalSavings: number;
  activationDate: string | null;
  lastActive: string;
  savingsByCategory: { Dining: number; Fuel: number; Grocery: number; Pharmacy: number };
  merchantsVisited: string[];
}

interface BulkRow {
  rowNum: number;
  name: string;
  phone: string;
  department: string;
  tier: Tier;
  valid: boolean;
  error?: string;
}

// ─── Demo Data ────────────────────────────────────────────────────────────────

const DEMO_EMPLOYEES: Employee[] = [
  { id: 'e1', name: 'Nimal Perera', department: 'Engineering', tier: 'Gold', status: 'Activated', phone: '+94712345678', dateJoined: '2026-01-15', savingsThisMonth: 8400, totalSavings: 42000, activationDate: '2026-01-16', lastActive: '2026-05-11', savingsByCategory: { Dining: 3200, Fuel: 2100, Grocery: 1800, Pharmacy: 1300 }, merchantsVisited: ['Keells', 'Cargills', 'Lanka Hospitals', 'Laugfs', 'Arpico'] },
  { id: 'e2', name: 'Kavindi Silva', department: 'HR', tier: 'Gold', status: 'Activated', phone: '+94771234567', dateJoined: '2026-01-20', savingsThisMonth: 7200, totalSavings: 36000, activationDate: '2026-01-21', lastActive: '2026-05-09', savingsByCategory: { Dining: 2800, Fuel: 1900, Grocery: 1500, Pharmacy: 1000 }, merchantsVisited: ['Keells', 'Lanka Hospitals', 'Softlogic'] },
  { id: 'e3', name: 'Roshan Fernando', department: 'Finance', tier: 'Silver', status: 'Activated', phone: '+94751234567', dateJoined: '2026-02-01', savingsThisMonth: 3800, totalSavings: 15200, activationDate: '2026-02-03', lastActive: '2026-05-08', savingsByCategory: { Dining: 1400, Fuel: 900, Grocery: 1000, Pharmacy: 500 }, merchantsVisited: ['Cargills', 'Laugfs', 'Keells'] },
  { id: 'e4', name: 'Dilini Jayawardena', department: 'Marketing', tier: 'Silver', status: 'Pending', phone: '+94761234567', dateJoined: '2026-02-10', savingsThisMonth: 0, totalSavings: 0, activationDate: null, lastActive: '-', savingsByCategory: { Dining: 0, Fuel: 0, Grocery: 0, Pharmacy: 0 }, merchantsVisited: [] },
  { id: 'e5', name: 'Chamara Wickramasinghe', department: 'Operations', tier: 'Gold', status: 'Activated', phone: '+94781234567', dateJoined: '2026-01-05', savingsThisMonth: 9100, totalSavings: 45500, activationDate: '2026-01-06', lastActive: '2026-05-11', savingsByCategory: { Dining: 3500, Fuel: 2400, Grocery: 1900, Pharmacy: 1300 }, merchantsVisited: ['Keells', 'Cargills', 'Lanka Hospitals', 'Laugfs'] },
  { id: 'e6', name: 'Thilini Dissanayake', department: 'Sales', tier: 'Silver', status: 'Activated', phone: '+94731234567', dateJoined: '2026-02-20', savingsThisMonth: 4200, totalSavings: 12600, activationDate: '2026-02-22', lastActive: '2026-05-07', savingsByCategory: { Dining: 1600, Fuel: 1100, Grocery: 900, Pharmacy: 600 }, merchantsVisited: ['Keells', 'Arpico'] },
  { id: 'e7', name: 'Sandun Rathnayake', department: 'IT', tier: 'Gold', status: 'Activated', phone: '+94741234567', dateJoined: '2026-01-25', savingsThisMonth: 7800, totalSavings: 39000, activationDate: '2026-01-26', lastActive: '2026-05-10', savingsByCategory: { Dining: 3000, Fuel: 2000, Grocery: 1600, Pharmacy: 1200 }, merchantsVisited: ['Softlogic', 'Keells', 'Lanka Hospitals'] },
  { id: 'e8', name: 'Malini Amarasinghe', department: 'Legal', tier: 'Silver', status: 'Pending', phone: '+94791234567', dateJoined: '2026-03-01', savingsThisMonth: 0, totalSavings: 0, activationDate: null, lastActive: '-', savingsByCategory: { Dining: 0, Fuel: 0, Grocery: 0, Pharmacy: 0 }, merchantsVisited: [] },
  { id: 'e9', name: 'Kasun Kumara', department: 'Engineering', tier: 'Silver', status: 'Activated', phone: '+94711234568', dateJoined: '2026-02-15', savingsThisMonth: 3100, totalSavings: 9300, activationDate: '2026-02-17', lastActive: '2026-05-06', savingsByCategory: { Dining: 1200, Fuel: 800, Grocery: 700, Pharmacy: 400 }, merchantsVisited: ['Cargills', 'Keells'] },
  { id: 'e10', name: 'Priya Maheswaran', department: 'HR', tier: 'Gold', status: 'Activated', phone: '+94771234568', dateJoined: '2026-01-18', savingsThisMonth: 8900, totalSavings: 44500, activationDate: '2026-01-19', lastActive: '2026-05-11', savingsByCategory: { Dining: 3400, Fuel: 2200, Grocery: 1900, Pharmacy: 1400 }, merchantsVisited: ['Keells', 'Lanka Hospitals', 'Cargills', 'Arpico'] },
  { id: 'e11', name: 'Ajith Subasinghe', department: 'Finance', tier: 'Silver', status: 'Activated', phone: '+94751234568', dateJoined: '2026-03-10', savingsThisMonth: 2800, totalSavings: 5600, activationDate: '2026-03-12', lastActive: '2026-05-05', savingsByCategory: { Dining: 1100, Fuel: 700, Grocery: 600, Pharmacy: 400 }, merchantsVisited: ['Cargills', 'Laugfs'] },
  { id: 'e12', name: 'Sachini Bandara', department: 'Marketing', tier: 'Gold', status: 'Activated', phone: '+94761234568', dateJoined: '2026-01-30', savingsThisMonth: 7500, totalSavings: 37500, activationDate: '2026-01-31', lastActive: '2026-05-09', savingsByCategory: { Dining: 2900, Fuel: 2000, Grocery: 1600, Pharmacy: 1000 }, merchantsVisited: ['Softlogic', 'Keells', 'Cargills'] },
  { id: 'e13', name: 'Harsha Gunawardena', department: 'Operations', tier: 'Silver', status: 'Pending', phone: '+94781234568', dateJoined: '2026-03-20', savingsThisMonth: 0, totalSavings: 0, activationDate: null, lastActive: '-', savingsByCategory: { Dining: 0, Fuel: 0, Grocery: 0, Pharmacy: 0 }, merchantsVisited: [] },
  { id: 'e14', name: 'Iresha Weerasinghe', department: 'Sales', tier: 'Silver', status: 'Activated', phone: '+94731234568', dateJoined: '2026-02-25', savingsThisMonth: 3500, totalSavings: 10500, activationDate: '2026-02-27', lastActive: '2026-05-08', savingsByCategory: { Dining: 1300, Fuel: 900, Grocery: 800, Pharmacy: 500 }, merchantsVisited: ['Keells', 'Arpico', 'Cargills'] },
  { id: 'e15', name: 'Nuwan Jayasinghe', department: 'IT', tier: 'Gold', status: 'Activated', phone: '+94741234568', dateJoined: '2026-01-22', savingsThisMonth: 8200, totalSavings: 41000, activationDate: '2026-01-23', lastActive: '2026-05-10', savingsByCategory: { Dining: 3100, Fuel: 2100, Grocery: 1700, Pharmacy: 1300 }, merchantsVisited: ['Keells', 'Lanka Hospitals', 'Softlogic', 'Laugfs'] },
  { id: 'e16', name: 'Samanthi Edirisinghe', department: 'Legal', tier: 'Silver', status: 'Activated', phone: '+94791234568', dateJoined: '2026-03-05', savingsThisMonth: 2500, totalSavings: 7500, activationDate: '2026-03-07', lastActive: '2026-05-04', savingsByCategory: { Dining: 1000, Fuel: 600, Grocery: 600, Pharmacy: 300 }, merchantsVisited: ['Cargills'] },
  { id: 'e17', name: 'Bimal Seneviratne', department: 'Engineering', tier: 'Gold', status: 'Activated', phone: '+94711234569', dateJoined: '2026-01-12', savingsThisMonth: 9500, totalSavings: 47500, activationDate: '2026-01-13', lastActive: '2026-05-11', savingsByCategory: { Dining: 3600, Fuel: 2500, Grocery: 2000, Pharmacy: 1400 }, merchantsVisited: ['Keells', 'Cargills', 'Lanka Hospitals', 'Laugfs', 'Arpico'] },
  { id: 'e18', name: 'Chamali Liyanage', department: 'Finance', tier: 'Silver', status: 'Pending', phone: '+94751234569', dateJoined: '2026-04-01', savingsThisMonth: 0, totalSavings: 0, activationDate: null, lastActive: '-', savingsByCategory: { Dining: 0, Fuel: 0, Grocery: 0, Pharmacy: 0 }, merchantsVisited: [] },
  { id: 'e19', name: 'Dinesh Karunaratne', department: 'Marketing', tier: 'Silver', status: 'Activated', phone: '+94761234569', dateJoined: '2026-03-15', savingsThisMonth: 2900, totalSavings: 5800, activationDate: '2026-03-17', lastActive: '2026-05-07', savingsByCategory: { Dining: 1100, Fuel: 700, Grocery: 700, Pharmacy: 400 }, merchantsVisited: ['Keells', 'Cargills'] },
  { id: 'e20', name: 'Vindya Ranasinghe', department: 'HR', tier: 'Gold', status: 'Activated', phone: '+94771234569', dateJoined: '2026-01-28', savingsThisMonth: 7900, totalSavings: 39500, activationDate: '2026-01-29', lastActive: '2026-05-09', savingsByCategory: { Dining: 3000, Fuel: 2100, Grocery: 1700, Pharmacy: 1100 }, merchantsVisited: ['Keells', 'Lanka Hospitals', 'Arpico'] },
];

const BULK_PREVIEW_ROWS: BulkRow[] = [
  { rowNum: 1, name: 'Amal Perera', phone: '+94711111111', department: 'Engineering', tier: 'Gold', valid: true },
  { rowNum: 2, name: 'Sithara Fernando', phone: '+94722222222', department: 'Finance', tier: 'Silver', valid: true },
  { rowNum: 3, name: '', phone: '+94733333333', department: 'Marketing', tier: 'Silver', valid: false, error: 'Name is required' },
  { rowNum: 4, name: 'Ruwan Bandara', phone: '+94744444444', department: 'Operations', tier: 'Gold', valid: true },
  { rowNum: 5, name: 'Nisala Jayawardena', phone: '077555', department: 'Sales', tier: 'Silver', valid: false, error: 'Invalid phone format' },
  { rowNum: 6, name: 'Amali Silva', phone: '+94766666666', department: 'IT', tier: 'Gold', valid: true },
  { rowNum: 7, name: 'Lahiru Kumara', phone: '+94777777777', department: 'HR', tier: 'Silver', valid: true },
  { rowNum: 8, name: 'Thilini Weerasinghe', phone: '+94788888888', department: 'Legal', tier: 'Gold', valid: true },
  { rowNum: 9, name: 'Chamara Gunawardena', phone: '+94799999999', department: 'Engineering', tier: 'Silver', valid: true },
  { rowNum: 10, name: 'Pradeep Rathnayake', phone: '+94700000000', department: 'Finance', tier: 'Gold', valid: true },
];

const PAGE_SIZE = 10;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatLKR = (n: number) => `LKR ${n.toLocaleString('en-LK')}`;

const formatDate = (s: string | null) => {
  if (!s || s === '-') return '—';
  return new Date(s).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

// ─── TierBadge ────────────────────────────────────────────────────────────────

function TierBadge({ tier }: { tier: Tier }) {
  if (tier === 'Gold') return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
      <Medal className="w-2.5 h-2.5" /> Gold
    </span>
  );
  if (tier === 'Bronze') return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300">
      Bronze
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
      Silver
    </span>
  );
}

// ─── StatusBadge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ActivationStatus }) {
  return status === 'Activated' ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
      <UserCheck className="w-2.5 h-2.5" /> Activated
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
      <UserX className="w-2.5 h-2.5" /> Pending
    </span>
  );
}

// ─── RemoveDialog ─────────────────────────────────────────────────────────────

function RemoveDialog({ employee, onConfirm, onCancel }: { employee: Employee | null; onConfirm: () => void; onCancel: () => void }) {
  if (!employee) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-[#1C1C1C] rounded-2xl shadow-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
            <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Remove {employee.name}?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              This will deactivate their QPON benefit at the end of the current month.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              The seat count will update on your next invoice and the employee will lose access to all deals.
            </p>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
          <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white border-0" onClick={onConfirm}>
            Remove Employee
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── TierChangeDialog ─────────────────────────────────────────────────────────

function TierChangeDialog({ employee, onConfirm, onCancel }: {
  employee: Employee | null;
  onConfirm: (tier: Tier) => void;
  onCancel: () => void;
}) {
  const [selected, setSelected] = useState<Tier>('Silver');

  useEffect(() => {
    if (employee) setSelected(employee.tier);
  }, [employee?.id]);

  if (!employee) return null;

  const tiers: Array<{ tier: Tier; qpons: number }> = [
    { tier: 'Bronze', qpons: 10 },
    { tier: 'Silver', qpons: 20 },
    { tier: 'Gold', qpons: 30 },
  ];

  const tierRank: Record<Tier, number> = { Bronze: 0, Silver: 1, Gold: 2 };
  const direction = tierRank[selected] > tierRank[employee.tier] ? 'upgrade'
    : tierRank[selected] < tierRank[employee.tier] ? 'downgrade'
    : 'same';

  const selectedBorderClass = (tier: Tier) => {
    if (tier === 'Gold') return 'border-amber-400 bg-amber-50 dark:bg-amber-900/10';
    if (tier === 'Bronze') return 'border-orange-400 bg-orange-50 dark:bg-orange-900/10';
    return 'border-gray-400 bg-gray-50 dark:bg-gray-700/20';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-sm bg-white dark:bg-[#1C1C1C] rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Change Tier</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{employee.name}</p>
          </div>
          <button onClick={onCancel} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 mb-4">
          {tiers.map(({ tier, qpons }) => {
            const isCurrent = tier === employee.tier;
            const isSelected = tier === selected;
            return (
              <button
                key={tier}
                onClick={() => setSelected(tier)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-150 text-left ${
                  isSelected
                    ? selectedBorderClass(tier)
                    : 'border-gray-200 dark:border-[#2A2A2A] hover:border-gray-300 dark:hover:border-[#3A3A3A]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <TierBadge tier={tier} />
                  <span className="text-sm text-gray-600 dark:text-gray-300">{qpons} QPONs / 30 days</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {isCurrent && (
                    <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded-full">Current</span>
                  )}
                  {isSelected && !isCurrent && <Check className="w-4 h-4 text-[#E35000]" />}
                </div>
              </button>
            );
          })}
        </div>

        {direction !== 'same' && (
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-4 text-xs font-medium ${
            direction === 'upgrade'
              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
              : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
          }`}>
            <TrendingUp className={cn('w-3.5 h-3.5 transition-transform', direction === 'downgrade' && 'rotate-180')} />
            {direction === 'upgrade'
              ? `Upgrading: ${employee.tier} → ${selected}`
              : `Downgrading: ${employee.tier} → ${selected}`}
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
          <Button
            className="flex-1 bg-[#E35000] hover:bg-[#c44500] text-white border-0"
            onClick={() => onConfirm(selected)}
            disabled={direction === 'same'}
          >
            {direction === 'upgrade' ? 'Upgrade' : direction === 'downgrade' ? 'Downgrade' : 'No Change'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── EmployeeListSkeleton ─────────────────────────────────────────────────────

function EmployeeListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><Skeleton className="h-7 w-40 mb-2" /><Skeleton className="h-4 w-28" /></div>
        <div className="flex gap-2"><Skeleton className="h-9 w-28" /><Skeleton className="h-9 w-28" /></div>
      </div>
      <div className="flex gap-3"><Skeleton className="h-9 w-64" /><Skeleton className="h-9 w-32" /><Skeleton className="h-9 w-32" /></div>
      <Card className="border border-gray-200 dark:border-[#2A2A2A]">
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100 dark:divide-[#2A2A2A]">
            <div className="grid grid-cols-7 gap-4 px-4 py-3 bg-gray-50/50 dark:bg-white/2">
              {Array.from({ length: 7 }).map((_, i) => <Skeleton key={i} className="h-3" />)}
            </div>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="grid grid-cols-7 gap-4 px-4 py-4">
                {Array.from({ length: 7 }).map((_, j) => <Skeleton key={j} className="h-5" />)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── EmployeeEmptyState ───────────────────────────────────────────────────────

function EmployeeEmptyState({ onAddEmployee, onBulkUpload }: { onAddEmployee: () => void; onBulkUpload: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4">
        <Users className="w-8 h-8 text-[#0E2250] dark:text-blue-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No employees yet</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
        Add your first employee to get started. You can add them one by one or bulk upload a CSV.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={onAddEmployee} className="bg-[#E35000] hover:bg-[#c44600] text-white">
          <UserPlus className="w-4 h-4 mr-2" /> Add Employee
        </Button>
        <Button variant="outline" onClick={onBulkUpload}>
          <UploadCloud className="w-4 h-4 mr-2" /> Bulk Upload CSV
        </Button>
      </div>
    </div>
  );
}

// ─── AddEmployeeForm ──────────────────────────────────────────────────────────

function AddEmployeeForm({ onBack, onSuccess }: { onBack: () => void; onSuccess: (emp: Employee) => void }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [tier, setTier] = useState<Tier>('Silver');
  const [errors, setErrors] = useState<{ name?: string; phone?: string; department?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs: { name?: string; phone?: string; department?: string } = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!phone) errs.phone = 'Mobile number is required';
    else if (!/^\d{9}$/.test(phone)) errs.phone = 'Enter a valid 9-digit number';
    if (!department.trim()) errs.department = 'Department is required';
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    const newEmp: Employee = {
      id: `e-new-${Date.now()}`,
      name: name.trim(),
      department: department.trim(),
      tier,
      status: 'Pending',
      phone: '+94' + phone,
      dateJoined: new Date().toISOString().split('T')[0],
      savingsThisMonth: 0,
      totalSavings: 0,
      activationDate: null,
      lastActive: '-',
      savingsByCategory: { Dining: 0, Fuel: 0, Grocery: 0, Pharmacy: 0 },
      merchantsVisited: [],
    };
    setSubmitted(true);
    setTimeout(() => onSuccess(newEmp), 1200);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Employee added</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">SMS activation link sent to +94{phone}.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
          <ArrowLeft className="w-4 h-4 text-gray-500" />
        </button>
        <div>
          <h2 className="text-xl font-semibold text-[#0E2250] dark:text-white">Add Employee</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">An SMS activation link is sent immediately on save.</p>
        </div>
      </div>
      <Card className="border border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#141414]">
        <CardContent className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setName(e.target.value); if (errors.name) setErrors(p => ({ ...p, name: undefined })); }}
              placeholder="e.g. Nimal Perera"
              className={cn(errors.name && 'border-red-500')}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.name}</p>}
          </div>
          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400 font-medium select-none pointer-events-none">+94</span>
              <Input
                value={phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => { const d = e.target.value.replace(/\D/g, '').slice(0, 9); setPhone(d); if (errors.phone) setErrors(p => ({ ...p, phone: undefined })); }}
                placeholder="71 234 5678"
                className={cn('pl-11', errors.phone && 'border-red-500')}
              />
            </div>
            {errors.phone && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.phone}</p>}
          </div>
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5">
              Email <span className="text-gray-400 font-normal normal-case tracking-normal">(optional)</span>
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="e.g. nimal@company.com"
            />
          </div>
          {/* Department */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5">
              Department <span className="text-red-500">*</span>
            </label>
            <Input
              value={department}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setDepartment(e.target.value); if (errors.department) setErrors(p => ({ ...p, department: undefined })); }}
              placeholder="e.g. Engineering"
              className={cn(errors.department && 'border-red-500')}
            />
            {errors.department && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.department}</p>}
          </div>
          {/* Tier toggle */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5">Tier</label>
            <div className="flex rounded-lg border border-gray-200 dark:border-[#2A2A2A] overflow-hidden w-fit">
              <button
                onClick={() => setTier('Bronze')}
                className={cn('px-5 py-2 text-sm font-medium transition-colors', tier === 'Bronze' ? 'bg-amber-700 text-white' : 'bg-white dark:bg-[#1C1C1C] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5')}
              >Bronze</button>
              <button
                onClick={() => setTier('Silver')}
                className={cn('px-5 py-2 text-sm font-medium transition-colors border-l border-gray-200 dark:border-[#2A2A2A]', tier === 'Silver' ? 'bg-gray-700 text-white' : 'bg-white dark:bg-[#1C1C1C] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5')}
              >Silver</button>
              <button
                onClick={() => setTier('Gold')}
                className={cn('px-5 py-2 text-sm font-medium transition-colors border-l border-gray-200 dark:border-[#2A2A2A]', tier === 'Gold' ? 'bg-amber-500 text-white' : 'bg-white dark:bg-[#1C1C1C] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5')}
              >
                <span className="flex items-center gap-1.5"><Medal className="w-3.5 h-3.5" />Gold</span>
              </button>
            </div>
            <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
              {tier === 'Gold' ? 'Gold · 30 QPONs / 30 days — LKR 1,200/seat' : tier === 'Bronze' ? 'Bronze · 10 QPONs / 30 days — LKR TBC/seat' : 'Silver · 20 QPONs / 30 days — LKR 600/seat'}
            </p>
          </div>
          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onBack} className="flex-1">Cancel</Button>
            <Button onClick={handleSubmit} className="flex-1 bg-[#E35000] hover:bg-[#c44600] text-white">Add & Send Link</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── BulkUploadScreen ─────────────────────────────────────────────────────────

function BulkUploadScreen({ onBack, onSuccess }: { onBack: () => void; onSuccess: (count: number) => void }) {
  const [step, setStep] = useState<BulkStep>('upload');
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [rows, setRows] = useState<BulkRow[]>(BULK_PREVIEW_ROWS);
  const fileRef = useRef<HTMLInputElement>(null);

  const validRows = rows.filter(r => r.valid);
  const invalidRows = rows.filter(r => !r.valid);

  const handleFile = (file: File) => { setFileName(file.name); setStep('preview'); };
  const removeRow = (n: number) => setRows(prev => prev.filter(r => r.rowNum !== n));

  const STEPS: Array<{ key: BulkStep; label: string }> = [
    { key: 'upload', label: 'Upload File' },
    { key: 'preview', label: 'Preview & Send' },
  ];
  const stepIdx = (k: BulkStep) => STEPS.findIndex(s => s.key === k);

  if (step === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{validRows.length} activation links sent</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
          SMS messages will be delivered within 2 minutes. Employees appear as Activated once they tap their link.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
          <ArrowLeft className="w-4 h-4 text-gray-500" />
        </button>
        <div>
          <h2 className="text-xl font-semibold text-[#0E2250] dark:text-white">Bulk Upload</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Upload a CSV to add multiple employees at once.</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {STEPS.map((s, i) => (
          <React.Fragment key={s.key}>
            <div className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold',
              step === s.key ? 'bg-[#0E2250] text-white'
                : i < stepIdx(step) ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-gray-100 dark:bg-white/5 text-gray-400'
            )}>
              {i < stepIdx(step) ? <Check className="w-3 h-3" /> : <span>{i + 1}</span>}
              {s.label}
            </div>
            {i < STEPS.length - 1 && <div className="flex-1 h-px bg-gray-200 dark:bg-[#2A2A2A]" />}
          </React.Fragment>
        ))}
      </div>

      {step === 'upload' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl border border-dashed border-gray-300 dark:border-[#2A2A2A] bg-gray-50 dark:bg-white/2">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Download CSV Template</p>
                <p className="text-xs text-gray-400">Full Name · Mobile Number · Email (optional) · Department</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-2"><Download className="w-3.5 h-3.5" />Template</Button>
          </div>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
            onClick={() => fileRef.current?.click()}
            className={cn(
              'flex flex-col items-center justify-center gap-3 p-12 rounded-2xl border-2 border-dashed cursor-pointer transition-all',
              dragging ? 'border-[#E35000] bg-orange-50 dark:bg-orange-900/10' : 'border-gray-200 dark:border-[#2A2A2A] hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-white/2'
            )}
          >
            <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center">
              <UploadCloud className={cn('w-6 h-6', dragging ? 'text-[#E35000]' : 'text-gray-400')} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{dragging ? 'Drop to upload' : 'Drag & drop your CSV here'}</p>
              <p className="text-xs text-gray-400 mt-0.5">or click to browse · CSV files only</p>
            </div>
            <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          </div>
        </div>
      )}

      {step === 'preview' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-white/3 border border-gray-200 dark:border-[#2A2A2A]">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{fileName}</span>
            </div>
            <div className="flex gap-3">
              <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />{validRows.length} valid
              </span>
              {invalidRows.length > 0 && (
                <span className="flex items-center gap-1.5 text-sm font-semibold text-red-500">
                  <AlertCircle className="w-4 h-4" />{invalidRows.length} with errors
                </span>
              )}
            </div>
          </div>
          <Card className="border border-gray-200 dark:border-[#2A2A2A]">
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-[#2A2A2A] bg-gray-50/50 dark:bg-white/2">
                    {['#', 'Full Name', 'Mobile Number', 'Email (optional)', 'Department', 'Status', ''].map((h, i) => (
                      <th key={i} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-[#2A2A2A]">
                  {rows.map(row => (
                    <tr key={row.rowNum} className={cn('transition-colors', row.valid ? 'hover:bg-gray-50 dark:hover:bg-white/2' : 'bg-red-50/50 dark:bg-red-900/10')}>
                      <td className="px-4 py-3 text-xs text-gray-400">{row.rowNum}</td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{row.name || <span className="italic text-red-400">Missing</span>}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{row.phone}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{row.department || '—'}</td>
                      <td className="px-4 py-3"><TierBadge tier={row.tier} /></td>
                      <td className="px-4 py-3">
                        {row.valid
                          ? <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium"><Check className="w-3 h-3" />Valid</span>
                          : <span className="flex items-center gap-1 text-xs text-red-500 font-medium"><AlertCircle className="w-3 h-3" />{row.error}</span>
                        }
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => removeRow(row.rowNum)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-100 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep('upload')}>Back</Button>
            <Button
              className="flex-1 bg-[#E35000] hover:bg-[#c44600] text-white"
              onClick={() => { setStep('success'); setTimeout(() => onSuccess(validRows.length), 800); }}
              disabled={validRows.length === 0}
            >
              <Send className="w-4 h-4 mr-2" />Confirm & Send to {validRows.length} Employees
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── EmployeeDetailView ───────────────────────────────────────────────────────

function EmployeeDetailView({ employee, onBack, onTierChange, onRemove }: {
  employee: Employee; onBack: () => void; onTierChange: (id: string, tier: Tier) => void; onRemove: (emp: Employee) => void;
}) {
  const categoryConfig = [
    { key: 'Dining' as const, color: '#E35000', icon: Utensils },
    { key: 'Fuel' as const, color: '#3B82F6', icon: Fuel },
    { key: 'Grocery' as const, color: '#10B981', icon: ShoppingCart },
    { key: 'Pharmacy' as const, color: '#8B5CF6', icon: Pill },
  ];
  const totalCat = Object.values(employee.savingsByCategory).reduce((a, b) => a + b, 0);
  const maxCat = Math.max(...Object.values(employee.savingsByCategory), 1);
  const initials = employee.name.split(' ').map(n => n[0]).join('').slice(0, 2);
  const isActiveThisMonth = employee.status === 'Activated' && employee.lastActive === '2026-05-11';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
          <ArrowLeft className="w-4 h-4 text-gray-500" />
        </button>
        <div>
          <h2 className="text-xl font-semibold text-[#0E2250] dark:text-white">{employee.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{employee.department}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: profile + actions */}
        <div className="space-y-4">
          <Card className="border border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#141414]">
            <CardContent className="p-5">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0E2250] to-blue-600 flex items-center justify-center text-white text-xl font-bold mb-4">
                {initials}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-base">{employee.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{employee.department}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><Phone className="w-3.5 h-3.5 text-gray-400" />{employee.phone}</div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><Building2 className="w-3.5 h-3.5 text-gray-400" />{employee.department}</div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><Activity className="w-3.5 h-3.5 text-gray-400" />Joined {formatDate(employee.dateJoined)}</div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <TierBadge tier={employee.tier} />
                <StatusBadge status={employee.status} />
                {isActiveThisMonth && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />Active this month
                  </span>
                )}
              </div>
              {employee.activationDate && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">Activated {formatDate(employee.activationDate)}</p>
              )}
            </CardContent>
          </Card>

          <Card className="border border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#141414]">
            <CardContent className="p-4 space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Actions</p>
              <button
                onClick={() => onTierChange(employee.id, employee.tier === 'Silver' ? 'Gold' : 'Silver')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-amber-50 dark:hover:bg-amber-900/10 hover:text-amber-700 dark:hover:text-amber-400 transition-colors text-left"
              >
                <Medal className="w-4 h-4 text-amber-500" />
                {employee.tier === 'Silver' ? 'Upgrade to Gold' : 'Downgrade to Silver'}
              </button>
              {employee.status === 'Pending' && (
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:text-blue-700 dark:hover:text-blue-400 transition-colors text-left">
                  <Send className="w-4 h-4 text-blue-500" />Resend Activation Link
                </button>
              )}
              <button
                onClick={() => onRemove(employee)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 transition-colors text-left"
              >
                <Trash2 className="w-4 h-4 text-red-500" />Remove Employee
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Right: savings + merchants */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="border border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#141414]">
              <CardContent className="p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Savings This Month</p>
                <p className="text-2xl font-black text-[#0E2250] dark:text-white">{formatLKR(employee.savingsThisMonth)}</p>
              </CardContent>
            </Card>
            <Card className="border border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#141414]">
              <CardContent className="p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Total Savings</p>
                <p className="text-2xl font-black text-[#0E2250] dark:text-white">{formatLKR(employee.totalSavings)}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#141414]">
            <CardHeader className="pt-5 pb-2 px-5">
              <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-200">Savings by Category</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-4">
              {employee.status === 'Pending' ? (
                <p className="text-sm text-gray-400 dark:text-gray-500 py-4 text-center">No savings data — employee hasn't activated yet.</p>
              ) : categoryConfig.map(({ key, color, icon: Icon }) => {
                const amount = employee.savingsByCategory[key];
                const pct = totalCat > 0 ? (amount / totalCat) * 100 : 0;
                const barPct = (amount / maxCat) * 100;
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: color + '20' }}>
                          <Icon className="w-3.5 h-3.5" style={{ color }} />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{key}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{formatLKR(amount)}</span>
                        <span className="text-xs text-gray-400 ml-1.5">{pct.toFixed(0)}%</span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 dark:bg-[#2A2A2A] overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${barPct}%`, backgroundColor: color }} />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#141414]">
            <CardHeader className="pt-5 pb-2 px-5">
              <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-200">Merchants Visited This Month</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              {employee.merchantsVisited.length === 0 ? (
                <p className="text-sm text-gray-400 dark:text-gray-500 py-4 text-center">No merchants visited yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {employee.merchantsVisited.map(m => (
                    <span key={m} className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#2A2A2A]">{m}</span>
                  ))}
                </div>
              )}
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-3">Merchant names only — individual transaction amounts are not shown.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── EmployeeList ─────────────────────────────────────────────────────────────

function EmployeeList({ employees, onViewDetail, onRemove, onTierChange, onResend, onAddEmployee, onBulkUpload, onOpenTierDialog }: {
  employees: Employee[];
  onViewDetail: (emp: Employee) => void;
  onRemove: (emp: Employee) => void;
  onTierChange: (id: string, tier: Tier) => void;
  onResend: (emp: Employee) => void;
  onAddEmployee: () => void;
  onBulkUpload: () => void;
  onOpenTierDialog: (emp: Employee) => void;
}) {
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<'All' | Tier>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | ActivationStatus>('All');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  };

  const filtered = useMemo(() => {
    let list = employees.filter(e => {
      const q = search.toLowerCase();
      return (!q || e.name.toLowerCase().includes(q) || e.department.toLowerCase().includes(q) || e.status.toLowerCase().includes(q))
        && (tierFilter === 'All' || e.tier === tierFilter)
        && (statusFilter === 'All' || e.status === statusFilter);
    });
    return [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortKey === 'department') cmp = a.department.localeCompare(b.department);
      else if (sortKey === 'tier') cmp = a.tier.localeCompare(b.tier);
      else if (sortKey === 'status') cmp = a.status.localeCompare(b.status);
      else if (sortKey === 'dateJoined') cmp = a.dateJoined.localeCompare(b.dateJoined);
      else if (sortKey === 'savingsThisMonth') cmp = a.savingsThisMonth - b.savingsThisMonth;
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [employees, search, tierFilter, statusFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const allSelected = paginated.length > 0 && paginated.every(e => selected.has(e.id));
  const someSelected = paginated.some(e => selected.has(e.id));

  const toggleAll = () => {
    setSelected(prev => {
      const next = new Set(prev);
      if (allSelected) paginated.forEach(e => next.delete(e.id));
      else paginated.forEach(e => next.add(e.id));
      return next;
    });
  };

  const toggleOne = (id: string) => {
    setSelected(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  };

  const ColHeader = ({ col, label }: { col: SortKey; label: string }) => (
    <th className="px-4 py-3 text-left cursor-pointer select-none group" onClick={() => handleSort(col)}>
      <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors">
        {label}
        {sortKey === col
          ? (sortDir === 'asc' ? <ChevronUp className="w-3 h-3 text-[#E35000]" /> : <ChevronDown className="w-3 h-3 text-[#E35000]" />)
          : <ChevronDown className="w-3 h-3 text-gray-300 dark:text-gray-600" />
        }
      </div>
    </th>
  );

  const CheckBox = ({ checked, indeterminate, onClick }: { checked: boolean; indeterminate?: boolean; onClick: () => void }) => (
    <div
      onClick={onClick}
      className={cn(
        'w-4 h-4 rounded border-2 flex items-center justify-center cursor-pointer transition-colors flex-shrink-0',
        checked || indeterminate ? 'bg-[#E35000] border-[#E35000]' : 'border-gray-300 dark:border-gray-600 hover:border-[#E35000]'
      )}
    >
      {(checked || indeterminate) && <Check className="w-2.5 h-2.5 text-white" />}
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0E2250] dark:text-white transition-colors duration-300">Employees</h2>
          <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">
            {employees.length} total · {employees.filter(e => e.status === 'Activated').length} activated · {employees.filter(e => e.status === 'Pending').length} pending
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onBulkUpload}><UploadCloud className="w-3.5 h-3.5 mr-1.5" />Bulk Upload</Button>
          <Button size="sm" className="bg-[#E35000] hover:bg-[#c44600] text-white" onClick={onAddEmployee}><UserPlus className="w-3.5 h-3.5 mr-1.5" />Add Employee</Button>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input value={search} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setSearch(e.target.value); setPage(1); }} placeholder="Search employees..." className="pl-9" />
        </div>
        <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-100 dark:bg-white/5">
          {(['All', 'Bronze', 'Silver', 'Gold'] as const).map(t => (
            <button key={t} onClick={() => { setTierFilter(t); setPage(1); }} className={cn('px-3 py-1 rounded-md text-xs font-semibold transition-colors', tierFilter === t ? 'bg-white dark:bg-[#1C1C1C] text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200')}>{t}</button>
          ))}
        </div>
        <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-100 dark:bg-white/5">
          {(['All', 'Activated', 'Pending'] as const).map(s => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} className={cn('px-3 py-1 rounded-md text-xs font-semibold transition-colors', statusFilter === s ? 'bg-white dark:bg-[#1C1C1C] text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200')}>{s}</button>
          ))}
        </div>
      </div>

      {/* Bulk toolbar */}
      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-3 px-4 py-3 rounded-xl bg-[#0E2250] text-white">
          <span className="text-sm font-semibold">{selected.size} selected</span>
          <div className="flex-1" />
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium transition-colors" onClick={() => { employees.filter(e => selected.has(e.id) && e.status === 'Pending').forEach(e => onResend(e)); setSelected(new Set()); }}>
            <Send className="w-3.5 h-3.5" />Resend All
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-sm font-medium transition-colors" onClick={() => { employees.filter(e => selected.has(e.id) && e.tier === 'Silver').forEach(e => onTierChange(e.id, 'Gold')); setSelected(new Set()); }}>
            <Medal className="w-3.5 h-3.5" />Upgrade to Gold
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium transition-colors" onClick={() => setSelected(new Set())}>
            <X className="w-3.5 h-3.5" />Deselect
          </button>
        </div>
      )}

      {/* Desktop table */}
      <Card className="border border-gray-200 dark:border-[#2A2A2A] hidden md:block">
        <CardContent className="p-0 overflow-x-auto">
          {paginated.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <Search className="w-8 h-8 text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No employees match your filters</p>
              <button onClick={() => { setSearch(''); setTierFilter('All'); setStatusFilter('All'); }} className="mt-2 text-xs text-[#E35000] hover:underline">Clear filters</button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-[#2A2A2A] bg-gray-50/50 dark:bg-white/2">
                  <th className="px-4 py-3 w-10"><CheckBox checked={allSelected} indeterminate={someSelected && !allSelected} onClick={toggleAll} /></th>
                  <ColHeader col="name" label="Name" />
                  <ColHeader col="department" label="Department" />
                  <ColHeader col="tier" label="Tier" />
                  <ColHeader col="status" label="Status" />
                  <ColHeader col="dateJoined" label="Joined" />
                  <ColHeader col="savingsThisMonth" label="Savings" />
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-[#2A2A2A]">
                {paginated.map(emp => (
                  <tr key={emp.id} className={cn('transition-colors', selected.has(emp.id) ? 'bg-orange-50/50 dark:bg-orange-900/5' : 'hover:bg-gray-50 dark:hover:bg-white/2')}>
                    <td className="px-4 py-3.5"><CheckBox checked={selected.has(emp.id)} onClick={() => toggleOne(emp.id)} /></td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0E2250] to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {emp.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{emp.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 dark:text-gray-300">{emp.department}</td>
                    <td className="px-4 py-3.5"><TierBadge tier={emp.tier} /></td>
                    <td className="px-4 py-3.5"><StatusBadge status={emp.status} /></td>
                    <td className="px-4 py-3.5 text-gray-600 dark:text-gray-300 text-xs">{formatDate(emp.dateJoined)}</td>
                    <td className="px-4 py-3.5 font-semibold text-gray-900 dark:text-white text-xs">{emp.savingsThisMonth > 0 ? formatLKR(emp.savingsThisMonth) : '—'}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <button onClick={() => onViewDetail(emp)} title="View Detail" className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => onResend(emp)} title="Resend SMS" className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/10 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          <Send className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => onOpenTierDialog(emp)} title="Change tier" className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/10 text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                          <Medal className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => onRemove(emp)} title="Remove" className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Mobile card view */}
      <div className="md:hidden space-y-3">
        {paginated.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <Search className="w-8 h-8 text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No employees match</p>
          </div>
        ) : paginated.map(emp => (
          <Card key={emp.id} className="border border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#141414]">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0E2250] to-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {emp.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{emp.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{emp.department}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2"><TierBadge tier={emp.tier} /><StatusBadge status={emp.status} /></div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">{emp.savingsThisMonth > 0 ? formatLKR(emp.savingsThisMonth) : '—'}</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">this month</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-[#2A2A2A]">
                <button onClick={() => onViewDetail(emp)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                  <Eye className="w-3.5 h-3.5" />View
                </button>
                <button onClick={() => onResend(emp)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors">
                  <Send className="w-3.5 h-3.5" />Resend SMS
                </button>
                <button onClick={() => onRemove(emp)} className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-[#2A2A2A] disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{page} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-[#2A2A2A] disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── EmployeeManagement ───────────────────────────────────────────────────────

interface EmployeeManagementProps {
  onNavigate: (view: string) => void;
}

export function EmployeeManagement({ onNavigate }: EmployeeManagementProps) {
  const [view, setView] = useState<EmpView>('list');
  const [employees, setEmployees] = useState<Employee[]>(DEMO_EMPLOYEES);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [removeTarget, setRemoveTarget] = useState<Employee | null>(null);
  const [tierChangeTarget, setTierChangeTarget] = useState<Employee | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'info' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'info' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleTierChange = (id: string, newTier: Tier) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, tier: newTier } : e));
    setSelectedEmployee(prev => prev?.id === id ? { ...prev, tier: newTier } : prev);
    showToast(`Tier updated to ${newTier}`);
  };

  const handleResend = (emp: Employee) => showToast(`Activation SMS resent to ${emp.name}`);

  const handleRemoveConfirm = () => {
    if (!removeTarget) return;
    setEmployees(prev => prev.filter(e => e.id !== removeTarget.id));
    showToast(`${removeTarget.name} will be removed at month end`, 'info');
    setRemoveTarget(null);
    if (view === 'detail') setView('list');
  };

  const handleAddSuccess = (emp: Employee) => {
    setEmployees(prev => [emp, ...prev]);
    setTimeout(() => setView('list'), 600);
  };

  const handleBulkSuccess = (count: number) => {
    showToast(`${count} employees added — links sent`);
    setTimeout(() => setView('list'), 1500);
  };

  const renderContent = () => {
    switch (view) {
      case 'add':
        return <AddEmployeeForm onBack={() => setView('list')} onSuccess={handleAddSuccess} />;
      case 'bulk':
        return <BulkUploadScreen onBack={() => setView('list')} onSuccess={handleBulkSuccess} />;
      case 'detail':
        return selectedEmployee ? (
          <EmployeeDetailView
            employee={selectedEmployee}
            onBack={() => setView('list')}
            onTierChange={handleTierChange}
            onRemove={setRemoveTarget}
          />
        ) : null;
      default:
        return employees.length === 0 ? (
          <EmployeeEmptyState onAddEmployee={() => setView('add')} onBulkUpload={() => setView('bulk')} />
        ) : (
          <EmployeeList
            employees={employees}
            onViewDetail={(emp) => { setSelectedEmployee(emp); setView('detail'); }}
            onRemove={setRemoveTarget}
            onTierChange={handleTierChange}
            onResend={handleResend}
            onAddEmployee={() => setView('add')}
            onBulkUpload={() => setView('bulk')}
            onOpenTierDialog={(emp) => setTierChangeTarget(emp)}
          />
        );
    }
  };

  return (
    <div className="relative">
      {renderContent()}
      <RemoveDialog employee={removeTarget} onConfirm={handleRemoveConfirm} onCancel={() => setRemoveTarget(null)} />
      <TierChangeDialog
        employee={tierChangeTarget}
        onConfirm={(tier) => {
          if (tierChangeTarget) handleTierChange(tierChangeTarget.id, tier);
          setTierChangeTarget(null);
        }}
        onCancel={() => setTierChangeTarget(null)}
      />
      {toast && (
        <div className={cn(
          'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-sm font-medium',
          toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-[#0E2250] text-white'
        )}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}

import React, { useState, useRef } from 'react';
import {
  User, Mail, Phone, Building, MapPin, Edit2, Save, XCircle,
  Lock, Upload, Globe, Bell, Shield, Crown, Check, ChevronRight,
  Eye, EyeOff, CheckCircle2, AlertCircle, Info, Loader2, Calendar,
  ShieldCheck,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '../ui/input-otp';
import { cn } from '../../lib/utils';
import { useTheme } from 'next-themes@0.4.6';
import { toast } from 'sonner@2.0.3';

interface HRSettingsProps { onNavigate: (view: string) => void; }

// ─── InfoItem — mirrors Profile.tsx's pattern ─────────────────────────────────

interface InfoItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
  field: string;
  isEditing: boolean;
  onChange: (field: string, value: string) => void;
  type?: string;
  required?: boolean;
  verified?: boolean;
  onVerify?: () => void;
}

function InfoItem({ icon: Icon, label, value, field, isEditing, onChange, type = 'text', required, verified, onVerify }: InfoItemProps) {
  return (
    <div className="flex items-start space-x-4 py-2">
      <div className="mt-1 bg-blue-50 dark:bg-[#E35000]/10 p-2 rounded-lg text-[#231F20] dark:text-[#E35000] flex-shrink-0 transition-colors duration-300">
        <Icon size={16} />
      </div>
      <div className="flex-1 space-y-1 min-w-0">
        <div className="flex items-center gap-1">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">{label}</p>
          {required && <span className="text-red-500 text-xs">*</span>}
        </div>
        {isEditing ? (
          <div className="flex gap-2 items-center">
            <Input
              type={type}
              value={value}
              onChange={e => onChange(field, e.target.value)}
              className={cn('h-8 text-sm flex-1', required && !value ? 'border-red-300 bg-red-50' : '')}
            />
            {verified === false && onVerify && (
              <Button size="sm" onClick={onVerify} className="bg-[#E35000] hover:bg-[#c44500] text-white text-xs h-8 px-3 shrink-0">
                Verify
              </Button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-900 dark:text-white break-words leading-relaxed truncate transition-colors duration-300">
              {value || '-'}
            </p>
            {verified !== undefined && (
              verified ? (
                <Badge variant="secondary" className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 text-[10px] h-5 px-1.5 rounded border border-emerald-200 dark:border-emerald-800">
                  <Check size={10} className="mr-1" /> Verified
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-100 text-[10px] h-5 px-1.5 rounded border border-yellow-200 dark:border-yellow-800">
                  Not Verified
                </Badge>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── HRSettings ───────────────────────────────────────────────────────────────

export function HRSettings({ onNavigate }: HRSettingsProps) {
  const { theme, resolvedTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [profile, setProfile] = useState({
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NjAzNzI4N3ww&ixlib=rb-4.1.0&q=80&w=200',
    hrManagerName: 'Sarah Johnson',
    companyName: 'Axora Technologies',
    regNo: 'PV 12345',
    workEmail: 'hello@axoratech.com',
    mobile: '+94 77 123 4567',
    address: '77 Galle Rd, Colombo 00300, Sri Lanka',
    website: 'https://www.axoratech.com',
    joinedDate: '2023-08-15',
    status: 'Active',
  });

  const [verifiedEmail, setVerifiedEmail] = useState(true);
  const [verifiedMobile, setVerifiedMobile] = useState(true);

  // Change Plan dialog
  const [showChangePlan, setShowChangePlan] = useState(false);
  const [cpPlan, setCpPlan] = useState<'Starter' | 'Growth' | 'Enterprise'>('Growth');
  const [cpTier, setCpTier] = useState<'Silver' | 'Gold'>('Gold');
  const [cpSeats, setCpSeats] = useState(500);
  const [cpAnnual, setCpAnnual] = useState(false);

  const PLANS = [
    { name: 'Starter'    as const, range: '50 – 199',   min: 50,   max: 199,  silver: 1500, gold: 2800, annual: false },
    { name: 'Growth'     as const, range: '200 – 999',  min: 200,  max: 999,  silver: 1200, gold: 2400, annual: true  },
    { name: 'Enterprise' as const, range: '1,000+',     min: 1000, max: 99999,silver: 1000, gold: 2000, annual: true  },
  ] as const;

  const activePlan = PLANS.find(p => p.name === cpPlan)!;
  const pricePerSeat = cpTier === 'Silver' ? activePlan.silver : activePlan.gold;
  const monthlyTotal = pricePerSeat * cpSeats;
  const annualTotal  = monthlyTotal * 10;
  const displayTotal = cpAnnual && activePlan.annual ? annualTotal : monthlyTotal;
  const fmtLKR = (n: number) => `LKR ${n.toLocaleString('en-LK')}`;

  // Password dialog
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otp, setOtp] = useState('');

  // OTP verify dialog (for email/mobile)
  const [isOtpVerifyOpen, setIsOtpVerifyOpen] = useState(false);
  const [otpVerifyTarget, setOtpVerifyTarget] = useState<'email' | 'mobile' | null>(null);
  const [otpVerify, setOtpVerify] = useState('');

  // Notifications
  const [notifyInvoice, setNotifyInvoice] = useState(true);
  const [notifyActivation, setNotifyActivation] = useState(true);
  const [notifyRedemption, setNotifyRedemption] = useState(false);
  const [notifyOverdue, setNotifyOverdue] = useState(true);
  const [isSavingNotifs, setIsSavingNotifs] = useState(false);

  const handleChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    if (field === 'workEmail') setVerifiedEmail(false);
    if (field === 'mobile') setVerifiedMobile(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setProfile(prev => ({ ...prev, photo: url }));
    toast.success('Profile photo updated');
  };

  const handleSave = () => {
    if (!profile.companyName || !profile.hrManagerName || !profile.workEmail || !profile.mobile) {
      toast.error('Please fill all required fields');
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    }, 900);
  };

  const handleCancel = () => setIsEditing(false);

  const handleVerifyClick = (field: 'email' | 'mobile') => {
    setOtpVerifyTarget(field);
    setOtpVerify('');
    setIsOtpVerifyOpen(true);
    toast.success(`OTP sent to ${field === 'email' ? profile.workEmail : profile.mobile}`);
  };

  const handleOtpVerifySubmit = () => {
    if (otpVerify.length < 6) { toast.error('Enter the 6-digit code'); return; }
    if (otpVerifyTarget === 'email') setVerifiedEmail(true);
    if (otpVerifyTarget === 'mobile') setVerifiedMobile(true);
    setIsOtpVerifyOpen(false);
    toast.success(`${otpVerifyTarget === 'email' ? 'Email' : 'Mobile'} verified successfully`);
  };

  const handlePasswordSubmit = () => {
    if (!isOtpStep) {
      if (!passwordForm.current) { toast.error('Enter your current password'); return; }
      if (passwordForm.next.length < 8) { toast.error('New password must be at least 8 characters'); return; }
      if (passwordForm.next !== passwordForm.confirm) { toast.error('Passwords do not match'); return; }
      setIsOtpStep(true);
      toast.success(`OTP sent to ${profile.workEmail}`);
      return;
    }
    if (otp.length < 6) { toast.error('Enter the 6-digit code'); return; }
    setIsPasswordOpen(false);
    setIsOtpStep(false);
    setPasswordForm({ current: '', next: '', confirm: '' });
    setOtp('');
    toast.success('Password changed successfully');
  };

  const cardHead = 'border-b border-gray-100 dark:border-[#2A2A2A] bg-gradient-to-r from-gray-50 to-white dark:from-[#0A0A0A] dark:to-[#141414] transition-colors duration-300 pt-4 pb-3 px-5';

  const Toggle = ({ value, onToggle }: { value: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      role="switch"
      aria-checked={value}
      className="relative flex-shrink-0 rounded-full transition-colors duration-200 focus:outline-none"
      style={{ width: 44, height: 24, background: value ? '#E35000' : '#D1D5DB' }}
    >
      <span
        className="absolute rounded-full bg-white"
        style={{
          width: 18,
          height: 18,
          top: 3,
          left: 3,
          boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
          transform: value ? 'translateX(20px)' : 'translateX(0px)',
          transition: 'transform 0.2s ease',
        }}
      />
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto pb-20 lg:pb-0 space-y-6">

      {/* ── Header Card — mirrors Profile.tsx ── */}
      <Card className="border-none shadow-sm bg-white dark:bg-gradient-to-br dark:from-[#0A0A0A] dark:to-[#141414] transition-colors duration-300">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-6">

            {/* Photo + name */}
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Circular photo with upload overlay */}
              <div className="relative group flex-shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden border-2 border-gray-100 dark:border-[#2A2A2A] bg-gray-50 dark:bg-[#1C1C1C]/50 shadow-sm transition-colors duration-300">
                  <img src={profile.photo} alt="Profile" className="w-full h-full object-cover" />
                </div>
                {isEditing && (
                  <div
                    className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                  </div>
                )}
              </div>

              {/* Name, company, meta */}
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#231F20] dark:text-white truncate transition-colors duration-300">
                    {profile.hrManagerName}
                  </h2>
                  <Badge className={cn(
                    'hover:bg-emerald-600 text-xs',
                    profile.status === 'Active' ? 'bg-emerald-500' : 'bg-yellow-500'
                  )}>
                    {profile.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex-wrap transition-colors duration-300">
                  <span className="flex items-center gap-1.5">
                    <Building size={14} /> {profile.companyName}
                  </span>
                  <span className="hidden sm:flex items-center gap-1.5">
                    <Calendar size={14} /> Joined {profile.joinedDate}
                  </span>
                
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:ml-auto">
              {!isEditing && (
                <Button
                  variant="outline"
                  onClick={() => setIsPasswordOpen(true)}
                  className="w-full sm:w-auto text-xs sm:text-sm text-gray-600 dark:text-gray-200 border-gray-300 dark:border-[#2A2A2A] hover:bg-gray-50 dark:hover:bg-white/10 h-9 sm:h-10 shadow-sm transition-colors duration-300"
                >
                  <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                  Change Password
                </Button>
              )}
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1 sm:flex-none text-xs sm:text-sm text-gray-600 dark:text-gray-200 border-gray-300 dark:border-[#2A2A2A] hover:bg-gray-50 dark:hover:bg-white/10 h-9 sm:h-10 shadow-sm transition-colors duration-300"
                  >
                    <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 sm:flex-none bg-[#E35000] hover:bg-[#c44500] text-white text-xs sm:text-sm h-9 sm:h-10 transition-colors duration-300"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />}
                    {isSaving ? 'Saving…' : 'Save Changes'}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="w-full sm:w-auto bg-[#0E2250] hover:bg-[#0E2250]/90 dark:bg-[#E35000] dark:hover:bg-[#c44500] text-white text-xs sm:text-sm h-9 sm:h-10 shadow-sm transition-colors duration-300"
                >
                  <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Flat grid: each row pairs left card (col-span-2) + right card (col-span-1) — grid stretch equalises heights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Row 1 left: HR Manager ── */}
        <Card className="lg:col-span-2 border-none shadow-sm bg-white dark:bg-gradient-to-br dark:from-[#0A0A0A] dark:to-[#141414] transition-colors duration-300">
          <CardHeader className={cardHead}>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <CardTitle className="text-[#0E2250] dark:text-white text-base sm:text-[18px] transition-colors duration-300">
             Contact Information
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 divide-y divide-gray-100 dark:divide-[#2A2A2A]">
            <InfoItem
              icon={User}
              label="Full Name"
              field="hrManagerName"
              value={profile.hrManagerName}
              isEditing={isEditing}
              onChange={handleChange}
              required
            />
            <InfoItem
              icon={Mail}
              label="Work Email"
              field="workEmail"
              value={profile.workEmail}
              type="email"
              isEditing={isEditing}
              onChange={handleChange}
              required
              verified={verifiedEmail}
              onVerify={() => handleVerifyClick('email')}
            />
            <InfoItem
              icon={Phone}
              label="Mobile (WhatsApp)"
              field="mobile"
              value={profile.mobile}
              type="tel"
              isEditing={isEditing}
              onChange={handleChange}
              required
              verified={verifiedMobile}
              onVerify={() => handleVerifyClick('mobile')}
            />
          </CardContent>
        </Card>

        {/* ── Row 1 right: Subscription — exact Profile.tsx style ── */}
        <Card className="border-none shadow-lg bg-gradient-to-br from-[#0E2250] to-[#1e3a8a] text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#E35000] rounded-full blur-3xl opacity-20 -mr-10 -mt-10" />
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-gray-300 text-xs font-medium mb-1 uppercase tracking-wide">Current Plan</p>
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  Gold Plan <Crown size={20} className="text-[#E35000] fill-[#E35000]" />
                </h3>
              </div>
              <span className="bg-[#E35000] text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">ACTIVE</span>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-gray-300 border-b border-white/10 pb-2">
                <span>Billing Cycle</span>
                <span className="font-medium text-white">Monthly</span>
              </div>
              <div className="flex justify-between text-sm text-gray-300 border-b border-white/10 pb-2">
                <span>Next Renewal</span>
                <span className="font-medium text-white">Jun 1, 2026</span>
              </div>
              <div className="flex justify-between text-sm text-gray-300">
                <span>Amount</span>
                <span className="font-medium text-white">LKR 600,000</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button onClick={() => setShowChangePlan(true)} className="w-full bg-white text-[#0E2250] hover:bg-gray-100 font-bold transition-colors group">
                <Crown size={16} className="mr-2 text-[#E35000]" />
                Change Plan
              </Button>
              <Button
                onClick={() => onNavigate('hr-billing')}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/20 transition-colors"
              >
                <ChevronRight size={16} className="mr-2" />
                Manage Billing
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ── Row 2 left: Company Info ── */}
        <Card className="lg:col-span-2 border-none shadow-sm bg-white dark:bg-gradient-to-br dark:from-[#0A0A0A] dark:to-[#141414] transition-colors duration-300">
          <CardHeader className={cardHead}>
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-gray-400" />
              <CardTitle className="text-[#0E2250] dark:text-white text-base sm:text-[18px] transition-colors duration-300">
                Company Information
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 divide-y divide-gray-100 dark:divide-[#2A2A2A]">
            <InfoItem icon={Building} label="Company Name" field="companyName" value={profile.companyName} isEditing={isEditing} onChange={handleChange} required />
            <InfoItem icon={Shield} label="Registration No." field="regNo" value={profile.regNo} isEditing={isEditing} onChange={handleChange} />
            <InfoItem icon={MapPin} label="Address" field="address" value={profile.address} isEditing={isEditing} onChange={handleChange} />
            <InfoItem icon={Globe} label="Website" field="website" value={profile.website} type="url" isEditing={isEditing} onChange={handleChange} />
          </CardContent>
        </Card>

        {/* ── Row 2 right: Notifications ── */}
        <Card className="border-none shadow-sm bg-white dark:bg-gradient-to-br dark:from-[#0A0A0A] dark:to-[#141414] transition-colors duration-300">
          <CardHeader className={cardHead}>
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-gray-400" />
              <CardTitle className="text-[#0E2250] dark:text-white text-base transition-colors duration-300">Notifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-5 space-y-4">
            {[
              { label: 'Invoice issued',      value: notifyInvoice,    toggle: () => setNotifyInvoice(v => !v) },
              { label: 'Employee activation', value: notifyActivation, toggle: () => setNotifyActivation(v => !v) },
              { label: 'Redemptions digest',  value: notifyRedemption, toggle: () => setNotifyRedemption(v => !v) },
              { label: 'Overdue reminders',   value: notifyOverdue,    toggle: () => setNotifyOverdue(v => !v) },
            ].map(pref => (
              <div key={pref.label} className="flex items-center justify-between gap-3">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{pref.label}</p>
                <Toggle value={pref.value} onToggle={pref.toggle} />
              </div>
            ))}
            <Button
              size="sm"
              onClick={() => { setIsSavingNotifs(true); setTimeout(() => { setIsSavingNotifs(false); toast.success('Preferences saved'); }, 700); }}
              disabled={isSavingNotifs}
              className="w-full bg-[#E35000] hover:bg-[#c44500] text-white text-xs mt-2"
            >
              {isSavingNotifs ? 'Saving…' : 'Save Preferences'}
            </Button>
          </CardContent>
        </Card>

      </div>

      {/* ── Change Plan Dialog ── */}
      <Dialog open={showChangePlan} onOpenChange={setShowChangePlan}>
        <DialogContent className="sm:max-w-2xl bg-white dark:bg-[#141414] border-gray-200 dark:border-[#2A2A2A]">
          <DialogHeader>
            <DialogTitle className="text-[#0E2250] dark:text-white text-lg">Change Plan</DialogTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400">Select a plan and configure your seats</p>
          </DialogHeader>

          <div className="space-y-5 py-2">

            {/* Plan cards */}
            <div className="grid grid-cols-3 gap-3">
              {PLANS.map(plan => {
                const isActive = cpPlan === plan.name;
                return (
                  <button
                    key={plan.name}
                    onClick={() => {
                      setCpPlan(plan.name);
                      const clamped = Math.min(Math.max(cpSeats, plan.min), plan.max === 99999 ? cpSeats : plan.max);
                      setCpSeats(clamped);
                      if (!plan.annual) setCpAnnual(false);
                    }}
                    className={cn(
                      'text-left p-4 rounded-xl border-2 transition-all',
                      isActive
                        ? 'border-[#E35000] bg-[#E35000]/5 dark:bg-[#E35000]/10'
                        : 'border-gray-200 dark:border-[#2A2A2A] hover:border-gray-300 dark:hover:border-gray-500'
                    )}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <p className={cn('text-sm font-bold', isActive ? 'text-[#E35000]' : 'text-gray-900 dark:text-white')}>{plan.name}</p>
                      {isActive && <span className="text-[10px] font-bold bg-[#E35000]/10 text-[#E35000] border border-[#E35000]/20 px-1.5 py-0.5 rounded-full">Selected</span>}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{plan.range} seats</p>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Silver/seat</span>
                        <span className="font-semibold text-gray-700 dark:text-gray-200">LKR {plan.silver.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Gold/seat</span>
                        <span className="font-semibold text-amber-600 dark:text-amber-400">LKR {plan.gold.toLocaleString()}</span>
                      </div>
                    </div>
                    {plan.annual
                      ? <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-2.5 font-medium">✓ Annual: 10 mo + 2 free</p>
                      : <p className="text-[10px] text-gray-400 mt-2.5">Monthly only</p>
                    }
                  </button>
                );
              })}
            </div>

            {/* Seat tier + seat count */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">Seat Tier</p>
                <div className="flex gap-2">
                  {(['Silver', 'Gold'] as const).map(tier => (
                    <button
                      key={tier}
                      onClick={() => setCpTier(tier)}
                      className={cn(
                        'flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all',
                        cpTier === tier
                          ? tier === 'Gold'
                            ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
                            : 'border-gray-400 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200'
                          : 'border-gray-200 dark:border-[#2A2A2A] text-gray-500 dark:text-gray-400 hover:border-gray-300'
                      )}
                    >
                      {tier === 'Gold' && <Crown size={12} className="inline mr-1 text-amber-500" />}
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">
                  Seat Count <span className="text-gray-400 font-normal normal-case">({activePlan.range})</span>
                </p>
                <input
                  type="number"
                  min={activePlan.min}
                  max={activePlan.name === 'Enterprise' ? undefined : activePlan.max}
                  value={cpSeats}
                  onChange={e => {
                    const v = Math.max(activePlan.min, parseInt(e.target.value) || activePlan.min);
                    setCpSeats(activePlan.name === 'Enterprise' ? v : Math.min(v, activePlan.max));
                  }}
                  className="w-full px-3 py-2.5 text-sm bg-white dark:bg-[#1C1C1C] border border-gray-300 dark:border-[#2A2A2A] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E35000]/30 focus:border-[#E35000] text-gray-900 dark:text-white transition-colors"
                />
              </div>
            </div>

            {/* Annual billing toggle */}
            {activePlan.annual && (
              <button
                onClick={() => setCpAnnual(v => !v)}
                className={cn(
                  'w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all',
                  cpAnnual ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/10' : 'border-gray-200 dark:border-[#2A2A2A] hover:border-gray-300'
                )}
              >
                <div className="text-left">
                  <p className={cn('text-sm font-semibold', cpAnnual ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-700 dark:text-gray-300')}>
                    Annual billing — 10 months + 2 free
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Pay once a year and get 2 months free</p>
                </div>
                <div className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-4',
                  cpAnnual ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300 dark:border-gray-600'
                )}>
                  {cpAnnual && <Check size={11} className="text-white" />}
                </div>
              </button>
            )}

            {/* Summary */}
            <div className="rounded-xl bg-gray-50 dark:bg-[#1C1C1C] border border-gray-200 dark:border-[#2A2A2A] p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">{cpPlan} · {cpTier} · {cpSeats.toLocaleString()} seats</span>
                <span className="font-medium text-gray-700 dark:text-gray-200">{fmtLKR(pricePerSeat)}/seat</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-gray-500 dark:text-gray-400">{cpAnnual && activePlan.annual ? 'Annual total (10 months)' : 'Monthly total'}</span>
                <span className="font-bold text-[#0E2250] dark:text-white text-xl">{fmtLKR(displayTotal)}</span>
              </div>
              {cpAnnual && activePlan.annual && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  You save {fmtLKR(monthlyTotal * 2)} compared to monthly billing
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowChangePlan(false)} className="text-sm">Cancel</Button>
            <Button
              onClick={() => { setShowChangePlan(false); toast.success(`Plan updated to ${cpPlan} · ${cpTier} · ${cpSeats.toLocaleString()} seats`); }}
              className="bg-[#E35000] hover:bg-[#c44500] text-white text-sm"
            >
              Confirm Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── OTP Verify Dialog (email / mobile) ── */}
      <Dialog open={isOtpVerifyOpen} onOpenChange={open => { setIsOtpVerifyOpen(open); if (!open) setOtpVerify(''); }}>
        <DialogContent className="sm:max-w-sm bg-white dark:bg-[#141414] border-gray-200 dark:border-[#2A2A2A]">
          <DialogHeader>
            <DialogTitle className="text-[#0E2250] dark:text-white">
              Verify {otpVerifyTarget === 'email' ? 'Email' : 'Mobile'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/40">
              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                A 6-digit code was sent to <strong>{otpVerifyTarget === 'email' ? profile.workEmail : profile.mobile}</strong>
              </p>
            </div>
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otpVerify} onChange={setOtpVerify}>
                <InputOTPGroup className="gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      className="w-10 h-12 border-2 border-gray-300 dark:border-[#2A2A2A] dark:bg-[#1C1C1C] rounded-lg text-lg font-bold text-[#0E2250] dark:text-white focus:border-[#E35000] transition-colors duration-300"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOtpVerifyOpen(false)} className="text-sm">Cancel</Button>
            <Button onClick={handleOtpVerifySubmit} className="bg-[#E35000] hover:bg-[#c44500] text-white text-sm">Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Change Password Dialog ── */}
      <Dialog open={isPasswordOpen} onOpenChange={open => { setIsPasswordOpen(open); if (!open) { setIsOtpStep(false); setPasswordForm({ current: '', next: '', confirm: '' }); setOtp(''); } }}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-[#141414] border-gray-200 dark:border-[#2A2A2A]">
          <DialogHeader>
            <DialogTitle className="text-[#0E2250] dark:text-white">
              {isOtpStep ? 'Verify your identity' : 'Change Password'}
            </DialogTitle>
          </DialogHeader>

          {!isOtpStep ? (
            <div className="space-y-4 py-2">
              <div>
                <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Current Password</Label>
                <div className="relative">
                  <Input
                    type={showCurrent ? 'text' : 'password'}
                    value={passwordForm.current}
                    onChange={e => setPasswordForm(f => ({ ...f, current: e.target.value }))}
                    className="pr-10 text-sm"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowCurrent(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">New Password</Label>
                <div className="relative">
                  <Input
                    type={showNext ? 'text' : 'password'}
                    value={passwordForm.next}
                    onChange={e => setPasswordForm(f => ({ ...f, next: e.target.value }))}
                    className="pr-10 text-sm"
                    placeholder="Min. 8 characters"
                  />
                  <button type="button" onClick={() => setShowNext(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    {showNext ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordForm.next && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    {passwordForm.next.length >= 8
                      ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      : <AlertCircle className="w-3.5 h-3.5 text-amber-500" />}
                    <p className={cn('text-[11px]', passwordForm.next.length >= 8 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400')}>
                      {passwordForm.next.length >= 8 ? 'Strong password' : 'At least 8 characters required'}
                    </p>
                  </div>
                )}
              </div>
              <div>
                <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Confirm New Password</Label>
                <Input
                  type="password"
                  value={passwordForm.confirm}
                  onChange={e => setPasswordForm(f => ({ ...f, confirm: e.target.value }))}
                  className="text-sm"
                  placeholder="••••••••"
                />
                {passwordForm.confirm && passwordForm.next !== passwordForm.confirm && (
                  <p className="text-[11px] text-red-500 mt-1.5">Passwords do not match</p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/40">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                  A 6-digit code was sent to <strong>{profile.workEmail}</strong>
                </p>
              </div>
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup className="gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className="w-10 h-12 border-2 border-gray-300 dark:border-[#2A2A2A] dark:bg-[#1C1C1C] rounded-lg text-lg font-bold text-[#0E2250] dark:text-white focus:border-[#E35000] transition-colors duration-300"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setIsPasswordOpen(false); setIsOtpStep(false); }} className="text-sm">Cancel</Button>
            <Button onClick={handlePasswordSubmit} className="bg-[#E35000] hover:bg-[#c44500] text-white text-sm">
              {isOtpStep ? 'Confirm Change' : 'Continue'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

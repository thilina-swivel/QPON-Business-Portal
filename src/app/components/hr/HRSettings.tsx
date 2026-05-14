import React, { useState, useRef } from 'react';
import {
  User, Mail, Phone, Building, MapPin, Edit2, Save, XCircle,
  Upload, Globe, Bell, Shield, Crown, Check, ChevronRight,
  Eye, EyeOff, CheckCircle2, AlertCircle, Info, Loader2, Calendar,
  ShieldCheck, AlertTriangle,
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

interface HRSettingsProps { onNavigate: (view: string) => void; onChangePlan?: () => void; }

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

export function HRSettings({ onNavigate, onChangePlan }: HRSettingsProps) {
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

  // Cancel subscription dialog
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelSubscription = () => {
    setIsCancelling(true);
    setTimeout(() => {
      setIsCancelling(false);
      setShowCancelDialog(false);
      toast.success('Subscription cancelled. Access continues until Jun 1, 2026.');
    }, 1200);
  };

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

      {/* ── Page Title ── */}
      <div>
        <h2 className="text-2xl font-bold text-[#0E2250] dark:text-white transition-colors duration-300">Settings</h2>
        <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">Manage your company profile and preferences</p>
      </div>

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
                  <h2 className="text-xl font-bold text-[#0E2250] dark:text-white truncate transition-colors duration-300">
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
              label="Mobile"
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
              <Button onClick={() => onChangePlan?.()} className="w-full bg-white text-[#0E2250] hover:bg-gray-100 font-bold transition-colors group">
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
              <Button
                onClick={() => setShowCancelDialog(true)}
                className="w-full bg-transparent hover:bg-red-500/10 text-red-300 hover:text-red-200 font-medium border border-red-400/30 hover:border-red-400/50 transition-colors text-sm"
              >
                Cancel Subscription
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

      {/* ── Cancel Subscription Dialog ── */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-[#141414] border-gray-200 dark:border-[#2A2A2A]">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <DialogTitle className="text-[#0E2250] dark:text-white">Cancel Subscription?</DialogTitle>
            </div>
          </DialogHeader>
          <div className="space-y-4 py-1">
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Your subscription will be cancelled at the end of the current billing period. You'll retain full access until <strong className="text-[#0E2250] dark:text-white">Jun 1, 2026</strong>.
            </p>
            <div className="rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/40 p-4 space-y-2">
              <p className="text-xs font-semibold text-red-700 dark:text-red-400 uppercase tracking-wide">What you'll lose</p>
              <ul className="space-y-1.5">
                {['SMS coupon delivery for all employees', 'Analytics dashboard & reports', 'Dedicated account manager access'].map(item => (
                  <li key={item} className="flex items-start gap-2 text-xs text-red-600 dark:text-red-300">
                    <span className="mt-0.5 flex-shrink-0">×</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              All employees will be notified via SMS when their access ends.
            </p>
          </div>
          <DialogFooter className="gap-2 mt-2">
            <Button variant="outline" onClick={() => setShowCancelDialog(false)} className="text-sm flex-1">
              Keep Subscription
            </Button>
            <Button
              onClick={handleCancelSubscription}
              disabled={isCancelling}
              className="bg-red-500 hover:bg-red-600 text-white text-sm flex-1"
            >
              {isCancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Yes, Cancel'}
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

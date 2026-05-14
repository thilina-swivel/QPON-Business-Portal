import React, { useState, useEffect } from 'react';
import { ArrowRight, Loader2, Mail, Smartphone, User, Building2, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { AuthLayout } from './AuthLayout';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { toast } from 'sonner@2.0.3';

interface SignUpProps {
  onSignUp: () => void;
  onNavigateToSignIn: () => void;
}

export function SignUp({ onSignUp, onNavigateToSignIn }: SignUpProps) {
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [isLoading, setIsLoading] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [formData, setFormData] = useState({
    companyName: '',
    hrName: '',
    email: '',
    mobile: ''
  });

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  useEffect(() => {
    if (otpValue.length === 6 && !isLoading) handleOtpSubmit();
  }, [otpValue]);

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
      setResendTimer(60);
      toast.success('OTP sent to your mobile via SMS');
    }, 1500);
  };

  const handleOtpSubmit = () => {
    if (otpValue.length < 6) { toast.error('Enter the complete 6-digit code'); return; }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Account created! Set up your subscription.');
      onSignUp();
    }, 1500);
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setResendTimer(60);
      setOtpValue('');
      toast.success('New OTP sent to your mobile via SMS');
    }, 1000);
  };

  if (step === 'otp') {
    return (
      <AuthLayout
        title="Verify Mobile Number"
        subtitle={`We sent a 6-digit code to ${formData.mobile}`}
      >
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-full transition-colors duration-300">
              <ShieldCheck size={16} className="text-green-600 dark:text-green-400" />
              <span className="text-xs font-medium text-green-700 dark:text-green-300">Sent via SMS</span>
            </div>
          </div>

          <div className="flex justify-center py-2">
            <InputOTP maxLength={6} value={otpValue} onChange={setOtpValue}>
              <InputOTPGroup className="gap-2">
                {[0, 1, 2, 3, 4, 5].map(i => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                    className="w-11 h-13 border-2 border-gray-300 dark:border-[#2A2A2A] dark:bg-[#1C1C1C] rounded-lg text-xl font-bold text-[#0E2250] dark:text-white focus:border-[#E35000] transition-colors duration-300"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          {resendTimer > 0 && (
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                Resend in <span className="font-semibold text-[#0E2250] dark:text-white">{resendTimer}s</span>
              </p>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <Button
              onClick={handleOtpSubmit}
              className="w-full h-12 bg-[#E35000] hover:bg-[#c44500] text-white font-medium text-base transition-colors duration-300"
              disabled={isLoading || otpValue.length < 6}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Create Account'}
            </Button>

            <div className="flex justify-between items-center pt-1">
              <button
                type="button"
                onClick={() => { setStep('details'); setOtpValue(''); setResendTimer(0); }}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center transition-colors duration-300"
              >
                <ArrowLeft size={14} className="mr-1" /> Back
              </button>
              <button
                type="button"
                onClick={handleResend}
                disabled={resendTimer > 0}
                className={`text-sm font-medium transition-colors duration-300 ${
                  resendTimer > 0
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : 'text-[#E35000] hover:text-[#c44500]'
                }`}
              >
                Resend Code
              </button>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-lg p-3 transition-colors duration-300">
            <p className="text-xs text-green-800 dark:text-green-300 text-center transition-colors duration-300">
              Check your SMS for the OTP message from QPON Business.
            </p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Register Your Company"
      subtitle="Set up QPON employee benefits in under 10 minutes"
    >
      <div className="space-y-6">
        <form onSubmit={handleDetailsSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName" className="dark:text-gray-200 transition-colors duration-300">Company Name <span className="text-red-500">*</span></Label>
            <div className="relative">
              <div className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500 transition-colors duration-300">
                <Building2 size={18} />
              </div>
              <Input
                id="companyName"
                type="text"
                placeholder="Axora Technologies (Pvt) Ltd"
                className="pl-10 h-11 bg-gray-50 dark:bg-[#1C1C1C] border-gray-200 dark:border-[#2A2A2A] focus:bg-white dark:focus:bg-[#141414] dark:text-white dark:placeholder-gray-500 transition-colors duration-300"
                value={formData.companyName}
                onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hrName" className="dark:text-gray-200 transition-colors duration-300">HR Manager Full Name <span className="text-red-500">*</span></Label>
            <div className="relative">
              <div className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500 transition-colors duration-300">
                <User size={18} />
              </div>
              <Input
                id="hrName"
                type="text"
                placeholder="Amal Perera"
                className="pl-10 h-11 bg-gray-50 dark:bg-[#1C1C1C] border-gray-200 dark:border-[#2A2A2A] focus:bg-white dark:focus:bg-[#141414] dark:text-white dark:placeholder-gray-500 transition-colors duration-300"
                value={formData.hrName}
                onChange={e => setFormData({ ...formData, hrName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="dark:text-gray-200 transition-colors duration-300">Work Email <span className="text-red-500">*</span></Label>
            <div className="relative">
              <div className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500 transition-colors duration-300">
                <Mail size={18} />
              </div>
              <Input
                id="email"
                type="email"
                placeholder="hr@company.com"
                className="pl-10 h-11 bg-gray-50 dark:bg-[#1C1C1C] border-gray-200 dark:border-[#2A2A2A] focus:bg-white dark:focus:bg-[#141414] dark:text-white dark:placeholder-gray-500 transition-colors duration-300"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile" className="dark:text-gray-200 transition-colors duration-300">Mobile Number <span className="text-red-500">*</span></Label>
            <div className="relative">
              <div className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500 transition-colors duration-300">
                <Smartphone size={18} />
              </div>
              <Input
                id="mobile"
                type="tel"
                placeholder="077 123 4567"
                className="pl-10 h-11 bg-gray-50 dark:bg-[#1C1C1C] border-gray-200 dark:border-[#2A2A2A] focus:bg-white dark:focus:bg-[#141414] dark:text-white dark:placeholder-gray-500 transition-colors duration-300"
                value={formData.mobile}
                onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                required
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
              Used for SMS OTP and employee onboarding notifications
            </p>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-[#0E2250] hover:bg-[#0E2250]/90 dark:bg-[#E35000] dark:hover:bg-[#c44500] text-white font-medium text-base mt-2 transition-colors duration-300"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>Continue <ArrowRight size={18} className="ml-2" /></>
            )}
          </Button>
        </form>

        <div className="text-center pt-2">
          <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
            Already registered?{' '}
            <button
              type="button"
              onClick={onNavigateToSignIn}
              className="font-semibold text-[#E35000] hover:text-[#c44500] transition-colors"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}

import React, { useState, useEffect } from 'react';
import { ArrowRight, Loader2, Mail, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { AuthLayout } from './AuthLayout';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { toast } from 'sonner@2.0.3';

interface SignInProps {
  onSignIn: () => void;
  onNavigateToSignUp: () => void;
  onNavigateToForgotPassword?: () => void;
}

export function SignIn({ onSignIn, onNavigateToSignUp }: SignInProps) {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  useEffect(() => {
    if (otpValue.length === 6 && !isLoading) handleOtpSubmit();
  }, [otpValue]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast.error('Please enter your work email'); return; }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
      setResendTimer(60);
      toast.success('OTP sent to your WhatsApp');
    }, 1500);
  };

  const handleOtpSubmit = () => {
    if (otpValue.length < 6) { toast.error('Enter the complete 6-digit code'); return; }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Welcome back!');
      onSignIn();
    }, 1500);
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setResendTimer(60);
      setOtpValue('');
      toast.success('New OTP sent to your WhatsApp');
    }, 1000);
  };

  if (step === 'otp') {
    return (
      <AuthLayout
        title="Check your WhatsApp"
        subtitle={`We sent a 6-digit code to the WhatsApp linked with ${email}`}
      >
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-full transition-colors duration-300">
              <ShieldCheck size={16} className="text-green-600 dark:text-green-400" />
              <span className="text-xs font-medium text-green-700 dark:text-green-300">Sent via WhatsApp</span>
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
                Resend code in <span className="font-semibold text-[#0E2250] dark:text-white">{resendTimer}s</span>
              </p>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <Button
              onClick={handleOtpSubmit}
              className="w-full h-12 bg-[#E35000] hover:bg-[#c44500] text-white font-medium text-base transition-colors duration-300"
              disabled={isLoading || otpValue.length < 6}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
            </Button>

            <div className="flex justify-between items-center pt-1">
              <button
                type="button"
                onClick={() => { setStep('email'); setOtpValue(''); setResendTimer(0); }}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center transition-colors duration-300"
              >
                <ArrowLeft size={14} className="mr-1" /> Change email
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
              Check WhatsApp for the OTP message from QPON Business.
            </p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your QPON Business Portal"
    >
      <div className="space-y-6">
        <form onSubmit={handleEmailSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="dark:text-gray-200 transition-colors duration-300">Work Email</Label>
            <div className="relative">
              <div className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500 transition-colors duration-300">
                <Mail size={18} />
              </div>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                className="pl-10 h-11 bg-gray-50 dark:bg-[#1C1C1C] border-gray-200 dark:border-[#2A2A2A] focus:bg-white dark:focus:bg-[#141414] dark:text-white dark:placeholder-gray-500 transition-colors duration-300"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/30 rounded-lg p-3 transition-colors duration-300">
            <p className="text-xs text-blue-800 dark:text-blue-300 text-center transition-colors duration-300">
              We'll send a one-time code to your registered WhatsApp — no password needed.
            </p>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-[#0E2250] hover:bg-[#0E2250]/90 dark:bg-[#E35000] dark:hover:bg-[#c44500] text-white font-medium text-base transition-colors duration-300"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>Send OTP via WhatsApp <ArrowRight size={18} className="ml-2" /></>
            )}
          </Button>
        </form>

        <div className="text-center pt-2">
          <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
            New to QPON Business?{' '}
            <button
              type="button"
              onClick={onNavigateToSignUp}
              className="font-semibold text-[#E35000] hover:text-[#c44500] transition-colors"
            >
              Register your company
            </button>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}

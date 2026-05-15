import React, { useState } from 'react';
import { Check, Crown, ArrowRight, ArrowLeft, Loader2, CreditCard, Zap, Building } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner@2.0.3';
import logoImage from '../../../assets/logo.png';

interface PurchaseSetupProps {
  onComplete: () => void;
  onBack: () => void;
}

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    range: '20 – 200',
    bronzePerSeat: 750,
    silverPerSeat: 1500,
    goldPerSeat: 2800,
    annualAvailable: true,
  },
  {
    id: 'growth',
    name: 'Growth',
    range: '200 – 1,000',
    bronzePerSeat: 600,
    silverPerSeat: 1200,
    goldPerSeat: 2400,
    annualAvailable: true,
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    range: '1,000+',
    bronzePerSeat: 500,
    silverPerSeat: 1000,
    goldPerSeat: 2000,
    annualAvailable: true,
  },
] as const;

type PlanId = typeof PLANS[number]['id'];

const PLAN_ICONS = {
  starter: Zap,
  growth: Crown,
  enterprise: Building,
};

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card', description: 'Pay online instantly', gatewayNote: 'Processed via Gene Payment Gateway', Icon: CreditCard },
];

export function PurchaseSetup({ onComplete, onBack }: PurchaseSetupProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>('growth');
  const [bronzeSeats, setBronzeSeats] = useState(0);
  const [silverSeats, setSilverSeats] = useState(100);
  const [goldSeats, setGoldSeats] = useState(50);
  const [isAnnual, setIsAnnual] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const [isLoading, setIsLoading] = useState(false);

  const plan = PLANS.find(p => p.id === selectedPlanId)!;
  const bronzeTotal = bronzeSeats * plan.bronzePerSeat;
  const silverTotal = silverSeats * plan.silverPerSeat;
  const goldTotal = goldSeats * plan.goldPerSeat;
  const monthlyTotal = bronzeTotal + silverTotal + goldTotal;
  const billedTotal = isAnnual && plan.annualAvailable ? monthlyTotal * 10 : monthlyTotal * 12;

  const handleSelectPlan = (id: PlanId) => {
    setSelectedPlanId(id);
    const p = PLANS.find(x => x.id === id)!;
    if (!p.annualAvailable) setIsAnnual(false);
  };

  const handleConfirm = () => {
    if (bronzeSeats + silverSeats + goldSeats === 0) {
      toast.error('Please configure at least one seat');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Subscription activated! Welcome to QPON Business.');
      onComplete();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] transition-colors duration-300">
      {/* Top bar */}
      <div className="bg-white dark:bg-[#0A0A0A] border-b border-gray-200 dark:border-[#2A2A2A] px-6 py-4 sticky top-0 z-10 transition-colors duration-300">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 dark:text-gray-400 hover:text-[#0E2250] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#2A2A2A] transition-colors duration-200"
              aria-label="Go back"
            >
              <ArrowLeft size={18} />
            </button>
            <img src={logoImage} alt="QPON" className="h-8 w-auto dark:brightness-0 dark:invert transition-all duration-300" />
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-[#0E2250] dark:hover:text-white transition-colors duration-200"
            >
              <span className="w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center">
                <Check size={12} />
              </span>
              <span className="hidden sm:inline">Account Created</span>
            </button>
            <span className="text-gray-300 dark:text-gray-600">—</span>
            <span className="flex items-center gap-1.5 text-[#0E2250] dark:text-white font-semibold">
              <span className="w-6 h-6 rounded-full bg-[#C44500] text-white text-xs flex items-center justify-center font-bold">2</span>
              <span className="hidden sm:inline">Choose Plan</span>
            </span>
            <span className="text-gray-300 dark:text-gray-600">—</span>
            <span className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
              <span className="w-6 h-6 rounded-full bg-gray-200 dark:bg-[#2A2A2A] text-gray-500 dark:text-gray-400 text-xs flex items-center justify-center font-bold">3</span>
              <span className="hidden sm:inline">Go Live</span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0E2250] dark:text-white mb-2 transition-colors duration-300">Choose Your Plan</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-300">
            Configure your seats and activate your team's benefits in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Plan Cards */}
            <div className="bg-white dark:bg-[#141414] rounded-2xl border border-gray-200 dark:border-[#2A2A2A] p-6 transition-colors duration-300">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h2 className="text-base font-semibold text-[#0E2250] dark:text-white transition-colors duration-300">Select Plan</h2>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400">Bronze · 10 QPONs / mo</span>
                  <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">Silver · 20 QPONs / mo</span>
                  <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400">Gold · 30 QPONs / mo</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {PLANS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPlan(p.id)}
                    className={`relative text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedPlanId === p.id
                        ? 'border-[#E35000] bg-[#C44500]/5 dark:bg-[#E35000]/10'
                        : 'border-gray-200 dark:border-[#2A2A2A] hover:border-gray-300 dark:hover:border-[#3A3A3A]'
                    }`}
                  >
                    {'popular' in p && p.popular && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#C44500] text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                        POPULAR
                      </span>
                    )}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 transition-colors duration-200 ${
                      selectedPlanId === p.id ? 'bg-[#C44500]' : 'bg-gray-100 dark:bg-[#2A2A2A]'
                    }`}>
                      {React.createElement(PLAN_ICONS[p.id as keyof typeof PLAN_ICONS], { size: 16, className: selectedPlanId === p.id ? 'text-white' : 'text-gray-500 dark:text-gray-400' })}
                    </div>
                    <p className="font-bold text-[#0E2250] dark:text-white text-sm transition-colors duration-300">{p.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 transition-colors duration-300">{p.range} employees</p>
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-[#2A2A2A] transition-colors duration-300 space-y-1.5">
                      {[
                        { label: 'Bronze', price: p.bronzePerSeat, color: 'text-gray-400 dark:text-gray-500' },
                        { label: 'Silver', price: p.silverPerSeat, color: 'text-gray-400 dark:text-gray-500' },
                        { label: 'Gold',   price: p.goldPerSeat,   color: 'text-yellow-500 dark:text-yellow-400' },
                      ].map(({ label, price, color }) => (
                        <div key={label} className="flex items-center justify-between">
                          <span className={`text-xs font-semibold ${color}`}>{label}</span>
                          <span className="text-xs font-bold text-[#0E2250] dark:text-white">
                            LKR {price.toLocaleString()}<span className="text-[11px] font-normal text-gray-400">/seat</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Seat Configurator */}
            <div className="bg-white dark:bg-[#141414] rounded-2xl border border-gray-200 dark:border-[#2A2A2A] p-6 transition-colors duration-300">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-[#0E2250] dark:text-white transition-colors duration-300">Configure Seats</h2>
                {plan.annualAvailable && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Annual billing</span>
                    <button
                      onClick={() => setIsAnnual(!isAnnual)}
                      role="switch"
                      aria-checked={isAnnual}
                      className="relative flex-shrink-0 rounded-full transition-colors duration-200 focus:outline-none"
                      style={{ width: 44, height: 24, background: isAnnual ? '#E35000' : '#D1D5DB' }}
                    >
                      <span
                        className="absolute rounded-full bg-white"
                        style={{
                          width: 18, height: 18, top: 3, left: 3,
                          boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
                          transform: isAnnual ? 'translateX(20px)' : 'translateX(0px)',
                          transition: 'transform 0.2s ease',
                        }}
                      />
                    </button>
                    {isAnnual && (
                      <span className="text-xs font-semibold text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400 px-2 py-0.5 rounded-full transition-colors duration-300">
                        +2 months free
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Bronze */}
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                    Bronze Seats
                    <span className="text-xs font-normal text-amber-500 ml-1">· 10 QPONs / 30 days</span>
                    <span className="text-xs font-normal text-gray-400 ml-1">— LKR {plan.bronzePerSeat.toLocaleString()}/seat</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setBronzeSeats(Math.max(0, bronzeSeats - 10))}
                      className="w-9 h-9 rounded-lg border border-gray-200 dark:border-[#2A2A2A] flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2A2A2A] text-lg font-bold transition-colors duration-200"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={0}
                      value={bronzeSeats}
                      onChange={e => setBronzeSeats(Math.max(0, parseInt(e.target.value) || 0))}
                      className="flex-1 h-9 text-center rounded-lg border border-gray-200 dark:border-[#2A2A2A] bg-gray-50 dark:bg-[#1C1C1C] text-[#0E2250] dark:text-white text-sm font-semibold focus:outline-none focus:border-[#E35000] transition-colors duration-200"
                    />
                    <button
                      onClick={() => setBronzeSeats(bronzeSeats + 10)}
                      className="w-9 h-9 rounded-lg border border-gray-200 dark:border-[#2A2A2A] flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2A2A2A] text-lg font-bold transition-colors duration-200"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 transition-colors duration-300">
                    Subtotal: LKR {bronzeTotal.toLocaleString()}/mo
                  </p>
                </div>

                {/* Silver */}
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                    Silver Seats
                    <span className="text-xs font-normal text-gray-400 ml-1">· 20 QPONs / 30 days — LKR {plan.silverPerSeat.toLocaleString()}/seat</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSilverSeats(Math.max(0, silverSeats - 10))}
                      className="w-9 h-9 rounded-lg border border-gray-200 dark:border-[#2A2A2A] flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2A2A2A] text-lg font-bold transition-colors duration-200"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={0}
                      value={silverSeats}
                      onChange={e => setSilverSeats(Math.max(0, parseInt(e.target.value) || 0))}
                      className="flex-1 h-9 text-center rounded-lg border border-gray-200 dark:border-[#2A2A2A] bg-gray-50 dark:bg-[#1C1C1C] text-[#0E2250] dark:text-white text-sm font-semibold focus:outline-none focus:border-[#E35000] transition-colors duration-200"
                    />
                    <button
                      onClick={() => setSilverSeats(silverSeats + 10)}
                      className="w-9 h-9 rounded-lg border border-gray-200 dark:border-[#2A2A2A] flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2A2A2A] text-lg font-bold transition-colors duration-200"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 transition-colors duration-300">
                    Subtotal: LKR {silverTotal.toLocaleString()}/mo
                  </p>
                </div>

                {/* Gold */}
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                    Gold Seats
                    <span className="text-xs font-normal text-gray-400 ml-1">· 30 QPONs / 30 days — LKR {plan.goldPerSeat.toLocaleString()}/seat</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setGoldSeats(Math.max(0, goldSeats - 10))}
                      className="w-9 h-9 rounded-lg border border-gray-200 dark:border-[#2A2A2A] flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2A2A2A] text-lg font-bold transition-colors duration-200"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={0}
                      value={goldSeats}
                      onChange={e => setGoldSeats(Math.max(0, parseInt(e.target.value) || 0))}
                      className="flex-1 h-9 text-center rounded-lg border border-gray-200 dark:border-[#2A2A2A] bg-gray-50 dark:bg-[#1C1C1C] text-[#0E2250] dark:text-white text-sm font-semibold focus:outline-none focus:border-[#E35000] transition-colors duration-200"
                    />
                    <button
                      onClick={() => setGoldSeats(goldSeats + 10)}
                      className="w-9 h-9 rounded-lg border border-gray-200 dark:border-[#2A2A2A] flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2A2A2A] text-lg font-bold transition-colors duration-200"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 transition-colors duration-300">
                    Subtotal: LKR {goldTotal.toLocaleString()}/mo
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white dark:bg-[#141414] rounded-2xl border border-gray-200 dark:border-[#2A2A2A] p-6 transition-colors duration-300">
              <h2 className="text-base font-semibold text-[#0E2250] dark:text-white mb-4 transition-colors duration-300">Payment Method</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PAYMENT_METHODS.map(pm => (
                  <button
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-start gap-3 ${
                      paymentMethod === pm.id
                        ? 'border-[#E35000] bg-[#C44500]/5 dark:bg-[#E35000]/10'
                        : 'border-gray-200 dark:border-[#2A2A2A] hover:border-gray-300 dark:hover:border-[#3A3A3A]'
                    }`}
                  >
                    <div className={`p-2 rounded-lg flex-shrink-0 transition-colors duration-200 ${
                      paymentMethod === pm.id ? 'bg-[#C44500]/10' : 'bg-gray-100 dark:bg-[#2A2A2A]'
                    }`}>
                      <pm.Icon size={16} className={paymentMethod === pm.id ? 'text-[#E35000]' : 'text-gray-500 dark:text-gray-400'} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-[#0E2250] dark:text-white transition-colors duration-300">{pm.label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 transition-colors duration-300">{pm.description}</p>
                      {pm.gatewayNote && (
                        <p className="text-[10px] text-[#E35000]/80 mt-0.5 font-medium">{pm.gatewayNote}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>


            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-gradient-to-br from-[#0E2250] to-[#1e3a8a] rounded-2xl p-6 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C44500] rounded-full blur-3xl opacity-20 -mr-10 -mt-10 pointer-events-none" />

              <h2 className="text-base font-bold mb-1 relative z-10">Order Summary</h2>
              <p className="text-blue-300 text-xs mb-5 relative z-10">
                {plan.name} Plan · {isAnnual && plan.annualAvailable ? 'Annual' : 'Monthly'} billing
              </p>

              <div className="space-y-3 text-sm relative z-10">
                {bronzeSeats > 0 && (
                  <div className="flex justify-between text-blue-200 border-b border-white/10 pb-3">
                    <span>Bronze × {bronzeSeats} seats</span>
                    <span className="font-medium text-white">LKR {bronzeTotal.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-blue-200 border-b border-white/10 pb-3">
                  <span>Silver × {silverSeats} seats</span>
                  <span className="font-medium text-white">LKR {silverTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-blue-200 border-b border-white/10 pb-3">
                  <span>Gold × {goldSeats} seats</span>
                  <span className="font-medium text-white">LKR {goldTotal.toLocaleString()}</span>
                </div>
                {isAnnual && plan.annualAvailable && (
                  <div className="flex justify-between text-green-300 border-b border-white/10 pb-3">
                    <span>Annual discount (2 months)</span>
                    <span className="font-medium">−LKR {(monthlyTotal * 2).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-end pt-1">
                  <span className="text-blue-200 text-xs">
                    {isAnnual && plan.annualAvailable ? 'Annual total' : 'Monthly total'}
                  </span>
                  <div className="text-right">
                    <p className="text-2xl font-bold">LKR {billedTotal.toLocaleString()}</p>
                    <p className="text-xs text-blue-300">
                      {isAnnual && plan.annualAvailable ? 'billed annually' : 'billed monthly'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-white/10 space-y-1.5 text-xs text-blue-300 relative z-10">
                <p>✓ Activates immediately on confirm</p>
                <p>✓ Payment receipt emailed instantly</p>
                <p>✓ Cancel or change plan anytime</p>
              </div>

              <Button
                onClick={handleConfirm}
                disabled={isLoading || (bronzeSeats + silverSeats + goldSeats) === 0}
                className="w-full mt-6 h-12 bg-[#C44500] hover:bg-[#a03800] text-white font-bold text-base relative z-10 transition-colors duration-200"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>Confirm & Activate <ArrowRight size={18} className="ml-2" /></>
                )}
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

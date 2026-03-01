/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, ShieldCheck, ArrowRight, ChevronLeft, Loader2 } from 'lucide-react';

interface AuthProps {
  email: string;
  setEmail: (email: string) => void;
  onVerify: () => void;
  onBack: () => void;
}

export const Auth = ({ email, setEmail, onVerify, onBack }: AuthProps) => {
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setStep('code');
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }
    setError('');
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    onVerify();
  };

  return (
    <motion.div 
      key="auth"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="z-10 w-full max-w-md px-4"
    >
      <div className="glass-card p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-cloud-blue/30" />
        
        <button 
          onClick={step === 'code' ? () => setStep('email') : onBack}
          className="flex items-center gap-2 text-cloud-muted hover:text-cloud-deep font-bold transition-colors mb-8"
        >
          <ChevronLeft className="w-5 h-5" /> {step === 'code' ? 'Change Email' : 'Back'}
        </button>

        <AnimatePresence mode="wait">
          {step === 'email' ? (
            <motion.div
              key="email-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-cloud-blue/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-cloud-deep" />
                </div>
                <h2 className="text-3xl font-black text-cloud-deep mb-2">Welcome Back</h2>
                <p className="text-cloud-muted font-medium">Enter your email to receive a login code</p>
              </div>

              <form onSubmit={handleSendCode} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-cloud-muted mb-2 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="you@university.edu"
                    className="w-full px-6 py-4 rounded-2xl border-2 border-cloud-blue/20 bg-white/50 focus:border-cloud-blue focus:outline-none transition-all text-lg font-bold"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {error && <p className="text-xs text-red-500 font-bold text-center">{error}</p>}

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-5 bg-cloud-deep text-white rounded-2xl font-black text-lg hover:bg-cloud-deep/90 transition-all shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>Send Code <ArrowRight className="w-5 h-5" /></>
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="code-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-cloud-blue/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-8 h-8 text-cloud-deep" />
                </div>
                <h2 className="text-3xl font-black text-cloud-deep mb-2">Check your email</h2>
                <p className="text-cloud-muted font-medium">We sent a 6-digit code to <br/><span className="text-cloud-deep font-bold">{email}</span></p>
              </div>

              <form onSubmit={handleVerifyCode} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-cloud-muted mb-2 ml-1">Verification Code</label>
                  <input 
                    type="text" 
                    maxLength={6}
                    placeholder="000000"
                    className="w-full px-6 py-4 rounded-2xl border-2 border-cloud-blue/20 bg-white/50 focus:border-cloud-blue focus:outline-none transition-all text-3xl font-black text-center tracking-[0.5em]"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    required
                  />
                </div>

                {error && <p className="text-xs text-red-500 font-bold text-center">{error}</p>}

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-5 bg-cloud-deep text-white rounded-2xl font-black text-lg hover:bg-cloud-deep/90 transition-all shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>Verify & Continue <ArrowRight className="w-5 h-5" /></>
                  )}
                </button>

                <p className="text-center text-xs text-cloud-muted font-bold">
                  Didn't receive a code? <button type="button" onClick={handleSendCode} className="text-cloud-deep hover:underline">Resend</button>
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  // Local state tracking indicators
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const cleanEmail = email.trim().toLowerCase();

    try {
      // Step 1: Execute Native Supabase Encryption Authentication Check
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password
      });

      // Step 2: Catch incorrect password or invalid email alerts instantly
      if (error) throw error;

      // Step 3: Extract the profile name registered inside identity locker metadata buckets
      const userName = data?.user?.user_metadata?.name || 'User';

      // Step 4: Fire the exact raw success message required
      setMessage(`🎉 Login Successful! Welcome, ${userName}! :)`);

      // Step 5: Direct redirection routing trigger
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);

    } catch (error: unknown) {
      console.error("Login Trace Error:", error);
      
      // Step 1: Explicitly structure check using cast pattern to keep TypeScript happy
      const err = error as { message?: string; status?: number };
      
      // Step 2: Check for invalid login credentials via safe optional chaining
      if (err?.message?.toLowerCase().includes('invalid login credentials') || err?.status === 400) {
        setMessage('❌ Incorrect password or email, please try again.');
      } else if (error instanceof Error) {
        setMessage(`❌ ${error.message}`);
      } else {
        setMessage('❌ Credentials verification failed.');
      }
    }finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full border border-slate-100">
        
        <h2 className="text-3xl font-bold text-brand-text mb-2 text-center">Welcome Back</h2>
        <p className="text-sm text-slate-500 text-center mb-8">Access your infrastructure financial ledger.</p>

        {/* Dynamic Alert Banner Area */}
        {message && (
          <div className={`p-3 rounded-lg text-sm mb-5 text-center font-medium ${
            message.startsWith('❌') 
              ? 'bg-red-50 text-red-700 border border-red-100' 
              : 'bg-green-50 text-green-700 border border-green-100'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-primary text-sm bg-brand-bg disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-text mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-primary text-sm bg-brand-bg disabled:opacity-50"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-primary hover:bg-brand-hover text-white font-semibold py-3 rounded-lg transition-all shadow-sm text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying Context...' : 'Login'}
          </button>
        </form>

        <p className="text-sm text-slate-500 text-center mt-6">
          {"Don't have an account?"}{' '}
          <Link href="/register" className="text-brand-primary hover:underline font-medium">
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
}

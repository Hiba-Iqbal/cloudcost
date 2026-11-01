'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [companyName, setCompanyName] = useState(''); 
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        // Sanitize string data inputs before processing transaction
        const cleanCompanyName = companyName.trim();
        const cleanEmail = email.trim().toLowerCase();
        const cleanName = name.trim();

        // Extract domain automatically from email address
        const emailParts = cleanEmail.split('@');
        if (emailParts.length !== 2) {
            setMessage('❌ Please enter a valid email address.');
            setLoading(false);
            return;
        }
        
        const extractedDomain = emailParts[1];

        // Guard Clause: Prevent corporate workspace mapping with public generic domains
        const blacklistedDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];
        if (blacklistedDomains.includes(extractedDomain)) {
            setMessage('❌ Please register using an official corporate business email address.');
            setLoading(false);
            return;
        }

        try {
            // Execute the absolute safe all-or-nothing transaction via RPC function
            const { error: rpcError } = await supabase.rpc('register_tenant_and_admin', {
                p_company_name: cleanCompanyName,
                p_domain: extractedDomain,
                p_user_name: cleanName,
                p_user_email: cleanEmail,
                p_user_password: password
            });

            if (rpcError) {
                // Intercept constraints violations cleanly
                if (rpcError.message.includes('unique constraint') || rpcError.message.includes('already exists')) {
                    throw new Error('This corporate workspace domain or email address is already registered.');
                }
                throw new Error(rpcError.message);
            }

            setMessage('🎉 Enterprise workspace and admin profile successfully created together!');

            // Reset input fields on absolute success
            setName('');
            setEmail('');
            setPassword('');
            setCompanyName('');
        
        } catch (error: unknown) {
            console.error("Full Debug Log:", error);
            if (error instanceof Error) {
                setMessage(`❌ ${error.message}`);
            } else {
                setMessage('❌ A critical transaction anomaly occurred inside the database.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6">
            <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full border border-slate-100">

                <h2 className="text-3xl font-bold text-brand-text mb-2 text-center">Create Account</h2>
                <p className="text-sm text-slate-500 text-center mb-6">Begin tracking system architecture waste.</p>

                {message && (
                    <div className={`p-3 rounded-lg text-sm mb-4 text-center font-medium ${
                        message.startsWith('❌') 
                            ? 'bg-red-50 text-red-700 border border-red-100' 
                            : 'bg-green-50 text-green-700 border border-green-100'
                    }`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-brand-text mb-1">Company Workspace Name</label>
                        <input
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="e.g. Acme Corp"
                            required
                            disabled={loading}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-primary text-sm bg-brand-bg disabled:opacity-50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-brand-text mb-1">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            required
                            disabled={loading}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-primary text-sm bg-brand-bg disabled:opacity-50"
                        />
                    </div>

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
                        className="w-full bg-brand-primary hover:bg-brand-hover text-white font-semibold py-3 rounded-lg transition-all shadow-sm text-sm cursor-pointer disabled:bg-slate-400"
                    >
                        {loading ? 'Creating Workspace...' : 'Sign Up'}
                    </button>
                </form>

                <p className="text-sm text-slate-500 text-center mt-6">
                    Already have an account?{' '}
                    <Link href="/login" className="text-brand-primary hover:underline font-medium">
                        Login here
                    </Link>
                </p>

            </div>
        </div>
    );
}

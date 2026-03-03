'use client';

import { useState } from 'react';

export default function ContactModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('loading');

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            company: formData.get('company'),
            scope: formData.get('scope'),
        };

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setStatus('success');
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="px-10 py-5 rounded-full bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink text-white font-bold text-lg hover:shadow-[0_0_40px_rgba(213,0,249,0.4)] transition-all duration-300 transform hover:-translate-y-1"
            >
                Schedule Architecture Review
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
                    <div className="relative w-full max-w-lg glass p-8 rounded-2xl border border-white/20 shadow-2xl animate-fade-in">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
                        >
                            ✕
                        </button>

                        <h3 className="text-2xl font-bold mb-2">Initiate Contact</h3>
                        <p className="text-zinc-400 mb-6 text-sm">Deploy an enterprise architecture review with BuyOneMedia.</p>

                        {status === 'success' ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-brand-cyan/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-cyan/50">
                                    <svg className="w-8 h-8 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <h4 className="text-xl font-bold mb-2">Transmission Secure</h4>
                                <p className="text-zinc-400">Our engineering team has received your scope. We will contact you within 24 hours.</p>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="mt-6 px-6 py-2 bg-white text-black font-semibold rounded-full hover:scale-105 transition-transform"
                                >
                                    Close Window
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Name</label>
                                        <input required name="name" type="text" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-purple transition-colors" placeholder="John Doe" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Email</label>
                                        <input required name="email" type="email" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-purple transition-colors" placeholder="john@enterprise.com" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Company (Optional)</label>
                                    <input name="company" type="text" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-purple transition-colors" placeholder="Enterprise Corp" />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Project Scope</label>
                                    <textarea required name="scope" rows={4} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-purple transition-colors resize-none" placeholder="Describe the operational bottlenecks you wish to solve..." />
                                </div>

                                {status === 'error' && (
                                    <p className="text-brand-pink text-sm">An error occurred transmitting your data. Please try again.</p>
                                )}

                                <button
                                    disabled={status === 'loading'}
                                    type="submit"
                                    className="w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple text-white font-bold hover:shadow-[0_0_20px_rgba(213,0,249,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {status === 'loading' ? 'Encrypting & Sending...' : 'Submit Request'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

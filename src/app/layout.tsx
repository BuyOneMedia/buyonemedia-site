import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "BuyOneMedia | AI Contact Solutions & Digital Strategy",
  description: "20 Years of Entertainment. The Future of AI Integration. BuyOneMedia delivers enterprise-grade AI automation, digital strategy, and scaling solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${outfit.variable} antialiased bg-background text-foreground bg-gradient-mesh min-h-screen flex flex-col`}>
        {/* Sticky Glassmorphism Navigation */}
        <header className="fixed top-0 w-full z-50 glass border-b border-white/10 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo Placeholder - User will drop logo.png into public/ */}
              <div className="w-12 h-12 rounded-lg bg-zinc-800/50 flex items-center justify-center border border-white/10 overflow-hidden shrink-0">
                <img src="/logo.png" alt="BuyOneMedia Logo" className="w-full h-full object-contain p-1" />
              </div>
              <span className="text-xl font-bold tracking-tight">BuyOne<span className="text-gradient">Media</span></span>
            </div>

            <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-zinc-300">
              <a href="#services" className="hover:text-white transition-colors">AI Solutions</a>
              <a href="#legacy" className="hover:text-white transition-colors">Our Legacy</a>
              <a href="#contact" className="hover:text-white transition-colors">Contact</a>
            </nav>

            <button className="hidden md:block px-6 py-2.5 rounded-full bg-white text-black font-semibold text-sm hover:scale-105 transition-transform">
              Get Started
            </button>
          </div>
        </header>

        <main className="flex-grow pt-20">
          {children}
        </main>

        <footer className="glass border-t border-white/10 py-12 mt-24">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg font-bold">BuyOne<span className="text-gradient">Media</span></span>
              </div>
              <p className="text-zinc-400 text-sm max-w-sm leading-relaxed">
                Pioneering AI infrastructure and digital growth since 2002. From Hollywood Investments to the future of enterprise automation.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Solutions</h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><a href="#" className="hover:text-brand-cyan transition-colors">AI Receptionists</a></li>
                <li><a href="#" className="hover:text-brand-purple transition-colors">Phone Automation</a></li>
                <li><a href="#" className="hover:text-brand-pink transition-colors">Business Scaling</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/10 text-center flex flex-col md:flex-row justify-between items-center text-xs text-zinc-500">
            <p>© {new Date().getFullYear()} BuyOneMedia. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

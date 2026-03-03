import Image from "next/image";

function HeroSection() {
  return (
    <section className="relative px-6 py-24 md:py-32 overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-brand-cyan/20 blur-[120px] rounded-full mix-blend-screen" />
      <div className="absolute bottom-0 -right-1/4 w-[30rem] h-[30rem] bg-brand-purple/20 blur-[120px] rounded-full mix-blend-screen" />

      <div className="max-w-7xl mx-auto relative z-10 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
          <span>Next-Generation AI Infrastructure</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 max-w-4xl leading-tight">
          20 Years of Entertainment. <br className="hidden md:block" />
          The Future of <span className="text-gradient">AI Integration.</span>
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-12">
          From full-scale event production to advanced digital strategy, BuyOneMedia engineers the AI architectures that scale elite enterprises.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button className="px-8 py-4 rounded-full bg-white text-black font-bold hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            Explore AI Solutions
          </button>
          <button className="px-8 py-4 rounded-full glass hover:bg-white/10 transition-colors duration-300 font-semibold">
            Our Legacy
          </button>
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  const services = [
    {
      title: "AI Receptionists",
      description: "Intelligent, conversational voice agents that handle inbound triage, scheduling, and customer support 24/7 with zero downtime.",
      icon: (
        <svg className="w-6 h-6 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
      )
    },
    {
      title: "Phone Automation",
      description: "Advanced IVR replacements and workflow routing powered by large language models, capturing leads and resolving issues instantly.",
      icon: (
        <svg className="w-6 h-6 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
      )
    },
    {
      title: "Enterprise Scaling",
      description: "Bespoke digital architecture mapping. We integrate AI into your specific operational bottlenecks to multiply your workforce's output.",
      icon: (
        <svg className="w-6 h-6 text-brand-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
      )
    }
  ];

  return (
    <section id="services" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 md:text-center">
          <h2 className="text-sm font-bold tracking-widest text-brand-cyan uppercase mb-3">Core Capabilities</h2>
          <h3 className="text-3xl md:text-5xl font-bold">Intelligent Contact Solutions</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <div key={idx} className="glass p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              <h4 className="text-xl font-bold mb-3">{service.title}</h4>
              <p className="text-zinc-400 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LegacySection() {
  const milestones = [
    { year: "2002", title: "DJ Services", desc: "Started the journey in entertainment, mastering crowd dynamics and live event execution." },
    { year: "2006", title: "Restaurant Ownership", desc: "Scaled into hospitality, managing complex operations, staffing, and customer satisfaction at scale." },
    { year: "2014", title: "Hollywood Ventures", desc: "Founded Hollywood Ventures, consolidating operations and investing in emerging technologies." },
    { year: "Present", title: "BuyOneMedia", desc: "The culmination of 20+ years of operational excellence, now deploying enterprise AI solutions." }
  ];

  return (
    <section id="legacy" className="py-24 px-6 bg-black/50 border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold tracking-widest text-brand-purple uppercase mb-3">Our Legacy</h2>
            <h3 className="text-3xl md:text-4xl font-bold">Rooted in Hollywood Investments.</h3>
          </div>
          <p className="text-zinc-400 max-w-sm">From physical venues to digital infrastructure, our operational DNA is built on two decades of execution.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {milestones.map((item, idx) => (
            <div key={idx} className="relative pl-6 md:pl-0 md:pt-6 border-l md:border-l-0 md:border-t border-white/10 group">
              {/* Dot mapping */}
              <div className="absolute left-[-5px] md:left-0 md:top-[-5px] w-2 h-2 rounded-full bg-zinc-600 group-hover:bg-brand-pink transition-colors duration-300" />

              <h4 className="text-4xl font-black text-white/20 mb-3 group-hover:text-white/40 transition-colors duration-300">{item.year}</h4>
              <h5 className="text-lg font-bold mb-2">{item.title}</h5>
              <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section id="contact" className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-brand-blue/10 blur-[100px] rounded-full scale-150" />
      <div className="max-w-4xl mx-auto text-center relative z-10 glass p-12 md:p-20 rounded-3xl border border-white/20">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Automate Your Operations?</h2>
        <p className="text-zinc-300 text-lg mb-10 max-w-2xl mx-auto">
          Partner with BuyOneMedia to deploy intelligent architectures that scale your enterprise without scaling your overhead.
        </p>
        <button className="px-10 py-5 rounded-full bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink text-white font-bold text-lg hover:shadow-[0_0_40px_rgba(213,0,249,0.4)] transition-all duration-300 transform hover:-translate-y-1">
          Schedule Architecture Review
        </button>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <ServicesSection />
      <LegacySection />
      <CTASection />
    </div>
  );
}

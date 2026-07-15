import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, FileCheck, HardHat, BarChart3, Send, User, Phone, Mail, MapPin, MessageSquare } from 'lucide-react';
import Navbar from '../components/Navbar';

const GOLD = '#d4a853';
const GOLD_DARK = '#b8893a';

const features = [
  {
    icon: <TrendingUp size={20} />,
    title: 'Maximum Land Value',
    desc: 'We unlock the highest possible returns from your land through premium development.',
  },
  {
    icon: <FileCheck size={20} />,
    title: 'Transparent Agreements',
    desc: 'Clear, legally vetted JV contracts with no hidden clauses or surprises.',
  },
  {
    icon: <HardHat size={20} />,
    title: 'Legal & Technical Support',
    desc: 'End-to-end legal, structural, and regulatory guidance from day one.',
  },
  {
    icon: <BarChart3 size={20} />,
    title: 'High ROI Development',
    desc: 'Proven track record of delivering above-market returns for landowners.',
  },
];

const floatingStats = [
  { val: '₹500Cr+', label: 'Projects Delivered' },
  { val: '15+',     label: 'JV Partnerships' },
  { val: '100%',    label: 'On-Time Handover' },
];

const PartnerForm: React.FC = () => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', location: '', landArea: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="partner-form" className="py-24 px-6 md:px-16" style={{ background: '#031124' }}>
      <div className="max-w-5xl mx-auto px-1">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 md:mb-14"
        >
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6"
            style={{ background: 'rgba(212,168,83,0.1)', border: '1px solid rgba(212,168,83,0.25)' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: GOLD }} />
            <span className="text-[10px] font-bold tracking-[3px] uppercase" style={{ color: GOLD }}>
              Partner With Us
            </span>
          </div>
          <h2 className="font-serif-display text-3xl md:text-5xl font-bold text-white mb-4">
            Let's Build Something{' '}
            <span className="italic" style={{ color: GOLD }}>Extraordinary.</span>
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
            Share your land details and we'll get back to you with a tailored joint venture proposal within 48 hours.
          </p>
        </motion.div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 rounded-2xl border"
            style={{ borderColor: 'rgba(212,168,83,0.2)', background: 'rgba(212,168,83,0.05)' }}
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: 'rgba(212,168,83,0.15)', border: '2px solid rgba(212,168,83,0.4)' }}>
              <Send size={24} style={{ color: GOLD }} />
            </div>
            <h3 className="font-serif-display text-2xl font-bold text-white mb-3">Thank You!</h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto">
              We've received your details. Our team will reach out within 48 hours with a personalised JV proposal.
            </p>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="rounded-2xl p-6 md:p-12 border"
            style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(212,168,83,0.15)' }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold tracking-[2px] uppercase text-slate-400">Full Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleChange}
                    className="jv-input w-full pl-10 pr-4 py-3.5 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition-all duration-300"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold tracking-[2px] uppercase text-slate-400">Phone Number</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+91 00000 00000"
                    value={form.phone}
                    onChange={handleChange}
                    className="jv-input w-full pl-10 pr-4 py-3.5 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition-all duration-300"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold tracking-[2px] uppercase text-slate-400">Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className="jv-input w-full pl-10 pr-4 py-3.5 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition-all duration-300"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  />
                </div>
              </div>

              {/* Land Location */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold tracking-[2px] uppercase text-slate-400">Land Location</label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    name="location"
                    required
                    placeholder="City / Area / District"
                    value={form.location}
                    onChange={handleChange}
                    className="jv-input w-full pl-10 pr-4 py-3.5 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition-all duration-300"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  />
                </div>
              </div>

              {/* Land Area */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[11px] font-bold tracking-[2px] uppercase text-slate-400">Land Area</label>
                <select
                  name="landArea"
                  required
                  value={form.landArea}
                  onChange={handleChange}
                  className="jv-input w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-300 appearance-none"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: form.landArea ? 'white' : '#4b5563',
                  }}
                >
                  <option value="" disabled style={{ background: '#031124' }}>Select approximate land area</option>
                  <option value="below-2400" style={{ background: '#031124', color: 'white' }}>Below 2,400 sq.ft</option>
                  <option value="2400-5000" style={{ background: '#031124', color: 'white' }}>2,400 – 5,000 sq.ft</option>
                  <option value="5000-10000" style={{ background: '#031124', color: 'white' }}>5,000 – 10,000 sq.ft</option>
                  <option value="10000-25000" style={{ background: '#031124', color: 'white' }}>10,000 – 25,000 sq.ft</option>
                  <option value="above-25000" style={{ background: '#031124', color: 'white' }}>Above 25,000 sq.ft</option>
                </select>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[11px] font-bold tracking-[2px] uppercase text-slate-400">Additional Details</label>
                <div className="relative">
                  <MessageSquare size={15} className="absolute left-4 top-4 text-slate-500" />
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Tell us about your land, current usage, or any specific requirements..."
                    value={form.message}
                    onChange={handleChange}
                    className="jv-input w-full pl-10 pr-4 py-3.5 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition-all duration-300 resize-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
              <button
                type="submit"
                className="jv-cta-btn inline-flex items-center gap-2 px-10 py-4 rounded-xl text-white text-sm font-bold tracking-[1px] uppercase transition-all duration-300 hover:-translate-y-1"
                style={{ background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_DARK} 100%)` }}
              >
                Submit Enquiry <Send size={15} />
              </button>
              <p className="text-[11px] text-slate-500">
                We respect your privacy. Your details are never shared with third parties.
              </p>
            </div>
          </motion.form>
        )}
      </div>
    </section>
  );
};

const JointVenture: React.FC = () => (
  <div className="relative bg-white text-dark min-h-screen overflow-x-hidden">
    <Navbar />

    {/* ── HERO SECTION ── */}
    <section className="relative w-full min-h-screen flex items-center overflow-hidden">

      {/* Subtle grid background */}
      <div className="absolute inset-0 jv-grid-bg pointer-events-none" />

      {/* Gold ambient glow */}
      <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: 'rgba(212,168,83,0.08)' }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none"
        style={{ background: 'rgba(212,168,83,0.05)' }} />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-5 md:px-16 py-28 md:py-32 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

        {/* ── LEFT COLUMN ── */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8"
            style={{ background: 'rgba(212,168,83,0.1)', border: '1px solid rgba(212,168,83,0.25)' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: GOLD }} />
            <span className="text-[10px] font-bold tracking-[3px] uppercase" style={{ color: GOLD }}>
              Joint Venture Opportunities
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-serif-display text-4xl sm:text-5xl md:text-6xl xl:text-7xl text-dark font-bold leading-[1.05] tracking-tight mb-6">
            Build Together.{' '}
            <span className="italic" style={{ color: GOLD }}>
              Grow Together.
            </span>
          </h1>

          {/* Description */}
          <p className="text-slate-500 text-base md:text-lg leading-relaxed mb-10 max-w-lg">
            Partner with us to transform your land into landmark developments. We offer
            transparent agreements, expert planning, timely execution, and maximum returns
            through trusted joint venture partnerships.
          </p>

          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                className="group flex items-start gap-3 p-4 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all duration-300"
                style={{ ['--tw-border-opacity' as string]: 1 }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(212,168,83,0.35)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '')}
              >
                <div
                  className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300"
                  style={{ background: 'rgba(212,168,83,0.1)', color: GOLD }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = GOLD; (e.currentTarget as HTMLElement).style.color = 'white'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(212,168,83,0.1)'; (e.currentTarget as HTMLElement).style.color = GOLD; }}
                >
                  {f.icon}
                </div>
                <div>
                  <h4 className="font-bold text-dark text-sm mb-0.5">{f.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="flex flex-wrap gap-4 items-center"
          >
            <a
              href="#partner-form"
              className="jv-cta-btn inline-flex items-center gap-2 px-8 py-4 rounded-lg text-white text-sm font-bold tracking-[1px] uppercase transition-all duration-300 hover:-translate-y-1"
              style={{ background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_DARK} 100%)` }}
            >
              Partner With Us <ArrowRight size={16} />
            </a>
            <a
              href="#jv-details"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-sm font-bold tracking-[1px] uppercase transition-all duration-300 hover:text-white"
              style={{ border: `2px solid ${GOLD}`, color: GOLD }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = GOLD; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              Learn More
            </a>
          </motion.div>
        </motion.div>

        {/* ── RIGHT COLUMN — Cinematic Visual Panel ── */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Main image container */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: '16/10' }}>

            <img
              src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1400&q=90&fit=crop"
              alt="Joint Venture Construction Partnership"
              className="w-full h-full object-cover"
            />

            {/* Warm overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-transparent to-amber-700/10" />

            {/* Blueprint overlay */}
            <div className="absolute inset-0 jv-blueprint-overlay pointer-events-none" />

            {/* Bottom gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent" />

            {/* Handshake overlay badge */}
            <div className="absolute top-5 left-5 flex items-center gap-3 bg-white/90 backdrop-blur-md rounded-xl px-4 py-3 shadow-lg border border-white/60">
              <div className="w-10 h-10 rounded-full overflow-hidden" style={{ border: '2px solid rgba(212,168,83,0.4)' }}>
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&q=80&fit=crop" alt="Developer" className="w-full h-full object-cover" />
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden -ml-3" style={{ border: '2px solid rgba(212,168,83,0.4)' }}>
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&q=80&fit=crop" alt="Landowner" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-dark">Partnership Sealed</p>
                <p className="text-[10px] font-semibold" style={{ color: GOLD }}>YBM × Landowner</p>
              </div>
            </div>

            {/* Bottom info strip */}
            <div className="absolute bottom-5 left-5 right-5">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-bold font-serif-display">Premium JV Development</p>
                    <p className="text-white/60 text-[11px] mt-0.5">Chennai · South India</p>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg px-3 py-1.5" style={{ background: GOLD }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span className="text-white text-[10px] font-bold tracking-[1px]">ACTIVE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating stat cards — hidden on mobile to avoid overflow */}
          <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 flex-col gap-3">
            {floatingStats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + i * 0.15 }}
                className="bg-white rounded-xl shadow-xl border border-slate-100 px-4 py-3 text-right min-w-[110px]"
              >
                <p className="text-lg font-bold font-serif-display" style={{ color: i === 0 ? GOLD : '#031124' }}>
                  {s.val}
                </p>
                <p className="text-[10px] text-slate-500 font-medium">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* ROI chart floating card — hidden on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1 }}
            className="hidden lg:block absolute -bottom-6 -left-4 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 w-52"
          >
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[1px] mb-3">ROI Growth</p>
            <div className="flex items-end gap-1.5 h-12">
              {[30, 45, 38, 60, 52, 75, 90].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm jv-bar-animate"
                  style={{
                    height: `${h}%`,
                    background: i === 6
                      ? `linear-gradient(to top, ${GOLD}, #e5c97a)`
                      : 'rgba(212,168,83,0.25)',
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
            <p className="text-[10px] font-bold mt-2" style={{ color: GOLD }}>↑ 3× Returns vs Market</p>
          </motion.div>
        </motion.div>
      </div>
    </section>

    {/* ── HOW IT WORKS ── */}
    <section id="jv-details" className="py-24 px-6 md:px-16 bg-slate-50/60">
      <div className="max-w-7xl mx-auto text-center">
        <span className="text-[10px] font-bold tracking-[3px] uppercase mb-3 block" style={{ color: GOLD }}>HOW IT WORKS</span>
        <h2 className="font-serif-display text-3xl md:text-5xl text-dark font-bold mb-10 md:mb-16">
          Your Land. Our Expertise.{' '}
          <span className="italic" style={{ color: GOLD }}>Shared Success.</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Land Assessment', desc: "We evaluate your land's potential, zoning, and market value to propose the best development plan." },
            { step: '02', title: 'JV Agreement', desc: 'Transparent, legally vetted joint venture agreement with clearly defined profit-sharing ratios.' },
            { step: '03', title: 'Development & Handover', desc: 'We handle design, approvals, construction, and sales — you receive your share upon completion.' },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 text-left">
              <span className="text-5xl font-bold font-serif-display text-slate-100">{item.step}</span>
              <h3 className="font-serif-display text-xl text-dark font-bold mt-2 mb-3">{item.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── PARTNER WITH US FORM ── */}
    <PartnerForm />
  </div>
);

export default JointVenture;

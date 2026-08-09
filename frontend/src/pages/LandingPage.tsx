import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { CATEGORY_CONFIG, QueueCategory } from '../types';
import {
  Sparkles,
  Clock,
  UserCheck,
  ShieldAlert,
  QrCode,
  Bell,
  Stethoscope,
  LayoutDashboard,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  HeartPulse,
  Building2,
  Users,
  Activity,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: string) => void;
  onOpenBooking: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onOpenBooking }) => {
  const { t } = useLanguage();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<'PATIENTS' | 'DOCTORS' | 'HOSPITALS'>('PATIENTS');
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  const testimonials = [
    {
      quote: "CareQueue AI reduced our ER triage waiting time by 42%. Patients receive real-time queue position on their phones, eliminating overcrowded waiting rooms.",
      author: "Dr. Sarah Jenkins",
      role: "Chief of Emergency Medicine, Metro General Hospital"
    },
    {
      quote: "The automated room allocation and Web Speech voice announcements transformed our OPD workflow. Doctors call next tickets in one click.",
      author: "Marcus Vance, MD",
      role: "Head of Cardiology Department"
    },
    {
      quote: "The interactive floor map and digital QR check-in gave our patients complete transparency and zero anxiety before consultations.",
      author: "Elena Rostova",
      role: "Operations Director, St. Jude Health Center"
    }
  ];

  const faqs = [
    {
      q: 'How does the AI Patient Prioritization algorithm work?',
      a: 'CareQueue AI evaluates reported symptoms, age, and clinical severity flags to assign a triage score (Emergency E-001, Urgent U-001, Priority P-001, General G-001) ensuring critical trauma cases bypass regular lines.'
    },
    {
      q: 'Can patients track their live position on mobile devices?',
      a: 'Yes! Patients receive a live digital pass with real-time queue position counters, estimated wait updates, assigned room numbers, and voice alerts.'
    },
    {
      q: 'How does QR Code Check-In operate at reception?',
      a: 'Upon arrival, patients present their digital QR pass at reception or self-service kiosks to instantly validate check-in and update room allocation queues.'
    },
    {
      q: 'Is CareQueue compatible with existing hospital EMR / EHR systems?',
      a: 'CareQueue provides standard RESTful & HL7/FHIR compliant APIs for seamless integration with Epic, Cerner, and hospital management databases.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Animated Background Mesh & Glow Blobs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-1/4 w-96 h-96 bg-blue-500/20 dark:bg-blue-500/30 blur-3xl rounded-full pointer-events-none"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-10 right-1/4 w-96 h-96 bg-teal-500/20 dark:bg-teal-500/30 blur-3xl rounded-full pointer-events-none"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-extrabold shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-blue-500 animate-spin" />
              <span>Next-Gen Healthcare Triage Engine v2.5</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              Smarter Healthcare. <br />
              <span className="text-gradient-blue">Shorter Waiting Times.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Eliminate crowded hospital waiting rooms with real-time AI triage, instant room allocation, interactive floor map navigation, and WebSocket live updates.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpenBooking}
                className="px-7 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 text-white font-extrabold text-sm shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all flex items-center gap-2.5"
              >
                <Calendar className="w-4 h-4" />
                <span>{t('bookAppointment')}</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('PATIENT')}
                className="px-7 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-extrabold text-sm shadow-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2.5"
              >
                <Activity className="w-4 h-4 text-blue-500 animate-pulse" />
                <span>View Live Queue Demo</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Interactive Live Queue Mockup Card with Motion */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="glass-card rounded-3xl p-6 relative border border-slate-200/80 dark:border-slate-800/80 shadow-2xl space-y-4 glow-blue">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-500" /> Live Hospital Monitor
                </span>
              </div>

              {/* Sample Ticket Preview Badges */}
              <div className="space-y-2.5">
                {[
                  { ticket: 'E-001', category: QueueCategory.EMERGENCY, room: 'Room 101 (ER)', status: 'IN CONSULTATION', wait: '0 min' },
                  { ticket: 'U-001', category: QueueCategory.URGENT, room: 'Room 201 (Urgent)', status: 'CALLED', wait: '12 min' },
                  { ticket: 'P-001', category: QueueCategory.PRIORITY, room: 'Room 301 (Specialist)', status: 'WAITING', wait: '25 min' },
                  { ticket: 'G-001', category: QueueCategory.GENERAL, room: 'Room 401 (OPD)', status: 'WAITING', wait: '40 min' }
                ].map((item, idx) => {
                  const cfg = CATEGORY_CONFIG[item.category];
                  return (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.02, x: 4 }}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/60 dark:border-slate-800 text-xs shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-xl font-extrabold text-xs shadow-sm ${cfg.badgeClass}`}>
                          {item.ticket}
                        </span>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-100">{cfg.label}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{item.room}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                          {item.status}
                        </span>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">{item.wait}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Live Statistics */}
      <section className="py-12 bg-white dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {[
              { label: t('patientsServed'), value: '1,420+' },
              { label: t('avgWaitTime'), value: '12 min' },
              { label: t('doctorsAvailable'), value: '24 Duty' },
              { label: 'Emergency Response', value: '< 2 min' },
              { label: t('hospitalsConnected'), value: '18 Centers' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="space-y-1 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm"
              >
                <p className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">{stat.value}</p>
                <p className="text-xs font-bold text-slate-600 dark:text-slate-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Features Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Built for High-Volume Hospital Ecosystems
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
            Comprehensive suite designed for seamless collaboration between patients, triage receptionists, doctors, and hospital administrators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Calendar, title: 'Smart Appointment Booking', desc: 'AI triage evaluates patient symptoms and pre-allocates matching department rooms.' },
            { icon: Clock, title: 'Live Queue Tracking', desc: 'Patients track real-time position, estimated wait times, and voice alerts on mobile.' },
            { icon: ShieldAlert, title: 'AI Patient Prioritization', desc: 'Automatic category triage (Emergency E, Urgent U, Priority P, General G) guarantees safety.' },
            { icon: QrCode, title: 'QR Code Check-In', desc: 'Instant self-service kiosk check-in with digital QR passes generated on registration.' },
            { icon: Bell, title: 'Real-Time WebSockets', desc: 'Socket.IO instant synchronization across room monitors, patient phones, and doctor desks.' },
            { icon: LayoutDashboard, title: 'Role-Based Dashboards', desc: 'Tailored workspaces for Patients, Receptionists, Doctors, and Administrators.' },
            { icon: Stethoscope, title: 'Doctor Suite & Voice Call', desc: 'One-click patient calling triggering Web Speech voice announcements across halls.' },
            { icon: BarChart3, title: 'Analytics & Workload Engine', desc: 'Live room utilization matrices, doctor throughput metrics, and wait duration trends.' },
            { icon: UserCheck, title: 'Emergency Override Controls', desc: 'Authorized clinical staff can inject critical trauma cases into active doctor rooms.' }
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="glass-card rounded-3xl p-7 border border-slate-200 dark:border-slate-800/80 glass-card-hover"
              >
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-400 text-white flex items-center justify-center mb-5 shadow-lg shadow-blue-500/20">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 4. How It Works (4-Step Visual Flow) */}
      <section className="py-24 bg-white dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">How CareQueue Works</h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">Seamless 4-step patient journey from booking to consultation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {[
              { step: '01', title: 'Book Appointment', desc: 'Submit symptoms online or at hospital kiosk.' },
              { step: '02', title: 'Get Ticket & Room', desc: 'AI assigns E/U/P/G prefix ticket & room range.' },
              { step: '03', title: 'Scan QR Check-In', desc: 'Scan pass at reception to validate arrival.' },
              { step: '04', title: 'Consult Doctor', desc: 'Voice announcement calls ticket to room.' }
            ].map((s, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                className="text-center p-7 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-md relative"
              >
                <span className="inline-block w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-base leading-[48px] mb-5 shadow-lg shadow-blue-500/30">
                  {s.step}
                </span>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base mb-2">{s.title}</h3>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Benefits by Audience */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Empowering Everyone</h2>
          <div className="flex justify-center gap-3 mt-6">
            {(['PATIENTS', 'DOCTORS', 'HOSPITALS'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                For {tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="glass-card rounded-3xl p-8 max-w-3xl mx-auto border border-slate-200 dark:border-slate-800 shadow-2xl"
        >
          {activeTab === 'PATIENTS' && (
            <div className="space-y-5">
              <h3 className="font-black text-xl text-blue-600 dark:text-blue-400 flex items-center gap-2.5">
                <Users className="w-6 h-6" /> Patient Experience Upgrade
              </h3>
              <ul className="space-y-3.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" /> Reduce waiting room stress with transparent live queue tracking on your phone.</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" /> Receive audio voice callouts and push notifications when your doctor is ready.</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" /> Interactive hospital floor map guides you straight to your assigned room.</li>
              </ul>
            </div>
          )}
          {activeTab === 'DOCTORS' && (
            <div className="space-y-5">
              <h3 className="font-black text-xl text-blue-600 dark:text-blue-400 flex items-center gap-2.5">
                <Stethoscope className="w-6 h-6" /> Clinical Workflow Optimization
              </h3>
              <ul className="space-y-3.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" /> One-click patient calling with integrated triage symptom summaries.</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" /> Automated room availability toggling preventing double booking.</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" /> Instant emergency alerts for critical incoming trauma cases.</li>
              </ul>
            </div>
          )}
          {activeTab === 'HOSPITALS' && (
            <div className="space-y-5">
              <h3 className="font-black text-xl text-blue-600 dark:text-blue-400 flex items-center gap-2.5">
                <Building2 className="w-6 h-6" /> Hospital Resource & Capacity Management
              </h3>
              <ul className="space-y-3.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" /> Maximize room utilization percentages across all hospital wings.</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" /> Real-time analytics charts tracking hourly patient volume trends.</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" /> Multi-language & WCAG compliant accessible interface.</li>
              </ul>
            </div>
          )}
        </motion.div>
      </section>

      {/* 6. Testimonials Carousel */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8 relative z-10">
          <ShieldCheck className="w-12 h-12 text-blue-400 mx-auto" />
          <AnimatePresence mode="wait">
            <motion.div
              key={testimonialIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              <p className="text-lg sm:text-xl font-medium italic text-slate-200 leading-relaxed max-w-2xl mx-auto">
                "{testimonials[testimonialIdx].quote}"
              </p>
              <div>
                <p className="font-extrabold text-blue-400 text-base">{testimonials[testimonialIdx].author}</p>
                <p className="text-xs text-slate-400">{testimonials[testimonialIdx].role}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center items-center gap-4 pt-2">
            <button
              onClick={() => setTestimonialIdx((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIdx(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    testimonialIdx === i ? 'bg-blue-500 w-6' : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setTestimonialIdx((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900 shadow-sm">
              <button
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className="w-full text-left p-5 font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center justify-between"
              >
                <span>{f.q}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${activeFaq === i ? 'rotate-180 text-blue-500' : ''}`} />
              </button>
              <AnimatePresence>
                {activeFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-400 font-medium border-t border-slate-200/50 dark:border-slate-800 pt-4 leading-relaxed">
                      {f.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="bg-slate-900 text-slate-400 py-14 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-extrabold text-base">
              <Activity className="w-5 h-5 text-blue-500" />
              <span>CareQueue AI</span>
            </div>
            <p className="text-slate-400 leading-relaxed font-medium">Production-Ready Smart Healthcare Queue & Room Allocation System.</p>
          </div>
          <div>
            <h4 className="font-extrabold text-white mb-3">Quick Navigation</h4>
            <ul className="space-y-2 font-medium">
              <li><button onClick={() => onNavigate('PATIENT')} className="hover:text-white transition-colors">Patient Portal</button></li>
              <li><button onClick={() => onNavigate('RECEPTION')} className="hover:text-white transition-colors">Reception Desk</button></li>
              <li><button onClick={() => onNavigate('DOCTOR')} className="hover:text-white transition-colors">Doctor Suite</button></li>
              <li><button onClick={() => onNavigate('ADMIN')} className="hover:text-white transition-colors">Admin Command Center</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-extrabold text-white mb-3">Emergency Response</h4>
            <p className="text-red-400 font-extrabold">24/7 Hotline: 1-800-CARE-911</p>
            <p className="mt-2 font-medium">CareQueue Hospital Wings A - D</p>
          </div>
          <div>
            <h4 className="font-extrabold text-white mb-3">Security & Compliance</h4>
            <p className="font-medium">HIPAA & HL7/FHIR Data Compliant</p>
            <p className="mt-2 text-slate-500">© 2026 CareQueue Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

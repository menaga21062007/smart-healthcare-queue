import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ApiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Appointment, CATEGORY_CONFIG, QueueCategory } from '../types';
import { FloorMap } from '../components/FloorMap';
import { QRScannerModal } from '../components/QRScannerModal';
import {
  Ticket,
  Clock,
  User,
  MapPin,
  QrCode,
  AlertCircle,
  PlusCircle,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Activity
} from 'lucide-react';

interface PatientDashboardProps {
  onOpenBooking: () => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({ onOpenBooking }) => {
  const { user } = useAuth();
  const [ticket, setTicket] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const t = await ApiService.getMyTicket();
      setTicket(t);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
    const interval = setInterval(fetchTicket, 4000);
    return () => clearInterval(interval);
  }, []);

  const cfg = ticket ? CATEGORY_CONFIG[ticket.category] : CATEGORY_CONFIG[QueueCategory.GENERAL];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
    >
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden glow-blue">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 text-white text-xs font-extrabold backdrop-blur-md">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Patient Portal Live Session</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {user?.name || 'Valued Patient'}
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm max-w-xl font-medium">
            Track your real-time queue position, assigned doctor, room location, and interactive floor map route.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenBooking}
          className="px-6 py-3.5 rounded-2xl bg-white text-blue-700 font-extrabold text-xs shadow-xl hover:bg-blue-50 transition-all flex items-center gap-2 relative z-10"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Book New Appointment</span>
        </motion.button>
      </div>

      {loading && !ticket ? (
        <div className="glass-card p-12 rounded-3xl text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Syncing active queue pass...</p>
        </div>
      ) : ticket ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Active Ticket Card */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 relative overflow-hidden glow-blue"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">Active Queue Pass</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${cfg.badgeClass}`}>
                      {cfg.label}
                    </span>
                    <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 animate-pulse">
                      {ticket.status}
                    </span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQrModalOpen(true)}
                  className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/80 text-blue-600 dark:text-blue-400 transition-colors shadow-sm"
                  title="View Digital QR Pass"
                >
                  <QrCode className="w-6 h-6" />
                </motion.button>
              </div>

              {/* Big Ticket Display */}
              <div className="text-center py-5 bg-slate-50 dark:bg-slate-900/90 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-2">
                <p className="text-xs text-slate-400 font-extrabold uppercase tracking-widest">Your Ticket Number</p>
                <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">{ticket.ticketNumber}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto px-4 truncate">
                  Symptoms: "{ticket.symptoms}"
                </p>
              </div>

              {/* Queue Metrics */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 space-y-1">
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mx-auto" />
                  <p className="text-2xl font-black text-slate-900 dark:text-white">~{ticket.estimatedWaitMinutes} min</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-extrabold">Estimated Wait</p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 space-y-1">
                  <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  <p className="text-2xl font-black text-slate-900 dark:text-white">#{ticket.positionInQueue}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-extrabold">Position in Line</p>
                </div>
              </div>

              {/* Assigned Doctor & Room */}
              <div className="space-y-3 bg-slate-50 dark:bg-slate-900 p-4.5 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">Assigned Physician:</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">{ticket.doctorName || 'General Physician'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">Assigned Room:</span>
                  <span className="font-black text-blue-600 dark:text-blue-400 text-sm">Room {ticket.roomNumber || '101'}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Interactive Floor Map Route */}
          <div className="lg:col-span-7 space-y-6">
            <FloorMap assignedRoomNumber={ticket.roomNumber || '101'} category={ticket.category} />
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-3xl p-12 text-center max-w-xl mx-auto space-y-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
            <Ticket className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">No Active Queue Ticket</h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
              You do not have an active ticket currently in line. Book a new appointment to receive AI category triage & room allocation.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenBooking}
            className="px-7 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-xl shadow-blue-500/30 transition-all inline-flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Book Appointment Now</span>
          </motion.button>
        </div>
      )}

      {/* QR Code Pass Modal */}
      <QRScannerModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        ticketNumber={ticket?.ticketNumber}
        mode="GENERATE"
      />
    </motion.div>
  );
};

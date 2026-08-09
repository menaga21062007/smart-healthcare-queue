import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ApiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Appointment, CATEGORY_CONFIG } from '../types';
import {
  Stethoscope,
  Volume2,
  CheckCircle2,
  Clock,
  User,
  AlertTriangle,
  FileText,
  Play,
  ArrowRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [queue, setQueue] = useState<Appointment[]>([]);
  const [activePatient, setActivePatient] = useState<Appointment | null>(null);
  const [calling, setCalling] = useState(false);

  const fetchQueue = async () => {
    try {
      const q = await ApiService.getLiveQueue();
      setQueue(q);
      const calledOrIn = q.find(a => a.status === 'CALLED' || a.status === 'IN_CONSULTATION');
      if (calledOrIn) setActivePatient(calledOrIn);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCallNext = async () => {
    try {
      setCalling(true);
      const res = await ApiService.callNextTicket(user?.doctorId, user?.roomNumber || '101');
      fetchQueue();
    } catch (err: any) {
      alert(err.message || 'No waiting patients in queue');
    } finally {
      setCalling(false);
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!activePatient) return;
    try {
      await ApiService.updateAppointmentStatus(activePatient.id, status);
      if (status === 'COMPLETED' || status === 'CANCELLED') {
        setActivePatient(null);
      }
      fetchQueue();
    } catch (err) {
      console.error(err);
    }
  };

  const waitingPatients = queue.filter(q => q.status === 'WAITING');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
    >
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl glow-blue">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-400 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-500/25">
            <Stethoscope className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              {user?.name || 'Dr. Marcus Vance'}
            </h1>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {user?.specialization || 'Cardiovascular & Emergency Medicine'} • <span className="font-extrabold text-blue-600 dark:text-blue-400">Room {user?.roomNumber || '101'}</span>
            </p>
          </div>
        </div>

        {/* Big Call Next Patient Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCallNext}
          disabled={calling}
          className="w-full md:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 hover:opacity-95 text-white font-black text-sm shadow-xl shadow-blue-500/30 transition-all flex items-center justify-center gap-3"
        >
          <Volume2 className={`w-5 h-5 ${calling ? 'animate-bounce' : ''}`} />
          <span>{calling ? 'Calling Ticket...' : 'CALL NEXT PATIENT'}</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Active Consultation Panel */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Active Patient Consultation</span>
              {activePatient && (
                <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 animate-pulse">
                  {activePatient.status}
                </span>
              )}
            </div>

            {activePatient ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/90 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                  <div>
                    <p className="text-xs text-slate-400 font-extrabold uppercase">Ticket Number</p>
                    <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{activePatient.ticketNumber}</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{activePatient.patientName}</p>
                  </div>
                  <span className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold border shadow-sm ${CATEGORY_CONFIG[activePatient.category]?.badgeClass}`}>
                    {CATEGORY_CONFIG[activePatient.category]?.label}
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-500" />
                    Reported Symptoms & Clinical Triage Notes
                  </label>
                  <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium border border-slate-200 dark:border-slate-700">
                    "{activePatient.symptoms}"
                  </div>
                </div>

                {/* Consultation Controls */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleStatusChange('IN_CONSULTATION')}
                    className="py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    <span>Start Consultation</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleStatusChange('COMPLETED')}
                    className="py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Finish & Discharge</span>
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="text-center py-14 text-slate-400 space-y-3">
                <Clock className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" />
                <p className="text-sm font-extrabold text-slate-700 dark:text-slate-300">Room Ready for Next Patient</p>
                <p className="text-xs font-medium">Click "CALL NEXT PATIENT" to broadcast ticket callout.</p>
              </div>
            )}
          </div>
        </div>

        {/* Next Patients Queue List */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center justify-between">
              <span>Waiting Patients ({waitingPatients.length})</span>
              <span className="text-[11px] font-extrabold text-blue-500">Priority Order</span>
            </h3>

            <div className="space-y-3">
              {waitingPatients.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">No patients currently waiting.</p>
              ) : (
                waitingPatients.map((p) => {
                  const cfg = CATEGORY_CONFIG[p.category];
                  return (
                    <motion.div
                      key={p.id}
                      whileHover={{ x: 4 }}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-xl font-extrabold text-xs ${cfg.badgeClass}`}>
                          {p.ticketNumber}
                        </span>
                        <div>
                          <p className="font-extrabold text-slate-900 dark:text-slate-200">{p.patientName}</p>
                          <p className="text-[10px] text-slate-400 max-w-[140px] truncate font-medium">{p.symptoms}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-extrabold">
                        ~{p.estimatedWaitMinutes}m
                      </span>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ApiService } from '../services/api';
import { AnalyticsSummary, CATEGORY_CONFIG } from '../types';
import {
  Shield,
  BarChart3,
  Users,
  Clock,
  Building2,
  AlertOctagon,
  RefreshCw,
  Zap,
  TrendingUp,
  Activity,
  X
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [overrideModal, setOverrideModal] = useState(false);
  const [emergencyName, setEmergencyName] = useState('');

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getAnalyticsSummary();
      setAnalytics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleEmergencyOverride = async () => {
    if (!emergencyName.trim()) return;
    try {
      await ApiService.emergencyOverride(emergencyName, 'Code Red Emergency Override');
      setEmergencyName('');
      setOverrideModal(false);
      fetchAnalytics();
    } catch (err) {
      console.error(err);
    }
  };

  const sum = analytics?.summary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-md">
              <Shield className="w-6 h-6" />
            </div>
            Hospital Command & Analytics Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Real-time queue analytics, room utilization, physician workload, and emergency override protocols.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOverrideModal(true)}
          className="px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-xl shadow-red-500/30 flex items-center gap-2.5 transition-all glow-red"
        >
          <AlertOctagon className="w-4 h-4 animate-ping" />
          <span>CODE RED EMERGENCY OVERRIDE</span>
        </motion.button>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div whileHover={{ y: -4 }} className="glass-card p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Patients Waiting</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{sum?.totalWaiting ?? 4}</p>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
            <span className="text-red-500">{sum?.emergencyCount ?? 1} Emergency</span> • 
            <span className="text-orange-500">{sum?.urgentCount ?? 1} Urgent</span>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="glass-card p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Avg Wait Time</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{sum?.avgWaitMinutes ?? 12} min</p>
          <p className="text-[10px] text-emerald-500 font-extrabold">↓ 18% improvement vs target</p>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="glass-card p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Patients Served Today</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{sum?.totalServedToday ?? 142}</p>
          <p className="text-[10px] text-slate-400 font-semibold">Target capacity: 250 / day</p>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="glass-card p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Active Rooms</span>
            <Building2 className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{sum?.activeRoomsCount ?? 8} / 10</p>
          <p className="text-[10px] text-blue-500 font-extrabold">80% active utilization</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Room Utilization Matrix */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center justify-between">
              <span>Hospital Room Utilization Matrix</span>
              <span className="text-[11px] font-extrabold text-blue-500">Wings A - D</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {analytics?.roomUtilization.map((r) => (
                <motion.div
                  key={r.roomNumber}
                  whileHover={{ scale: 1.03 }}
                  className={`p-4 rounded-2xl border text-xs space-y-2 transition-all shadow-sm ${
                    r.status === 'OCCUPIED'
                      ? 'bg-red-50/60 dark:bg-red-950/40 border-red-200 dark:border-red-900/60'
                      : 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900 dark:text-white">Room {r.roomNumber}</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${r.status === 'OCCUPIED' ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`} />
                  </div>
                  <p className="text-[10px] font-extrabold text-slate-500">{r.category}</p>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: `${r.utilizationRatePercentage}%` }} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Doctor Workload Distribution */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
              Doctor Workload Distribution
            </h3>

            <div className="space-y-3">
              {analytics?.doctorWorkload.map((doc) => (
                <motion.div
                  key={doc.doctorId}
                  whileHover={{ x: 4 }}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-xs space-y-2 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-extrabold text-slate-900 dark:text-slate-200">{doc.doctorName}</p>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {doc.completedToday} Served Today
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">{doc.department} • Avg {doc.avgConsultationTimeMins}m consultation</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Code Red Override Modal */}
      <AnimatePresence>
        {overrideModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 border border-red-300 dark:border-red-900/80 rounded-3xl max-w-md w-full p-7 shadow-2xl space-y-5 relative"
            >
              <div className="flex items-center gap-3 text-red-600">
                <AlertOctagon className="w-9 h-9 animate-ping flex-shrink-0" />
                <div>
                  <h3 className="font-black text-lg text-slate-900 dark:text-white">Emergency Code Red Override</h3>
                  <p className="text-xs text-slate-500 font-medium">Inject critical patient into immediate room queue</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <label className="font-extrabold text-slate-700 dark:text-slate-300">Patient Emergency Identifier / Name:</label>
                <input
                  type="text"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  placeholder="e.g. Trauma Case #911"
                  className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setOverrideModal(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEmergencyOverride}
                  className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-lg shadow-red-500/30"
                >
                  Trigger Code Red
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

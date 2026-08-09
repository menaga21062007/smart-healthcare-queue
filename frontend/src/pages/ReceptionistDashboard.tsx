import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ApiService } from '../services/api';
import { Appointment, CATEGORY_CONFIG, QueueCategory } from '../types';
import { QRScannerModal } from '../components/QRScannerModal';
import {
  Users,
  Search,
  Filter,
  Plus,
  Scan,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RefreshCw,
  Phone,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface ReceptionistDashboardProps {
  onOpenBooking: () => void;
}

export const ReceptionistDashboard: React.FC<ReceptionistDashboardProps> = ({ onOpenBooking }) => {
  const [queue, setQueue] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [scannerOpen, setScannerOpen] = useState(false);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const q = await ApiService.getLiveQueue();
      setQueue(q);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleScanComplete = async (ticketNum: string) => {
    const app = queue.find(q => q.ticketNumber.toLowerCase() === ticketNum.toLowerCase());
    if (app) {
      await ApiService.updateAppointmentStatus(app.id, 'WAITING');
      fetchQueue();
    }
  };

  const filtered = queue.filter(item => {
    const matchesSearch = item.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
                          item.patientName.toLowerCase().includes(search.toLowerCase()) ||
                          item.symptoms.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
              <Users className="w-6 h-6" />
            </div>
            Triage & Reception Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Manage patient intake, QR code check-ins, triage prioritization, and room assignments.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setScannerOpen(true)}
            className="flex-1 md:flex-none px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-extrabold shadow-lg flex items-center justify-center gap-2 transition-all"
          >
            <Scan className="w-4 h-4 text-emerald-400" />
            <span>QR Scanner</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenBooking}
            className="flex-1 md:flex-none px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Intake</span>
          </motion.button>
        </div>
      </div>

      {/* Filters & Search bar */}
      <div className="glass-card rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ticket #, patient name, symptoms..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['ALL', 'EMERGENCY', 'URGENT', 'PRIORITY', 'GENERAL'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-105'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat === 'ALL' ? 'All Queues' : CATEGORY_CONFIG[cat as QueueCategory]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Live Queue Table */}
      <div className="glass-card rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
            <span>Active Patients in Line ({filtered.length})</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </h3>
          <button
            onClick={fetchQueue}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase font-black text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Ticket</th>
                <th className="p-4">Patient Info</th>
                <th className="p-4">Category & Triage</th>
                <th className="p-4">Assigned Room</th>
                <th className="p-4">Est. Wait</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No matching patients currently in queue.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const cfg = CATEGORY_CONFIG[item.category];
                  return (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition-colors"
                    >
                      <td className="p-4 font-black">
                        <span className={`px-3 py-1 rounded-xl border text-xs shadow-sm ${cfg.badgeClass}`}>
                          {item.ticketNumber}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="font-extrabold text-slate-900 dark:text-slate-100">{item.patientName}</p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 font-semibold">
                          <Phone className="w-3 h-3" /> {item.patientPhone || 'N/A'}
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-slate-800 dark:text-slate-200">{cfg.label}</p>
                        <p className="text-[10px] text-slate-400 max-w-xs truncate">{item.symptoms}</p>
                      </td>
                      <td className="p-4 font-black text-blue-600 dark:text-blue-400">
                        Room {item.roomNumber || '101'}
                      </td>
                      <td className="p-4 font-extrabold text-slate-700 dark:text-slate-300">
                        ~{item.estimatedWaitMinutes} min
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={async () => {
                            await ApiService.updateAppointmentStatus(item.id, 'COMPLETED');
                            fetchQueue();
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[11px] font-extrabold hover:bg-emerald-200 transition-colors shadow-sm"
                        >
                          Complete
                        </motion.button>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Code Check-In Scanner Modal */}
      <QRScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScanComplete={handleScanComplete}
        mode="SCAN"
      />
    </motion.div>
  );
};

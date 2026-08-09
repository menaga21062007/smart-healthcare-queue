import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QueueCategory } from '../types';
import { Navigation, MapPin, Sparkles, Compass } from 'lucide-react';

interface FloorMapProps {
  assignedRoomNumber?: string;
  category?: QueueCategory;
}

export const FloorMap: React.FC<FloorMapProps> = ({ assignedRoomNumber = '101', category = QueueCategory.EMERGENCY }) => {
  const [selectedWing, setSelectedWing] = useState<string>('ALL');

  const getRoomCoords = (roomNum: string) => {
    if (roomNum.startsWith('1')) return { x: 120, y: 110, label: 'ER 101-105', color: '#ef4444', wing: 'Wing A' };
    if (roomNum.startsWith('2')) return { x: 380, y: 110, label: 'Urgent 201-205', color: '#f97316', wing: 'Wing B' };
    if (roomNum.startsWith('3')) return { x: 120, y: 310, label: 'Priority 301-305', color: '#eab308', wing: 'Wing C' };
    return { x: 380, y: 310, label: 'General OPD 401-420', color: '#3b82f6', wing: 'Wing D' };
  };

  const targetCoords = getRoomCoords(assignedRoomNumber);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
            Interactive Hospital Floor Map & Navigation
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Shortest directional path to <span className="font-extrabold text-blue-600 dark:text-blue-400">Room {assignedRoomNumber}</span> ({targetCoords.wing})
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-extrabold px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-sm">
          <MapPin className="w-4 h-4 animate-bounce" />
          <span>Active Route</span>
        </div>
      </div>

      <div className="relative w-full overflow-hidden rounded-2xl bg-slate-950 p-4 border border-slate-800/90 shadow-2xl">
        <svg viewBox="0 0 500 400" className="w-full h-auto max-h-[380px]">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.8" />
            </pattern>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor={targetCoords.color} />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <rect width="500" height="400" fill="url(#grid)" />

          {/* Hallway Corridors */}
          <path d="M 250 40 L 250 360 M 40 200 L 460 200" stroke="#334155" strokeWidth="26" strokeLinecap="round" />

          {/* Main Entrance / Check-in Counter */}
          <g transform="translate(250, 360)">
            <rect x="-50" y="-16" width="100" height="32" rx="8" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
            <text x="0" y="4" textAnchor="middle" fill="#93c5fd" fontSize="10" fontWeight="bold">Main Entrance</text>
          </g>

          {/* Wing A: Emergency */}
          <g transform="translate(40, 50)" className="transition-transform hover:scale-[1.02]">
            <rect width="160" height="110" rx="10" fill="#450a0a" stroke="#ef4444" strokeWidth="2" strokeDasharray={assignedRoomNumber.startsWith('1') ? '0' : '4'} />
            <text x="15" y="25" fill="#fca5a5" fontSize="11" fontWeight="bold">Wing A: Emergency</text>
            <text x="15" y="44" fill="#fee2e2" fontSize="9">Rooms 101 - 105</text>

            <rect x="15" y="58" width="40" height="36" rx="6" fill={assignedRoomNumber === '101' ? '#ef4444' : '#7f1d1d'} filter={assignedRoomNumber === '101' ? 'url(#glow)' : undefined} />
            <text x="35" y="80" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">101</text>

            <rect x="65" y="58" width="40" height="36" rx="6" fill={assignedRoomNumber === '102' ? '#ef4444' : '#7f1d1d'} />
            <text x="85" y="80" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">102</text>
          </g>

          {/* Wing B: Urgent Care */}
          <g transform="translate(300, 50)" className="transition-transform hover:scale-[1.02]">
            <rect width="160" height="110" rx="10" fill="#431407" stroke="#f97316" strokeWidth="2" strokeDasharray={assignedRoomNumber.startsWith('2') ? '0' : '4'} />
            <text x="15" y="25" fill="#fdba74" fontSize="11" fontWeight="bold">Wing B: Urgent Care</text>
            <text x="15" y="44" fill="#ffedd5" fontSize="9">Rooms 201 - 205</text>

            <rect x="15" y="58" width="40" height="36" rx="6" fill={assignedRoomNumber === '201' ? '#f97316' : '#7c2d12'} filter={assignedRoomNumber === '201' ? 'url(#glow)' : undefined} />
            <text x="35" y="80" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">201</text>

            <rect x="65" y="58" width="40" height="36" rx="6" fill={assignedRoomNumber === '202' ? '#f97316' : '#7c2d12'} />
            <text x="85" y="80" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">202</text>
          </g>

          {/* Wing C: Priority Clinic */}
          <g transform="translate(40, 240)" className="transition-transform hover:scale-[1.02]">
            <rect width="160" height="110" rx="10" fill="#422006" stroke="#eab308" strokeWidth="2" strokeDasharray={assignedRoomNumber.startsWith('3') ? '0' : '4'} />
            <text x="15" y="25" fill="#fde047" fontSize="11" fontWeight="bold">Wing C: Priority Clinic</text>
            <text x="15" y="44" fill="#fef9c3" fontSize="9">Rooms 301 - 305</text>

            <rect x="15" y="58" width="40" height="36" rx="6" fill={assignedRoomNumber === '301' ? '#eab308' : '#713f12'} filter={assignedRoomNumber === '301' ? 'url(#glow)' : undefined} />
            <text x="35" y="80" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">301</text>

            <rect x="65" y="58" width="40" height="36" rx="6" fill={assignedRoomNumber === '302' ? '#eab308' : '#713f12'} />
            <text x="85" y="80" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">302</text>
          </g>

          {/* Wing D: General OPD */}
          <g transform="translate(300, 240)" className="transition-transform hover:scale-[1.02]">
            <rect width="160" height="110" rx="10" fill="#172554" stroke="#3b82f6" strokeWidth="2" strokeDasharray={assignedRoomNumber.startsWith('4') ? '0' : '4'} />
            <text x="15" y="25" fill="#93c5fd" fontSize="11" fontWeight="bold">Wing D: General OPD</text>
            <text x="15" y="44" fill="#dbeafe" fontSize="9">Rooms 401 - 420</text>

            <rect x="15" y="58" width="40" height="36" rx="6" fill={assignedRoomNumber === '401' ? '#3b82f6' : '#1e3a8a'} filter={assignedRoomNumber === '401' ? 'url(#glow)' : undefined} />
            <text x="35" y="80" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">401</text>

            <rect x="65" y="58" width="40" height="36" rx="6" fill={assignedRoomNumber === '402' ? '#3b82f6' : '#1e3a8a'} />
            <text x="85" y="80" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">402</text>
          </g>

          {/* Animated Directional Path Line */}
          <path
            d={`M 250 340 L 250 200 L ${targetCoords.x} 200 L ${targetCoords.x} ${targetCoords.y}`}
            fill="none"
            stroke="url(#pathGradient)"
            strokeWidth="5"
            strokeDasharray="10 5"
            className="animate-pulse"
            filter="url(#glow)"
          />

          {/* Target Destination Marker */}
          <g transform={`translate(${targetCoords.x}, ${targetCoords.y})`}>
            <circle r="14" fill={targetCoords.color} className="animate-ping opacity-75" />
            <circle r="9" fill={targetCoords.color} stroke="#fff" strokeWidth="2.5" />
            <text x="0" y="26" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">
              Room {assignedRoomNumber}
            </text>
          </g>
        </svg>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 border-t border-slate-800/80 pt-3">
          <div className="flex items-center gap-3 font-semibold">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Emergency</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Urgent</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Priority</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> General</span>
          </div>
          <span className="text-blue-400 font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Follow glowing route from Entrance
          </span>
        </div>
      </div>
    </motion.div>
  );
};

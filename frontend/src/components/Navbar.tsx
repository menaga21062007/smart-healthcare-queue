import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useSocket } from '../context/SocketContext';
import { UserRole } from '../types';
import {
  Activity,
  Sun,
  Moon,
  Globe,
  UserCheck,
  LogOut,
  Shield,
  Stethoscope,
  Users,
  User as UserIcon,
  ChevronDown,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { user, logout, quickSwitchRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { isConnected } = useSocket();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const navItems = [
    { label: 'Overview', view: 'LANDING' },
    { label: 'Patient Portal', view: 'PATIENT' },
    { label: 'Reception Desk', view: 'RECEPTION' },
    { label: 'Doctor Suite', view: 'DOCTOR' },
    { label: 'Command Center', view: 'ADMIN' }
  ];

  const roles = [
    { label: 'Patient Portal', role: UserRole.PATIENT, icon: UserIcon, view: 'PATIENT' },
    { label: 'Receptionist Desk', role: UserRole.RECEPTIONIST, icon: Users, view: 'RECEPTION' },
    { label: 'Doctor Suite', role: UserRole.DOCTOR, icon: Stethoscope, view: 'DOCTOR' },
    { label: 'Hospital Admin', role: UserRole.ADMIN, icon: Shield, view: 'ADMIN' }
  ];

  const handleRoleSwitch = async (roleObj: any) => {
    await quickSwitchRole(roleObj.role);
    onNavigate(roleObj.view);
    setRoleMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <motion.button
          onClick={() => onNavigate('LANDING')}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-3 focus:outline-none group"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div className="text-left">
            <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              CareQueue <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">AI 2.5</span>
            </span>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-none">Smart Triage Platform</p>
          </div>
        </motion.button>

        {/* Animated Sliding Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-300 relative bg-slate-100/80 dark:bg-slate-900/80 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80">
          {navItems.map((item) => {
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => onNavigate(item.view)}
                className={`relative px-3.5 py-1.5 rounded-xl transition-all duration-200 text-xs ${
                  isActive ? 'text-blue-600 dark:text-blue-400 font-extrabold' : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-tab"
                    className="absolute inset-0 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200/80 dark:border-slate-700"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Tools */}
        <div className="flex items-center gap-3">
          {/* Socket Live Sync Indicator */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-semibold"
            title={isConnected ? 'Real-Time WebSocket Engine Connected' : 'Connecting to Server...'}
          >
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
            <span className="hidden sm:inline text-slate-700 dark:text-slate-300">{isConnected ? 'Live Sync' : 'Reconnecting'}</span>
          </div>

          {/* i18n Language Toggle */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="appearance-none bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none cursor-pointer hover:border-blue-500 transition-colors"
          >
            <option value="en">🌐 EN</option>
            <option value="es">🌐 ES</option>
            <option value="hi">🌐 HI</option>
          </select>

          {/* Theme Switcher Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800"
            title="Toggle Dark/Light Mode"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </motion.button>

          {/* Role Quick Switcher Modal */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 text-white text-xs font-extrabold shadow-lg shadow-blue-500/25 transition-all"
            >
              <UserCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Role: {user ? user.role : 'Switch Role'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${roleMenuOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
              {roleMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-60 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 overflow-hidden"
                >
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Quick Switch Roles
                    </p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{user?.name || 'Guest User'}</p>
                  </div>
                  <div className="py-1 space-y-1">
                    {roles.map((r) => {
                      const Icon = r.icon;
                      const isCurrent = user?.role === r.role;
                      return (
                        <button
                          key={r.role}
                          onClick={() => handleRoleSwitch(r)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                            isCurrent
                              ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <Icon className="w-4 h-4 text-blue-500" />
                          <span>{r.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  {user && (
                    <button
                      onClick={() => { logout(); setRoleMenuOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 mt-1 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors border-t border-slate-100 dark:border-slate-800"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

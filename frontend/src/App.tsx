import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { Navbar } from './components/Navbar';
import { VoicePlayer } from './components/VoicePlayer';
import { BookingModal } from './components/BookingModal';
import { LandingPage } from './pages/LandingPage';
import { PatientDashboard } from './pages/PatientDashboard';
import { ReceptionistDashboard } from './pages/ReceptionistDashboard';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Appointment } from './types';

const MainLayout: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('LANDING');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const handleBookingSuccess = (app: Appointment) => {
    setCurrentView('PATIENT');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar currentView={currentView} onNavigate={setCurrentView} />

      <main className="flex-grow">
        {currentView === 'LANDING' && (
          <LandingPage
            onNavigate={setCurrentView}
            onOpenBooking={() => setBookingModalOpen(true)}
          />
        )}
        {currentView === 'PATIENT' && (
          <PatientDashboard onOpenBooking={() => setBookingModalOpen(true)} />
        )}
        {currentView === 'RECEPTION' && (
          <ReceptionistDashboard onOpenBooking={() => setBookingModalOpen(true)} />
        )}
        {currentView === 'DOCTOR' && <DoctorDashboard />}
        {currentView === 'ADMIN' && <AdminDashboard />}
      </main>

      {/* Voice Web Speech Announcer Widget */}
      <VoicePlayer />

      {/* Appointment Intake Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        onSuccess={handleBookingSuccess}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <SocketProvider>
            <MainLayout />
          </SocketProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;

import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'es' | 'hi';

const translations: Record<Language, Record<string, string>> = {
  en: {
    heroTitle: 'Smarter Healthcare. Shorter Waiting Times.',
    heroSubtitle: 'AI-driven hospital triage, automated room allocation, and real-time live queue tracking.',
    bookAppointment: 'Book Appointment',
    learnMore: 'Learn More',
    liveQueue: 'Live Queue Tracking',
    emergency: 'Emergency',
    urgent: 'Urgent Care',
    priority: 'Priority Clinic',
    general: 'General OPD',
    patientsServed: 'Patients Served Today',
    avgWaitTime: 'Avg Waiting Time',
    doctorsAvailable: 'Active Doctors',
    hospitalsConnected: 'Partner Hospitals',
    callNext: 'Call Next Patient',
    emergencyOverride: 'Emergency Override'
  },
  es: {
    heroTitle: 'Salud Más Inteligente. Menores Tiempos de Espera.',
    heroSubtitle: 'Triaje hospitalario impulsado por IA, asignación automática de salas y seguimiento de filas en tiempo real.',
    bookAppointment: 'Reservar Cita',
    learnMore: 'Saber Más',
    liveQueue: 'Seguimiento de Cola en Vivo',
    emergency: 'Emergencia',
    urgent: 'Atención Urgente',
    priority: 'Clínica Prioritaria',
    general: 'Consulta General',
    patientsServed: 'Pacientes Atendidos Hoy',
    avgWaitTime: 'Tiempo Medio de Espera',
    doctorsAvailable: 'Médicos Activos',
    hospitalsConnected: 'Hospitales Conectados',
    callNext: 'Llamar Siguiente Paciente',
    emergencyOverride: 'Anulación de Emergencia'
  },
  hi: {
    heroTitle: 'स्मार्ट स्वास्थ्य सेवा। कम प्रतीक्षा समय।',
    heroSubtitle: 'एआई-संचालित अस्पताल ट्राइएज, स्वचालित कक्ष आवंटन और लाइव कतार ट्रैकिंग।',
    bookAppointment: 'अपॉइंटमेंट बुक करें',
    learnMore: 'अधिक जानें',
    liveQueue: 'लाइव कतार ट्रैकिंग',
    emergency: 'आपातकालीन (Emergency)',
    urgent: 'गंभीर (Urgent Care)',
    priority: 'प्राथमिकता (Priority)',
    general: 'सामान्य (General OPD)',
    patientsServed: 'आज उपचारित रोगी',
    avgWaitTime: 'औसत प्रतीक्षा समय',
    doctorsAvailable: 'सक्रिय डॉक्टर',
    hospitalsConnected: 'संबंधित अस्पताल',
    callNext: 'अगले रोगी को बुलाएं',
    emergencyOverride: 'आपातकालीन ओवरराइड'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

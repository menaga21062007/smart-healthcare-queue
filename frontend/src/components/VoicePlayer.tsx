import React, { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { Volume2, VolumeX } from 'lucide-react';

export const VoicePlayer: React.FC = () => {
  const { lastCalledTicket } = useSocket();
  const [muted, setMuted] = useState<boolean>(false);
  const [lastAnnounced, setLastAnnounced] = useState<string>('');

  useEffect(() => {
    if (!lastCalledTicket || muted) return;

    const key = `${lastCalledTicket.ticketNumber}-${lastCalledTicket.roomNumber}`;
    if (key === lastAnnounced) return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // stop current speech
      const text = `Attention please. Ticket ${lastCalledTicket.ticketNumber}, please proceed to Room ${lastCalledTicket.roomNumber}.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
      setLastAnnounced(key);
    }
  }, [lastCalledTicket, muted, lastAnnounced]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setMuted(!muted)}
        className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold shadow-lg transition-all ${
          muted
            ? 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
            : 'bg-blue-600 text-white shadow-blue-500/20 hover:bg-blue-700'
        }`}
        title={muted ? 'Voice announcements muted' : 'Voice announcements active'}
      >
        {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-bounce" />}
        <span>{muted ? 'Voice Muted' : 'Voice Active'}</span>
      </button>
    </div>
  );
};

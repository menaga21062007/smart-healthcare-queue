import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface TicketCallData {
  ticketNumber: string;
  roomNumber: string;
  doctorName: string;
  patientId: string;
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  lastCalledTicket: TicketCallData | null;
  emergencyAlert: any | null;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  lastCalledTicket: null,
  emergencyAlert: null
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastCalledTicket, setLastCalledTicket] = useState<TicketCallData | null>(null);
  const [emergencyAlert, setEmergencyAlert] = useState<any | null>(null);

  useEffect(() => {
    const s = io(window.location.origin, {
      reconnectionAttempts: 10,
      reconnectionDelay: 2000
    });

    s.on('connect', () => {
      console.log('⚡ Socket connected:', s.id);
      setIsConnected(true);
    });

    s.on('disconnect', () => {
      console.log('⚡ Socket disconnected');
      setIsConnected(false);
    });

    s.on('ticket_called', (data: TicketCallData) => {
      console.log('🔊 Ticket called:', data);
      setLastCalledTicket(data);
    });

    s.on('emergency_alert', (data: any) => {
      console.log('🚨 Emergency alert:', data);
      setEmergencyAlert(data);
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected, lastCalledTicket, emergencyAlert }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

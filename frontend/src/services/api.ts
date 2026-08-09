import { User, Appointment, RoomItem, AnalyticsSummary } from '../types';

const API_BASE = '/api';

export class ApiService {
  private static getHeaders(token?: string) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    const t = token || localStorage.getItem('care_queue_token');
    if (t) headers['Authorization'] = `Bearer ${t}`;
    return headers;
  }

  static async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Login failed');
    }
    return res.json();
  }

  static async getMe(): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  }

  static async bookAppointment(data: {
    symptoms: string;
    patientAge?: number;
    isPriority?: boolean;
    patientName?: string;
    patientPhone?: string;
  }): Promise<Appointment> {
    const res = await fetch(`${API_BASE}/queue/book`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to book appointment');
    }
    return res.json();
  }

  static async getLiveQueue(): Promise<Appointment[]> {
    const res = await fetch(`${API_BASE}/queue/live`);
    if (!res.ok) throw new Error('Failed to fetch live queue');
    return res.json();
  }

  static async getMyTicket(): Promise<Appointment | null> {
    const res = await fetch(`${API_BASE}/queue/my-ticket`, {
      headers: this.getHeaders()
    });
    if (!res.ok) return null;
    return res.json();
  }

  static async callNextTicket(doctorId?: string, roomNumber?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/queue/call-next`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ doctorId, roomNumber })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to call ticket');
    }
    return res.json();
  }

  static async updateAppointmentStatus(id: string, status: string): Promise<Appointment> {
    const res = await fetch(`${API_BASE}/queue/${id}/status`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update status');
    return res.json();
  }

  static async emergencyOverride(patientName: string, symptoms?: string): Promise<Appointment> {
    const res = await fetch(`${API_BASE}/queue/emergency-override`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ patientName, symptoms })
    });
    if (!res.ok) throw new Error('Emergency override failed');
    return res.json();
  }

  static async getRooms(): Promise<RoomItem[]> {
    const res = await fetch(`${API_BASE}/rooms`);
    if (!res.ok) throw new Error('Failed to fetch rooms');
    return res.json();
  }

  static async toggleRoom(id: string): Promise<RoomItem> {
    const res = await fetch(`${API_BASE}/rooms/${id}/toggle`, {
      method: 'PATCH',
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error('Failed to toggle room');
    return res.json();
  }

  static async getAnalyticsSummary(): Promise<AnalyticsSummary> {
    const res = await fetch(`${API_BASE}/analytics/summary`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  }
}

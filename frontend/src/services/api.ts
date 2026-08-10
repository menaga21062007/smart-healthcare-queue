import { User, Appointment, RoomItem, AnalyticsSummary } from '../types';

const API_BASE = (((import.meta as any).env?.VITE_API_URL as string) || '/api').replace(/\/$/, '');

export class ApiService {
  private static getHeaders(token?: string) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    const t = token || localStorage.getItem('care_queue_token');
    if (t) headers['Authorization'] = `Bearer ${t}`;
    return headers;
  }

  private static async handleResponse<T>(res: Response): Promise<T> {
    const text = await res.text();
    let data: any = null;
    if (text && text.trim().length > 0) {
      try {
        data = JSON.parse(text);
      } catch (err) {
        data = { message: text };
      }
    }

    if (!res.ok) {
      const errorMsg = data?.message || `HTTP ${res.status}: ${res.statusText || 'API Request Failed'}`;
      throw new Error(errorMsg);
    }

    return data as T;
  }

  static async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return this.handleResponse<{ token: string; user: User }>(res);
  }

  static async getMe(): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: this.getHeaders()
    });
    return this.handleResponse<User>(res);
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
    return this.handleResponse<Appointment>(res);
  }

  static async getLiveQueue(): Promise<Appointment[]> {
    const res = await fetch(`${API_BASE}/queue/live`);
    return this.handleResponse<Appointment[]>(res);
  }

  static async getMyTicket(): Promise<Appointment | null> {
    try {
      const res = await fetch(`${API_BASE}/queue/my-ticket`, {
        headers: this.getHeaders()
      });
      if (!res.ok) return null;
      return await this.handleResponse<Appointment>(res);
    } catch {
      return null;
    }
  }

  static async callNextTicket(doctorId?: string, roomNumber?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/queue/call-next`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ doctorId, roomNumber })
    });
    return this.handleResponse<any>(res);
  }

  static async updateAppointmentStatus(id: string, status: string): Promise<Appointment> {
    const res = await fetch(`${API_BASE}/queue/${id}/status`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ status })
    });
    return this.handleResponse<Appointment>(res);
  }

  static async emergencyOverride(patientName: string, symptoms?: string): Promise<Appointment> {
    const res = await fetch(`${API_BASE}/queue/emergency-override`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ patientName, symptoms })
    });
    return this.handleResponse<Appointment>(res);
  }

  static async getRooms(): Promise<RoomItem[]> {
    const res = await fetch(`${API_BASE}/rooms`);
    return this.handleResponse<RoomItem[]>(res);
  }

  static async toggleRoom(id: string): Promise<RoomItem> {
    const res = await fetch(`${API_BASE}/rooms/${id}/toggle`, {
      method: 'PATCH',
      headers: this.getHeaders()
    });
    return this.handleResponse<RoomItem>(res);
  }

  static async getAnalyticsSummary(): Promise<AnalyticsSummary> {
    const res = await fetch(`${API_BASE}/analytics/summary`);
    return this.handleResponse<AnalyticsSummary>(res);
  }
}

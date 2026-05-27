export type SecurityStatus = 'armed' | 'disarmed' | 'alert' | 'warning';

export interface Device {
  id: string;
  name: string;
  type: 'camera' | 'lock' | 'sensor' | 'light' | 'thermostat' | 'plug' | 'speaker' | 'vacuum' | 'fridge';
  status: 'active' | 'inactive' | 'locked' | 'unlocked' | 'open' | 'closed' | 'online' | 'offline';
  value?: string | number;
  battery?: number;
  location: string;
  diagnostics?: {
    signalStrength: number;
    uptime: string;
    firmware: string;
    ipAddress: string;
  };
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  type: string;
  message: string;
  location: string;
  severity: 'info' | 'warning' | 'critical';
  thumbnail?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  role: 'admin' | 'family' | 'guest';
  avatar: string;
}
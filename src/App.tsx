/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { SecurityStatusRing } from "./components/SecurityStatusRing";
import { DeviceGrid } from "./components/DeviceGrid";
import { Timeline } from "./components/Timeline";
import { CameraSection } from "./components/CameraSection";
import { InteractiveFloorPlan } from "./components/InteractiveFloorPlan";
import { AIInsights } from "./components/AIInsights";
import { EmergencyPanel } from "./components/EmergencyPanel";
import { NetworkScanner } from "./components/NetworkScanner";
import { SecurityStatus, Device, SecurityEvent, UserProfile } from "./types";
import { motion } from "motion/react";

export default function App() {
  const [status, setStatus] = useState<SecurityStatus>('armed');
  const [isOffline, setIsOffline] = useState(false);
  
  // Mock Data
  const [user] = useState<UserProfile>({
    id: 'u1',
    name: 'Hamede WLS',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hamede'
  });

  const [devices, setDevices] = useState<Device[]>([
    { id: '1', name: 'Front Door', type: 'lock', status: 'locked', location: 'Entrance', battery: 92, diagnostics: { signalStrength: 82, uptime: '12d 4h', firmware: 'v2.1.0', ipAddress: '192.168.1.50' } },
    { id: '2', name: 'Living Room Lights', type: 'light', status: 'inactive', location: 'Living Room', diagnostics: { signalStrength: 95, uptime: '45d 1h', firmware: 'v1.0.3', ipAddress: '192.168.1.55' } },
    { id: '3', name: 'Patio Sensor', type: 'sensor', status: 'active', location: 'Outdoors', battery: 88, diagnostics: { signalStrength: 64, uptime: '5d 12h', firmware: 'v3.2.1', ipAddress: '192.168.1.60' } },
    { id: '4', name: 'Smart Thermostat', type: 'thermostat', status: 'active', location: 'Hallway', value: 72, diagnostics: { signalStrength: 88, uptime: '200d 4h', firmware: 'v2.4.5', ipAddress: '192.168.1.65' } },
    { id: '5', name: 'Garage Door', type: 'lock', status: 'unlocked', location: 'Garage', battery: 45, diagnostics: { signalStrength: 42, uptime: '2d 6h', firmware: 'v1.1.2', ipAddress: '192.168.1.70' } },
    { id: '6', name: 'Kitchen Smoke', type: 'sensor', status: 'active', location: 'Kitchen', battery: 100, diagnostics: { signalStrength: 99, uptime: '365d 10h', firmware: 'v4.0.0', ipAddress: '192.168.1.75' } },
    { id: '7', name: 'Office Lamp', type: 'light', status: 'active', location: 'Office', diagnostics: { signalStrength: 91, uptime: '12d 0h', firmware: 'v1.0.3', ipAddress: '192.168.1.80' } },
    { id: '8', name: 'Master Lock', type: 'lock', status: 'locked', location: 'Bedroom', battery: 95, diagnostics: { signalStrength: 85, uptime: '30d 2h', firmware: 'v2.1.0', ipAddress: '192.168.1.85' } },
  ]);

  const [events] = useState<SecurityEvent[]>([
    { id: 'e1', timestamp: '12:45 PM', type: 'Motion', message: 'Motion detected in Entryway', location: 'Entrance', severity: 'info' },
    { id: 'e2', timestamp: '11:20 AM', type: 'Security', message: 'System Armed (Stay Mode)', location: 'Hub', severity: 'info' },
    { id: 'e3', timestamp: '09:15 AM', type: 'Access', message: 'Front door unlocked (User: Family)', location: 'Entrance', severity: 'info' },
    { id: 'e4', timestamp: '08:30 AM', type: 'Camera', message: 'Package delivered at door', location: 'Porch', severity: 'warning', thumbnail: '/src/assets/images/camera_feed_exterior_front_1779780809190.png' },
    { id: 'e5', timestamp: 'Yesterday', type: 'Alert', message: 'Unrecognized person near perimeter', location: 'Backyard', severity: 'critical', thumbnail: '/src/assets/images/camera_feed_living_room_1779780823167.png' },
  ]);

  const handleAddDevices = (newDevices: Device[]) => {
    setDevices(prev => [...prev, ...newDevices]);
  };

  const cameras = [
    { 
      id: 'cam1', 
      name: 'Front Entrance', 
      url: '/src/assets/images/camera_feed_exterior_front_1779780809190.png',
      objects: [
        { type: 'package' as const, x: 55, y: 70, label: 'Package detected (85%)' }
      ]
    },
    { 
      id: 'cam2', 
      name: 'Living Space', 
      url: '/src/assets/images/camera_feed_living_room_1779780823167.png',
      objects: [
        { type: 'person' as const, x: 40, y: 50, label: 'Resident Identified (98%)' }
      ]
    }
  ];

  const handleToggleDevice = (id: string) => {
    setDevices(prev => prev.map(d => {
      if (d.id === id) {
        let newStatus = d.status;
        if (d.type === 'lock') newStatus = d.status === 'locked' ? 'unlocked' : 'locked';
        else if (d.type === 'light' || d.type === 'sensor' || d.type === 'thermostat') {
           newStatus = d.status === 'active' ? 'inactive' : 'active';
        }
        return { ...d, status: newStatus };
      }
      return d;
    }));
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans selection:bg-cyan-500/30">
      {/* Visual background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-[1600px] mx-auto px-6 md:px-12 pb-12">
        <Header user={user} isOffline={isOffline} />
        
        <main className="grid grid-cols-12 gap-8">
          {/* Left Column: Core Controls & Activity */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            
            {/* Top Row: Hero Stats & Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white/5 border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
               <div className="flex flex-col items-center justify-center">
                  <SecurityStatusRing status={status} />
                  <div className="mt-8 flex gap-3">
                    <button 
                      onClick={() => setStatus('armed')}
                      className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${status === 'armed' ? 'bg-white text-black' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                    >
                      Arm Away
                    </button>
                    <button 
                      onClick={() => setStatus('disarmed')}
                      className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${status === 'disarmed' ? 'bg-white text-black' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                    >
                      Disarm
                    </button>
                  </div>
               </div>
               <div className="space-y-6">
                 <div>
                    <h2 className="text-3xl font-light tracking-tight mb-2">Welcome Home, <span className="text-white/40">Hamede.</span></h2>
                    <p className="text-white/30 text-sm leading-relaxed">
                      All systems are optimal. AI Guardian has analyzed 4 security events today and suggests 1 routine optimization.
                    </p>
                 </div>
                 <AIInsights />
               </div>
            </div>

            {/* Device Grid */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h3 className="text-white font-medium uppercase tracking-widest text-xs flex items-center gap-2">
                  <motion.span 
                    animate={{ opacity: [0.4, 1, 0.4] }} 
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-1.5 h-1.5 rounded-full bg-emerald-400" 
                  />
                  Live Device Control
                </h3>
                <span className="text-[10px] text-white/20">{devices.length} Devices Connected</span>
              </div>
              <DeviceGrid devices={devices} onToggle={handleToggleDevice} />
            </section>

            {/* Camera Feeds */}
            <CameraSection cameras={cameras} />
          </div>

          {/* Right Column: Floor Plan, Timeline & Emergency */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <InteractiveFloorPlan 
              devices={devices} 
              floorPlanUrl="/src/assets/images/home_floor_plan_isometric_1779780792090.png" 
            />

            <NetworkScanner onAddDevices={handleAddDevices} existingDeviceCount={devices.length} />
            
            <div className="grid grid-cols-1 gap-8">
              <Timeline events={events} />
              <EmergencyPanel />
            </div>
          </div>
        </main>

        <footer className="mt-16 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-30">
          <div className="flex items-center gap-4">
             <span className="text-[10px] uppercase tracking-widest font-bold">Guardian Security OS</span>
             <span className="w-1 h-1 rounded-full bg-white/40" />
             <span className="text-[10px] uppercase tracking-widest">Powered by Antigravity AI</span>
          </div>
          <div className="flex gap-8">
            <span className="text-[8px] uppercase tracking-[0.3em]">Privacy Encryption: AES-256</span>
            <span className="text-[8px] uppercase tracking-[0.3em]">End-to-End Tunnel Active</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { TelemetryPayload } from '../types';

// Hardcoded for Phase 3, this would normally be in .env.local
const SOCKET_URL = 'http://localhost:4000';

export function useSocket(deviceId: string) {
  const [telemetry, setTelemetry] = useState<TelemetryPayload | null>(null);
  const [status, setStatus] = useState<'connected' | 'reconnecting' | 'disconnected'>('disconnected');
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    setStatus('reconnecting');
    const token = localStorage.getItem('token');
    
    // Initialize socket connection
    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      setStatus('connected');
      // Subscribe to device-specific telemetry
      socket.emit('join_room', `machine:${deviceId}`);
    });

    socket.on('disconnect', () => {
      setStatus('disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setStatus('disconnected');
    });

    socket.on('telemetry:update', (data: TelemetryPayload) => {
      if (data.deviceId === deviceId) {
        setTelemetry(data);
      }
    });

    return () => {
      if (socket) {
        socket.emit('leave_room', `machine:${deviceId}`);
        socket.disconnect();
      }
    };
  }, [deviceId]);

  return { telemetry, status };
}

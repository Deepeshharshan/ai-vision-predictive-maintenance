import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
import { TelemetryPayload } from '../types';
import { env } from '../config/env';

export function useSocket(deviceId: string) {
  const [telemetry, setTelemetry] = useState<TelemetryPayload | null>(null);
  const [status, setStatus] = useState<'connected' | 'reconnecting' | 'disconnected'>('disconnected');
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Read the production JWT from cookies — consistent with the API client
    const token = Cookies.get('kronos_jwt') ?? null;
    
    setStatus('reconnecting');

    // Initialize socket connection with the environment-configured URL
    socketRef.current = io(env.SOCKET_URL, {
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
      // Subscribe to device-specific telemetry room
      socket.emit('join_room', `machine:${deviceId}`);
    });

    socket.on('disconnect', () => {
      setStatus('disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      setStatus('disconnected');
    });

    // Re-authenticate with fresh token on reconnect attempt
    socket.io.on('reconnect_attempt', () => {
      const freshToken = Cookies.get('kronos_jwt') ?? null;
      socket.auth = { token: freshToken };
      setStatus('reconnecting');
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

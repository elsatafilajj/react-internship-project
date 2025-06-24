import { io, Socket } from 'socket.io-client';

import { Config } from '@/constants/config';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (socket) return socket;

  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('No access token found');

  socket = io(Config.socketUrl, {
    transports: ['websocket'],
    auth: {
      Authorization: `Bearer ${token}`,
    },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 3,
  });

  socket.on('connect', () => {
    console.log('[socket] connected');
  });

  socket.on('connect_error', (error) => {
    console.log('[socket] connect error:', error.message);
  });

  socket.on('disconnect', (reason) => {
    console.log('[socket] disconnected:', reason);
  });

  return socket;
};

export const updateSocketAuth = (newToken: string) => {
  if (socket) {
    socket.auth = { Authorization: `Bearer ${newToken}` };
    socket.connect();
  }
};

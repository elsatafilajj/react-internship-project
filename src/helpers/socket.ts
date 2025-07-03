import { io, Socket } from 'socket.io-client';

import { refreshTokenApi } from '@/api/User/user.client';
import { Config } from '@/constants/config';
import { socketEvents } from '@/constants/socketEvents';

let socket: Socket | null = null;
let isReady = false;

export const getSocket = (): Socket => {
  if (socket) return socket;

  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('No access token found');

  socket = io(Config.socketUrl, {
    transports: ['websocket'],
    autoConnect: false,
    auth: { Authorization: `Bearer ${token}` },
    reconnection: true,
    reconnectionAttempts: 3,
    reconnectionDelayMax: 2000,
    reconnectionDelay: 0,
  });

  setupListeners();
  socket.connect();

  return socket;
};

const setupListeners = () => {
  if (!socket) return;

  socket.on('connect', () => {
    isReady = true;
    const roomId = localStorage.getItem('lastRoomId');
    if (roomId) {
      socket?.emit(socketEvents.JoinRoom, { roomId });
    }
  });

  socket.on(socketEvents.CreatedNote, () => {});
  socket.on(socketEvents.UpdateNote, () => {});

  socket.on('connect_error', async (err) => {
    if (err.message.includes('jwt expired')) {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) return;

        const res = await refreshTokenApi({ refreshToken });
        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        updateSocketAuth(res.data.accessToken);
      } catch {
        console.error('[Socket] Token refresh failed');
      }
    }
  });

  socket.on('disconnect', () => {
    isReady = false;
  });
};

export const updateSocketAuth = (newToken: string) => {
  if (!socket) return;

  socket.auth = { Authorization: `Bearer ${newToken}` };

  socket.once('connect', () => {
    isReady = true;
    const roomId = localStorage.getItem('lastRoomId');
    if (roomId) {
      socket?.emit(socketEvents.JoinRoom, { roomId });
    }
  });

  socket.disconnect();
  socket.connect();
};

export const isSocketReady = () => isReady;

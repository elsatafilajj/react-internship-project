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

  return socket;
};

export const updateSocketAuth = (newToken: string, roomId?: string) => {
  if (!socket) return;

  socket.removeAllListeners();
  socket.disconnect();

  socket.auth = { Authorization: `Bearer ${newToken}` };
  socket.connect();

  socket.on('connect', () => {
    console.log('socket reconnected ');

    const finalRoomId = roomId || localStorage.getItem('lastRoomId');
    if (finalRoomId) {
      socket?.emit('rooms/join', { roomId: finalRoomId });
    } else {
      console.warn('socket Room ID is missing during reconnect');
    }
    console.log(
      'roomId from localStorage:',
      localStorage.getItem('lastRoomId'),
    );

    socket?.on('noteCreated', (note) => {
      console.log('socket new note received:', note);
    });
  });

  socket.on('connect_error', (err) => {
    console.log('socket error', err.message);
  });
};

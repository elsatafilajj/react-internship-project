import { io, Socket } from 'socket.io-client';

import { Config } from '@/constants/config';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (socket) return socket;

  const token = localStorage.getItem('accessToken');

  if (!token) {
    throw new Error('No access token has found');
  }

  socket = io(`${Config.socketUrl}`, {
    transports: ['websocket'],
    auth: {
      Authorization: `Bearer ${token}`,
    },
  });

  socket.on('connect', () => {
    console.log('socket connected');
  });

  socket.on('connect_error', (error) => {
    console.log('connection error', error.message);
  });

  socket.on('disconnect', (reason) => {
    console.log('disconnected', reason);
  });

  return socket;
};

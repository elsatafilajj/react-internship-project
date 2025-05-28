import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    const token = localStorage.getItem('accessToken');
    socket = io(import.meta.env.VITE_SOCKET_URL, {
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
  }

  return socket;
};

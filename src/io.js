import io from 'socket.io-client';

export const socket = typeof window === 'undefined' ? null : io();

if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined')
	window.io = io;



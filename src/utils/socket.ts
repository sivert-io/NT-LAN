import { io } from 'socket.io-client';

export const serverPort = 3004;

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? `ws-seating.g4me.norsk-tipping.no` : `localhost:${serverPort}`;

export const socket = io(URL);
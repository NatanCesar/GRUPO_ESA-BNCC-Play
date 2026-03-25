import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

let socket = null;

export function getSocket() {
    if (!socket) {
        socket = io(SOCKET_URL, { autoConnect: false });
    }
    return socket;
}

export function connectToSession(code, playerId, role) {
    const s = getSocket();
    if (!s.connected) s.connect();
    s.emit('session:join', { code, playerId, role });
    return s;
}

export function disconnectSocket() {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}

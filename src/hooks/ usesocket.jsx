import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const useSocket = () => {
  const socketRef = useRef(null);
  useEffect(() => {
    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';
    socketRef.current = io(SOCKET_URL);
    socketRef.current.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return socketRef.current;
};

export default useSocket;

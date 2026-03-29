import { useEffect } from 'react';
import { socket, connectSocket, disconnectSocket } from '../utils/socket';

export const useSocket = () => {
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    let user = null;
    try { user = JSON.parse(userStr); } catch (e) {}

    if (user && (user.id || user._id)) {
      connectSocket();
      socket.emit('join-student-room', user.id || user._id);
    } else {
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, []);

  return socket;
};

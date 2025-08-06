// contexts/notification-context.tsx
import { createContext, useContext, useEffect, useState } from 'react';

import { fetcherWithCredentials } from '@/constants/swr';

import { useAuth } from '../auth';
import { useSocket } from '../socket';

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const socket = useSocket();

  useEffect(() => {
    if (!user?.id || !socket) return;

    const fetchNotifications = async () => {
      try {
        const data = await fetcherWithCredentials(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${user.id}/notifications`
        );
        setNotifications(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch notifications', error);
        setNotifications([]);
      }
    };

    fetchNotifications();

    socket.emit('subscribe', user.id);

    socket.on('notification', (newNotification: Notification) => {
      if (newNotification && typeof newNotification === 'object') {
        setNotifications((prev) => [newNotification, ...prev]);
      }
    });

    return () => {
      socket.off('notification');
    };
  }, [user?.id, socket]);

  const markAsRead = async (id: string) => {
    try {
      await fetcherWithCredentials(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${user?.id}/notifications/${id}/read`,
        {
          method: 'PATCH',
        }
      );
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider'
    );
  }
  return context;
};

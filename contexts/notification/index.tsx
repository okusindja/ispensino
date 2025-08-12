import { createContext, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import useSWR from 'swr';

import { fetcherWithCredentials } from '@/constants/fetchers';

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
  const socket = useSocket();

  const { data: notifications = [], mutate } = useSWR<Notification[]>(
    user?.id
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${user.id}/notifications`
      : null,
    fetcherWithCredentials,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
    }
  );

  useEffect(() => {
    if (!user?.id || !socket) return;

    const handleNewNotification = (newNotification: Notification) => {
      mutate(
        (prev) => {
          if (!prev) return [newNotification];
          if (prev.some((n) => n.id === newNotification.id)) return prev;
          return [newNotification, ...prev];
        },
        { revalidate: false }
      );

      toast.custom(
        (t) => (
          <div
            role="button"
            tabIndex={0}
            onClick={() => toast.dismiss(t.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                toast.dismiss(t.id);
              }
            }}
            className="focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <div className="p-3 rounded-lg bg-white shadow-lg border border-gray-200">
              <p className="font-medium">{newNotification.message}</p>
              <p className="text-sm text-gray-500">
                {new Date(newNotification.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ),
        {
          duration: 5000,
        }
      );
    };

    socket.emit('subscribe', user.id);
    socket.on('notification', handleNewNotification);

    return () => {
      socket.off('notification', handleNewNotification);
      socket.emit('unsubscribe', user.id);
    };
  }, [user?.id, socket, mutate]);

  const markAsRead = async (id: string) => {
    try {
      await fetcherWithCredentials(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${user?.id}/notifications/${id}/read`,
        { method: 'PATCH' }
      );

      mutate(
        (prev) => prev?.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
        false
      );
    } catch (error) {
      console.error('Failed to mark notification as read', error);
      mutate();
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

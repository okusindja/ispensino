// components/NotificationBell.tsx
import { Div } from '@stylin.js/elements';
import { useState } from 'react';

import { useNotifications } from '@/contexts';
import { Box, Button } from '@/elements';
import { Typography } from '@/elements/typography';

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box position="relative">
      <Button
        variant="neutral"
        size="medium"
        onClick={() => setIsOpen(!isOpen)}
        isIcon
        aria-label="Notifications"
        position="relative"
      >
        <BellIcon />
        <Div
          display="flex"
          alignItems="center"
          top="-12px"
          right="-12px"
          position="absolute"
          zIndex="2"
        >
          <Typography variant="fancy" size="small" color="text" ml="S">
            {unreadCount > 0 ? `${unreadCount} new` : 'No new notifications'}
          </Typography>
        </Div>
      </Button>

      {isOpen && (
        <Box
          position="absolute"
          right="0"
          top="100%"
          width="320px"
          maxHeight="400px"
          overflow="auto"
          bg="surface"
          border="1px solid"
          borderColor="outline"
          borderRadius="M"
          boxShadow="lg"
          p="M"
          zIndex="dropdown"
        >
          <Typography variant="title" size="medium" mb="M">
            Notifications
          </Typography>

          {notifications.length === 0 ? (
            <Typography variant="body" size="medium">
              No notifications
            </Typography>
          ) : (
            notifications.map((notification) => (
              <Box
                key={notification.id}
                p="S"
                mb="S"
                bg={notification.isRead ? 'surface' : 'red'}
                borderRadius="S"
                onClick={() =>
                  !notification.isRead && markAsRead(notification.id)
                }
                style={{ cursor: 'pointer' }}
              >
                <Typography
                  variant="body"
                  size="medium"
                  fontWeight={notification.isRead ? 'normal' : 'bold'}
                >
                  {notification.message}
                </Typography>
                <Typography variant="body" size="medium" color="text_secondary">
                  {new Date(notification.createdAt).toLocaleTimeString()}
                </Typography>
              </Box>
            ))
          )}
        </Box>
      )}
    </Box>
  );
};

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
  </svg>
);

export default NotificationBell;

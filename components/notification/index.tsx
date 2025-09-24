// components/NotificationBell.tsx
import { Div } from '@stylin.js/elements';
import { useState } from 'react';

import { useNotifications } from '@/contexts';
import { Box, Button } from '@/elements';
import { Typography } from '@/elements/typography';
import { formatRelativeDate } from '@/utils';
import { BellSVG } from '../svg';

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
        <BellSVG maxHeight="1.5rem" maxWidth="1.5rem" width="100%" />
        <Div
          display="flex"
          alignItems="center"
          justifyContent="center"
          top="-3px"
          right="0"
          backgroundColor="primary"
          position="absolute"
          width="1rem"
          height="1rem"
          borderRadius="full"
          zIndex="2"
        >
          <Typography variant="fancy" size="small" color="darkText">
            {unreadCount > 0 ? `${unreadCount}` : '0'}
          </Typography>
        </Div>
      </Button>

      {isOpen && (
        <Box
          p="L"
          right="0"
          top="100%"
          color="text"
          bg="surface"
          width="320px"
          boxShadow="lg"
          overflow="auto"
          borderRadius="M"
          zIndex="dropdown"
          maxHeight="400px"
          position="absolute"
          border="1px solid"
          borderColor="outline"
        >
          <Typography variant="title" size="small" mb="M">
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
                p="M"
                mb="S"
                gap="M"
                display="grid"
                color={notification.isRead ? 'text' : 'darkText'}
                bg={notification.isRead ? 'outline' : 'primary'}
                border="1px solid"
                borderColor={notification.isRead ? 'outline' : 'primary'}
                borderRadius="S"
                onClick={() =>
                  !notification.isRead && markAsRead(notification.id)
                }
                style={{ cursor: 'pointer' }}
              >
                <Typography variant="body" size="medium">
                  {notification.message}
                </Typography>
                <Typography
                  variant="body"
                  size="extraSmall"
                  color="text_secondary"
                >
                  {formatRelativeDate(notification.createdAt)}
                </Typography>
              </Box>
            ))
          )}
        </Box>
      )}
    </Box>
  );
};

export default NotificationBell;

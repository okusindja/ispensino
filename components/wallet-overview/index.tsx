// components/WalletOverview.tsx
import { useEffect } from 'react';

import { useAuth, useWalletStore } from '@/contexts';
import { Box, Button } from '@/elements';
import { Typography } from '@/elements/typography';

import { SpinnerSVG } from '../svg';

export const WalletOverview = () => {
  const { user } = useAuth();
  const {
    balance,
    transactions,
    isLoading,
    error,
    fetchBalance,
    addFunds,
    clearError,
  } = useWalletStore();

  useEffect(() => {
    if (user?.id) fetchBalance(user.id);
  }, [user?.id]);

  const handleAddFunds = async () => {
    try {
      await addFunds(user?.id || '', 50);
    } catch (error) {
      console.error('Failed to add funds:', error);
    }
  };

  return (
    <Box p="M" border="1px solid" borderColor="outline" borderRadius="M">
      <Typography variant="title" size="medium" mb="M">
        Wallet Balance
      </Typography>

      <Typography variant="headline" size="medium" mb="L">
        ${balance.toFixed(2)}
      </Typography>

      {error && (
        <Box mb="M" p="S" bg="errorBackground" borderRadius="S">
          <Typography variant="body" size="small" color="error">
            {error}
          </Typography>
          <Button variant="neutral" size="small" onClick={clearError}>
            Dismiss
          </Button>
        </Box>
      )}

      <Button
        variant="primary"
        size="small"
        onClick={handleAddFunds}
        disabled={isLoading}
      >
        {isLoading ? (
          <SpinnerSVG maxWidth="2rem" maxHeight="2rem" width="100%" />
        ) : (
          'Add $50'
        )}
      </Button>

      {transactions.length > 0 && (
        <Box mt="L">
          <Typography variant="body" size="medium" mb="M">
            Recent Transactions
          </Typography>
          {transactions.map((tx) => (
            <Box
              key={tx.id}
              mb="S"
              p="S"
              bg="surface_dark"
              borderRadius="S"
              display="flex"
              justifyContent="space-between"
            >
              <Box>
                <Typography variant="body" size="medium">
                  {tx.amount > 0 ? 'Deposit' : 'Payment'}: $
                  {Math.abs(tx.amount).toFixed(2)}
                </Typography>
                <Typography variant="body" size="medium" color="text_secondary">
                  {new Date(tx.createdAt).toLocaleString()}
                </Typography>
              </Box>
              <Typography
                variant="body"
                size="medium"
                color={tx.status === 'COMPLETED' ? 'success' : 'text_secondary'}
              >
                {tx.status}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

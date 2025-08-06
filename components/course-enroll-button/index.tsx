// components/CourseEnrollButton.tsx
import { useState } from 'react';

import { useAuth, useToast, useWalletStore } from '@/contexts';
import { Button } from '@/elements';

interface CourseEnrollButtonProps {
  course: {
    id: string;
    price: number;
    title: string;
  };
}

export const CourseEnrollButton = ({ course }: CourseEnrollButtonProps) => {
  const { user } = useAuth();
  const { makePayment, balance } = useWalletStore();
  const { addToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleEnroll = async () => {
    if (!user?.id) {
      addToast({
        title: 'Authentication required',
        description: 'Please sign in to enroll in courses',
        type: 'error',
      });
      return;
    }

    setIsProcessing(true);
    try {
      await makePayment(user.id, course.price, course.id);
      addToast({
        title: 'Enrollment successful!',
        description: `You're now enrolled in "${course.title}"`,
        type: 'success',
      });
    } catch (error) {
      addToast({
        title: 'Enrollment failed',
        description:
          error instanceof Error
            ? error.message
            : 'Payment could not be processed',
        type: 'error',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button
      variant="primary"
      onClick={handleEnroll}
      disabled={isProcessing || balance < course.price}
      size="medium"
    >
      {balance < course.price
        ? 'Insufficient funds'
        : `Enroll Now - $${course.price.toFixed(2)}`}
    </Button>
  );
};

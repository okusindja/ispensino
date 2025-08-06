// types/payment.ts
export interface PaymentRequest {
  amount: number;
  courseId?: string;
  resourceId?: string;
  enrollmentId?: string;
}

export interface PaymentResponse {
  success: boolean;
  newBalance: number;
  transaction: {
    id: string;
    amount: number;
    currency: string;
    status: string;
    createdAt: Date;
  };
  enrollmentId?: string;
  resourceId?: string;
}

export interface SubscriptionResponseDto {
  _id: string;
  userId: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  status: string;
  price: number;
  orderId?: string;
  paymentId?: string;
}

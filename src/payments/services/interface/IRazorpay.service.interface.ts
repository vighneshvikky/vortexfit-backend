export const RAZORPAY_SERVICE = 'RAZORPAY_SERVICE';

export interface IRazorpayService {
  createOrder(amount: number): Promise<RazorpayOrder>;
}

export interface RazorpayOrder {
  id: string;
  entity: 'order';
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string | null;
  offer_id: string | null;
  status: 'created' | 'attempted' | 'paid';
  attempts: number;
  created_at: number;
}

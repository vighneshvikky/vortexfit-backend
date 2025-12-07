import { Types } from 'mongoose';

export interface WalletResponse {
  _id: string;
  userId: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

export const IWALLETSERVICE = Symbol('IWALLETSERVICE');

export interface IWalletService {
  handleFailedPayment(
    userId: Types.ObjectId,
    body: {
      orderId: string;
      paymentId: string;
      amount: number;
      reason: string;
    },
  ): Promise<{ success: boolean; wallet: WalletResponse }>;

  payWithWallet(
    userId: Types.ObjectId,
    trainerId: Types.ObjectId,
    amount: number,
    sessionType: string,
    date: string,
    timeSlot: string,
  ): Promise<{
    success: boolean;
    bookingId: Types.ObjectId;
    wallet: WalletResponse;
  }>;

  getBalance(
    userId: Types.ObjectId,
  ): Promise<{ balance: number; wallet: WalletResponse | null }>;
}

import { isMinimalUser } from 'src/common/helpers/isMinimalUser';
import { MinimalUser, Transaction } from '../schema/transaction.schema';
import { Types } from 'mongoose';

export interface TransactionDto {
  _id: string;
  fromUser: { _id: string; name: string; email: string };
  toUser: { _id: string; name: string; email: string };
  amount: number;
  currency: string;
  sourceType: 'BOOKING' | 'SUBSCRIPTION';
  sourceId?: string;
  paymentId?: string;
  orderId?: string;
  paymentSignature?: string;
  bookingMethod?: string;
  createdAt: Date;
 isCancelled: boolean | undefined
}

function mapUser(user: Types.ObjectId | MinimalUser | null | undefined) {
  if (isMinimalUser(user)) {
    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
    };
  }

  if (user) {
    return {
      _id: user.toString(),
      name: '',
      email: '',
    };
  }

  return {
    _id: '',
    name: '',
    email: '',
  };
}

export const mapTransactionToDto = (
  tx: Transaction & { _id: Types.ObjectId },
): TransactionDto => ({
  _id: tx._id.toString(),
  fromUser: mapUser(tx.fromUser),
  toUser: mapUser(tx.toUser),
  amount: tx.amount,
  currency: tx.currency,
  sourceType: tx.sourceType,
  sourceId: tx.sourceId?.toString(),
  paymentId: tx.paymentId,
  orderId: tx.orderId,
  paymentSignature: tx.paymentSignature,
  bookingMethod: tx.bookingMethod,
  createdAt: tx.createdAt,
  isCancelled: tx.isCancelled
});

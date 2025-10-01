import { Types } from 'mongoose';
import { MinimalUser } from 'src/transactions/schema/transaction.schema';


export function isMinimalUser(user: Types.ObjectId | MinimalUser | null | undefined): user is MinimalUser {
  return user !== null && user !== undefined && typeof user === 'object' && '_id' in user;
}

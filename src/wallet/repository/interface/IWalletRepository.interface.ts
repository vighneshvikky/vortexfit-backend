import { Types } from 'mongoose';
import { WalletDocument } from 'src/wallet/schema/wallet.schema';

export const IWALLETREPOSITORY = Symbol('IWALLETREPOSITORY');

export interface IWalletRepository {
  findByUserId(userId: Types.ObjectId): Promise<WalletDocument | null>;
  createWallet(
    userId: Types.ObjectId,
    balance: number,
  ): Promise<WalletDocument>;
  save(wallet: WalletDocument): Promise<WalletDocument>;
}

import { WalletDocument } from "../schema/wallet.schema";

export class WalletMapper {
  static toResponse(wallet: WalletDocument) {
    return {
      _id: wallet._id.toString(),
      userId: wallet.userId.toString(),
      balance: wallet.balance,
    };
  }
}
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Wallet, WalletDocument } from '../schema/wallet.schema';
import { Model, Types } from 'mongoose';
import { IWalletRepository } from './interface/IWalletRepository.interface';

@Injectable()
export class WalletRepository implements IWalletRepository{
  constructor(
    @InjectModel(Wallet.name) private _walletModel: Model<WalletDocument>,
  ) {}

  async findByUserId(userId: Types.ObjectId): Promise<WalletDocument | null> {
    return this._walletModel.findOne({ userId }).exec();
  }

  async createWallet(
    userId: Types.ObjectId,
    balance: number,
  ): Promise<WalletDocument> {
    return this._walletModel.create({ userId, balance });
  }

  async save(wallet: WalletDocument): Promise<WalletDocument> {
    return wallet.save();
  }
}

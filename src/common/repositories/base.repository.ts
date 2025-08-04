import { Model, Document, FilterQuery } from 'mongoose';
import {
  IBaseRepository,
  PaginatedResult,
  PaginationOptions,
} from '../interface/base-repository.interface';

export abstract class BaseRepository<T extends Document>
  implements IBaseRepository<T>
{
  protected constructor(protected readonly model: Model<T>) {}
  find(filter: FilterQuery<T>): Promise<T[]> {
    return this.model.find(filter).exec();
  }
  async create(data: Partial<T>): Promise<T> {
    const created = new this.model(data);
    return created.save();
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async findAll(filter?: Record<string, unknown>): Promise<T[]> {
    return this.model.find(filter || {}).exec();
  }

  async findOne(filter: Record<string, unknown>): Promise<T | null> {
    return this.model.findOne(filter).exec();
  }

  async findByEmail(email: string): Promise<T | null> {
    return this.model.findOne({ email }).exec();
  }

  async deleteById(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }

  async search(query: Record<string, unknown>): Promise<T[]> {
    return this.model.find(query).exec();
  }

  async findPaginated(
    query: Record<string, unknown>,
    options: PaginationOptions,
  ): Promise<PaginatedResult<T>> {
    const skip = (options.page - 1) * options.limit;

    const [data, total] = await Promise.all([
      this.model.find(query).skip(skip).limit(options.limit).exec(),
      this.model.countDocuments(query).exec(),
    ]);

    return {
      data,
      total,
      page: options.page,
      limit: options.limit,
      totalPages: Math.ceil(total / options.limit),
    };
  }

  async updateById(id: string, update: Partial<T>): Promise<T> {
    const updated = await this.model
      .findByIdAndUpdate(id, { $set: update }, { new: true })
      .exec();

    if (!updated) {
      throw new Error('Document not found');
    }

    return updated;
  }

  async updatePassword(userId: string, newPassword: string) {
    await this.model
      .updateOne({ _id: userId }, { $set: { password: newPassword } })
      .exec();
  }
}

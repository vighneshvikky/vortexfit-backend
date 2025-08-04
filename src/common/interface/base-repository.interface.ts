import { FilterQuery } from 'mongoose';

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IBaseRepository<T> {
  create(data: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findAll(filter?: Record<string, unknown>): Promise<T[]>;
  find(filter: FilterQuery<T>): Promise<T[]>;
  findByEmail(email: string): Promise<T | null>;
  deleteById(id: string): Promise<void>;
  findPaginated(
    query: Record<string, unknown>,
    options: PaginationOptions,
  ): Promise<PaginatedResult<T>>;
  updateById(id: string, update: Partial<T>): Promise<T>;
  updatePassword(userId: string, newPassword: string): Promise<void>;
}

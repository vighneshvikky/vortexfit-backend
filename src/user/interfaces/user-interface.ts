export interface FindApprovedTrainerQuery extends Record<string, unknown> {
  role: string;
  verificationStatus: string;
  isBlocked: boolean;
  category?: string;
  name?: unknown;
}

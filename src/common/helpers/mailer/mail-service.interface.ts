export interface IMailService {
  sendOtp(email: string, otp: string): Promise<void>;
  sendResetLink(email: string, resetLink: string): Promise<void>;
  sendMail(email: string, type: 'accept' | 'reject', url: string): Promise<void>;
}

export const MAIL_SERVICE = Symbol('MailService');

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;
  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASS'),
      },
    });
  }

  async sendOtp(to: string, otp: string) {
    await this.transporter.sendMail({
      from: `"VortexFit 💪" <${this.configService.get('MAIL_USER')}>`,
      to,
      subject: 'Your OTP Code',
      html: `<p>Your OTP is <b>${otp}</b>. It will expire in 5 minutes.</p>`,
    });
  }
}
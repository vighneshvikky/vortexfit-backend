import { OtpDocument } from "../schema/otp.schema";

export interface IOtpRepository {
    saveOtp(email: string, otp: string): Promise<void>;
    getOtp(email: string): Promise<string | null>;
    deleteOtp(email: string): Promise<void>;
    findUser(email: string): Promise<OtpDocument | null>;
  }
  
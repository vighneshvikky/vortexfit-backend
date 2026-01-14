import { BaseModel } from 'src/common/model/base-model';

export interface ApiResponse<T> {
  message: string;
  data: T;
}


export interface MfaSetupRequiredResponse {
  mfaSetupRequired: true;
  userId: string;
  message: string;
}

export interface MfaRequiredResponse {
  mfaRequired: true;
  userId: string;
  message: string;
}

export interface SetupMfaResponse {
  qrCode: string;
  manualKey: string;
}

export interface VerifyMfaSetupResponse {
  message: string;

}

export interface VerifyMfaLoginResponse {
  accessToken: string;
  refreshToken: string;
  user: BaseModel;
}

export type VerifyLoginResponse =
  | MfaSetupRequiredResponse
  | MfaRequiredResponse;

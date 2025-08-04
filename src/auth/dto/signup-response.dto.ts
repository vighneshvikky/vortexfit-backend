export interface SignUpResponseDto {
  message: string;
  data: {
    email: string;
    role: string;
  };
}

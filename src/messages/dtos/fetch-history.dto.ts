import { IsString, IsInt, Min } from 'class-validator';

export class FetchHistoryDto {
  @IsString() peerId!: string;
  @IsInt() @Min(0) skip = 0;
  @IsInt() @Min(1) limit = 50;
}

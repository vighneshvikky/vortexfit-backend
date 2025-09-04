
import { BaseModel } from "src/common/model/base-model";
import { BookingStatus } from "../enums/booking.enum";

export class BookingModel extends BaseModel {
  constructor(
    public readonly userId: string,
    public readonly trainerId: string,
    public readonly date: string,
    public readonly timeSlot: string,
    public readonly status: BookingStatus,
    public readonly amount: number,
    public readonly currency: string,
    public readonly paymentId?: string,
    public readonly orderId?: string,
    public readonly sessionType?: string,
    public readonly paymentSignature?: string,
  ) {
    super();
  }
}

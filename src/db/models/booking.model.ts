import mongoose, {Schema} from "mongoose";
import { IBooking } from "../interfaces/booking.interface";
import { BOOKING_STATUS } from "@/const/bookingStatus.const";

export const BookingSchema = new Schema<IBooking>(
    {
        userId : { type : Schema.Types.ObjectId, ref : 'User', required : true },
        serviceId : { type : Schema.Types.ObjectId, ref : 'Service', required : true },
        startDate : { type : Date, required : true },
        endDate : { type : Date, required : true },
        totalPrice : { type : Number, required : true },
        status : { type : String, enum : Object.values(BOOKING_STATUS), required : true },
        lockToken: { type: String }, 
        lockKey: { type: String }
    },
    { timestamps : true }
) 

BookingSchema.index({ userId: 1, createdAt: -1 });
BookingSchema.index({ status: 1 });

export const BookingModel = mongoose.model<IBooking>('Booking', BookingSchema);



import { Document, Types } from "mongoose";
import { BookingStatus } from '@/const/bookingStatus.const'

export interface IBooking extends Document {
    _id? : string;
    userId : Types.ObjectId;
    serviceId : Types.ObjectId;
    startDate : Date;
    endDate : Date;
    totalPrice : number;
    status : BookingStatus;
    createdAt : Date;
    updatedAt : Date;
}
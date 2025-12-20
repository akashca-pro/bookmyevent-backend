import mongoose, {Schema} from "mongoose";
import { IAvailability, IContact, ILocation, IService } from "../interfaces/service.interface";

const LocationSchema = new Schema<ILocation>(
    {
        address : { type : String, required : true },
        district : { type : String, required : true },
        municipality : { type : String, required : true },
        pincode : { type : String, required : true },
    },
    { _id : false }
)

const AvailibilitySchema = new Schema<IAvailability>(
    {
        from : { type : Date, required : true },
        to : { type : Date, required : true },
    },
    { _id : false }
)

const ContactSchema = new Schema<IContact>(
    {
        phone : { type : String, required : true },
        email : { type : String, required : true },
    },
    { _id : false }
)

const ServiceSchema = new Schema<IService>(
    {
        adminId : { type : Schema.Types.ObjectId, ref : 'User', required : true },
        title : { type : String, required : true },
        description : { type : String, required : true },
        category : { type : Schema.Types.ObjectId, ref : 'Category', required : true },
        pricePerDay : { type : Number, required : true },
        thumbnail : { type : String, default : null },
        isActive : { type : Boolean, default : false },
        location : { type : LocationSchema, required : true },
        isArchived : { type : Boolean, default : false },
        availability : { type : AvailibilitySchema, required : true },
        contact : { type : ContactSchema, required : true },
    },
    { timestamps : true}
)

ServiceSchema.index({ category : 1 });
ServiceSchema.index({ title : 'text' });
ServiceSchema.index({ 'location.municipality' : 1});
ServiceSchema.index({ 'availability.from' : 1})
ServiceSchema.index({ 'availability.to' : 1})

export const ServiceModel = mongoose.model<IService>('Service', ServiceSchema);
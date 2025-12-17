import mongoose, {Schema} from "mongoose";
import { ICategory } from "../interfaces/category.interface";

export const CategorySchema = new Schema<ICategory>(
    {
        name : { type : String, required : true },
        slug : { type : String, required : true },
        description : { type : String, required : true },
        isArchived : { type : Boolean, default : false },
        isActive : { type : Boolean, default : false },
    },
    { timestamps : true }
);

export const CategoryModel = mongoose.model<ICategory>('Category', CategorySchema);
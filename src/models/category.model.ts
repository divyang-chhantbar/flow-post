import mongoose ,{Schema , Document} from "mongoose";

export interface Category extends Document {
    userId : mongoose.Types.ObjectId;
    name: string;
    description: string;
}

const categorySchema : Schema = new Schema({
    userId : {
        type : mongoose.Types.ObjectId,
        ref : 'User',
        required : [true, 'User is required']
    },
    name : {
        type : String,
        required : [true, 'Name is required'],
        unique : [true, 'Name must be unique']
    },
    description : {
        type : String,
        required : [true, 'Description is required']
    }
},{timestamps : true});

const CategoryModel = (mongoose.models.Category as mongoose.Model<Category>) || mongoose.model<Category>('Category', categorySchema);

export default CategoryModel;
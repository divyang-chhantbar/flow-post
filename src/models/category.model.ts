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
    },
    description : {
        type : String,
        required : [true, 'Description is required']
    }
},{timestamps : true});

categorySchema.index({userId : 1, name : 1}, {unique : true});
// here we are creating a compound index on userId and name fields to ensure that the combination of userId and name is unique across the collection.
// This means that a user cannot have two categories with the same name.
// sometimes we need scoped uniqueness and not global uniqueness.

const CategoryModel = (mongoose.models.Category as mongoose.Model<Category>) || mongoose.model<Category>('Category', categorySchema);

export default CategoryModel;
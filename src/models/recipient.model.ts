import mongoose , {Schema , Document} from "mongoose";

export interface Recipient extends Document {
    name : string;
    email : string;
    categoryId : mongoose.Types.ObjectId;
}

const RecipientSchema : Schema = new Schema({
    name : {
        type : String,
        required : [true, 'Name is required'],
    },
    email: {
        type: String,
        required: [true, "Email is Required !"],
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "please provide a valid email address !"],
    },
    categoryId : {
        type : mongoose.Types.ObjectId,
        ref : 'Category',
        required : [true, 'Category is required']
    }
},{timestamps : true});

const RecipientModel = (mongoose.models.Recipient as mongoose.Model<Recipient>) || mongoose.model<Recipient>('Recipient', RecipientSchema);

export default RecipientModel;
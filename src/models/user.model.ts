import mongoose,{Schema ,Document} from "mongoose";

export interface User extends Document {
    email : string;
    password ?: string;
    username ?: string;
    verifyCode : string;
    verifyCodeExpiry : Date;
    isVerified : boolean;
}

const UserSchema : Schema<User> = new Schema({
    email :{
        type : String,
        required : [true, "Email is required"],
        unique : true,
        match : [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please fill a valid email address"]
    },
    password : {
        type: String,
        required: [true, "Password is Required !"],
      },
      username: {
        type: String,
        required: [true, "Username is Required !"],
        unique: true,
      },
      verifyCode : {
        type: String,
        required: [true, "Verify Code is Required !"],
      },
      verifyCodeExpiry : {
        type: Date,
        required: [true, "Verify Code Expiry is Required !"],
      },
      isVerified : {
        type: Boolean,
        required: [true, "Is Verified is Required !"],
      },
  
    },
    { timestamps: true }
  );
  
  const UserModel =
    (mongoose.models.User as mongoose.Model<User>) ||
    mongoose.model<User>("User", UserSchema);
  export default UserModel;
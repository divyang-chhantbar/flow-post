import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
export async function POST (req:Request) {
    await dbConnect();
    try {
        const {email, password, username} = await req.json();
        if(!email || !password || !username){
            console.log("Invalid Input");
        }
        // check if the user is verified or not and also check if the user is already registered or not by the same email
        const ifExistingUserByEmail = await UserModel.findOne({email});
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        if(ifExistingUserByEmail){
            if(ifExistingUserByEmail.isVerified){
                return Response.json({
                    success : false,
                    message : "User already Exists !"
                },
                {
                    status : 400,
                })
            }
        else{
            const hashedPassword = await bcrypt.hash(password, 10);
            ifExistingUserByEmail.password = hashedPassword;
            ifExistingUserByEmail.verifyCode = verifyCode;
            ifExistingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
            await ifExistingUserByEmail.save();
        }
        }
        else{
            // create a new user if the user is not already registered
            const hashedPassword = await bcrypt.hash(password, 10); 
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password : hashedPassword,
                verifyCode : verifyCode,
                verifyCodeExpiry : expiryDate,
                isVerified : false,
            })
            await newUser.save();
            // send verification email

         const emailResponse = await sendVerificationEmail(email , username ,verifyCode)

         if(!emailResponse) {
            return Response.json({
                success : false,
                message : "Error sending verification email"
            }, {
                status : 500
            })
         }

         return Response.json({
            success : true,
            message : "User Registered Successfully . Please Verify your email !"
        }, {
            status : 201
        })
        }
    }
    catch (error) {
        console.error('Error registering email',error);
        return Response.json({
            success : false,
            message : "Error registering email"
        },{
            status :500
        })
        
    }
}
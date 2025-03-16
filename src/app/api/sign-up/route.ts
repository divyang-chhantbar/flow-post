import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    await dbConnect();
    try {
        const { email, password, username } = await req.json();
        console.log("Input getting from the user:", email, password, username);

        if (!email || !password || !username) {
            return NextResponse.json(
                { success: false, message: "Invalid Input" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUser) {
            if (existingUser.isVerified) {
                return NextResponse.json(
                    { success: false, message: "User already registered" },
                    { status: 400 }
                );
            } else {
                // Update existing unverified user
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUser.password = hashedPassword;
                existingUser.verifyCode = verifyCode;
                existingUser.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUser.save();

                const emailResponse = await sendVerificationEmail(email, username, verifyCode);
                if (!emailResponse) {
                    return NextResponse.json(
                        { success: false, message: "Error sending verification email" },
                        { status: 500 }
                    );
                }

                return NextResponse.json(
                    { success: true, message: "Verification email resent. Please verify your email!" },
                    { status: 200 }
                );
            }
        } else {
            // Create new user
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode: verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
            });

            await newUser.save();

            // Send verification email
            const emailResponse = await sendVerificationEmail(email, username, verifyCode);
            console.log("Email Response:", emailResponse);
            
            if (!emailResponse) {
                return NextResponse.json(
                    { success: false, message: "Error sending verification email" },
                    { status: 500 }
                );
            }

            return NextResponse.json(
                { success: true, message: "User Registered Successfully. Please Verify your email!" },
                { status: 201 }
            );
        }
    } catch (error) {
        console.error("Error registering email", error);
        return NextResponse.json(
            { success: false, message: "Error registering email" },
            { status: 500 }
        );
    }
}

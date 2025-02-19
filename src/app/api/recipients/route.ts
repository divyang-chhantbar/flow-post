import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import { dbConnect } from "@/lib/dbConnect";
import RecipientModel from "@/models/recipient.model";

export async function POST(req : NextRequest) {
    try {
        await dbConnect();

        const {name , email , categoryId} = await req.json();
        if (!name || !email || !categoryId) {
            return NextResponse.json({
                message : "Name, email and category are required"
            },
            {status : 400})   
        }

        const session = await getServerSession({req, ...authOptions});
        if (!session) {
            return NextResponse.json({
                message : "Unauthorized"
            },
            {status : 401})
        }   

        const ifExistingRecipient = await RecipientModel.findOne({email, userId : session.user._id});
        if (ifExistingRecipient) {
            return NextResponse.json({
                message : "Recipient already exists"
            },
            {status : 400})
        }

        const recipient = await RecipientModel.create({userId : session.user._id, name, email, categoryId});
        
        return NextResponse.json({
            message : "Recipient created successfully !",recipient
        },
        {status : 201})
    } catch (error) {
        return NextResponse.json({
            message : "Recipients are not created successfully" , error
        },
        {status : 500})
    }
}

import { NextResponse } from "next/server";
import { NextRequest } from "next/server"; // Import NextRequest
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import { dbConnect } from "@/lib/dbConnect";
import CategoryModel from "@/models/category.model";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {  // Use NextRequest here
    try {
        await dbConnect();

        // Ensure cookies are accessible in the API route
        const session = await getServerSession({ req, ...authOptions });
        console.log("session:", session);
        
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId: string = session.user._id;
        const { name, description } = await req.json();

        if (!name || !description) {
            return NextResponse.json({ message: "Name and description are required" }, { status: 400 });
        }

        const existingCategory = await CategoryModel.findOne({ name, userId });
        if (existingCategory) {
            return NextResponse.json({ message: "Category already exists" }, { status: 400 });
        }

        const category = await CategoryModel.create({ userId, name, description });

        return NextResponse.json({ message: "Category created", category }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

// lets get the recipients into the category
export async function GET(req:NextRequest) {
    try {
        await dbConnect();
        const session = await getServerSession({req, ...authOptions});
        if (!session) {
            return NextResponse.json({
                message : "Unauthorized"
            },
            {status : 401})
        }
        const userId = new mongoose.Types.ObjectId(session.user._id);
        const recipientInCategories = await CategoryModel.aggregate([
            {
                $match : {userId}
            },
            {
                $lookup : {
                    from : 'recipients',
                    localField : '_id',
                    foreignField : 'categoryId',
                    as : 'recipients'
                },
            },
            {
                $project : {
                    name : 1,
                    description : 1,
                    "recipients.name" : 1,
                    "recipients.email" : 1
                }
            }
        ])
        console.log("recipientInCategories :", recipientInCategories);
        return NextResponse.json(recipientInCategories, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            message : "Issue in adding recipients to the category", error
        },
        {status : 500})
    }
}

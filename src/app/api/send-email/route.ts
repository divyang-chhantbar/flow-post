import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/option";
import { getServerSession } from "next-auth";
import CategoryModel from "@/models/category.model";
import transporter from "@/lib/smtpTransporter";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/dbConnect";
import RecipientModel from "@/models/recipient.model";


export async function POST(request: NextRequest) {
  try {
    // lets get connected to the database
    await dbConnect();
    // now its time for the session
    const session = await getServerSession({ req:request, ...authOptions });
    console.log("This is the session: ", session);
    

    if(!session){
      return NextResponse.json(
        {
          message: "Unauthorized access",
        },
        { status: 401 }
      );
    }

    // destructuring the request body
    const { categoryIds, subject, body } = await request.json();

    if(!categoryIds || !subject || !body){
      return NextResponse.json(
        {
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }

    const categoryObjectIds = categoryIds.map((id: string)=> new mongoose.Types.ObjectId(id));
    console.log("This are categoryIds : ",categoryObjectIds);
    
    const userID = new mongoose.Types.ObjectId(session.user._id);
const categories = await CategoryModel.find({
  _id: { $in: categoryObjectIds },
  userId: userID,  // Updated from createdBy → userId
});

console.log("This are categories : ",categories);

    if (!categories) {
      return NextResponse.json(
        {
          message: "No categories found",
        },
        { status: 404 }
      );
    }
    

   

    // lets fetch the recipients from the selected categories
    const recipientEmails = await RecipientModel.find({
      categoryId: { $in: categoryObjectIds },  // Keep only categoryId
    }).distinct("email");
    

    if (recipientEmails.length === 0) {
      return NextResponse.json(
        {
          message: "No recipients found",
        },
        { status: 404 }
      );
    }

    // lets send the email\
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: recipientEmails,
      subject,
      text: body,
    };

    const msg = await transporter.sendMail(mailOptions);

    console.log("Message sent: %s", msg.messageId);

    if (!msg) {
      console.log("Error sending email");
    }
    

    return NextResponse.json(
      {
        message: "Email sent successfully",
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      {
        message: "Error sending email",
        error,
      },
      { status: 500 }
    );
  }
}

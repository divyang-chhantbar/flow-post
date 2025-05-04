import { dbConnect } from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import CategoryModel from "@/models/category.model";
import RecipientModel from "@/models/recipient.model";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";

export async function POST(req: NextRequest) {
  try {
    // Db connection and session check
    await dbConnect();
    const session = await getServerSession({ req, ...authOptions });
    if (!session) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }
    const userId = new mongoose.Types.ObjectId(session.user._id);
    console.log("userId : ", userId);
    if (!userId) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        { status: 400 }
      );
    }

    // Get the data from the request body
    const { rows } = await req.json();
    console.log("rowsLength : ", rows.length);

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        {
          message: "No data found",
        },
        { status: 400 }
      );
    }

    // Debug: Check the first row to see its structure
    console.log("First row example:", JSON.stringify(rows[0]));

    // Transform the data if it's a 2D array (with headers in first row)
    let processedRows = rows;

    // Check if the data is a 2D array by looking at the first row
    interface RowData {
      categoryName: string;
      categoryDescription: string;
      recipientName: string;
      recipientEmail: string;
      [key: string]: string;
    }

    if (
      Array.isArray(rows[0]) &&
      typeof rows[0] === "object" &&
      !("categoryName" in rows[0])
    ) {
      const headers = rows[0];
      processedRows = [];

      // Skip the header row (index 0) and transform each data row
      for (let i = 1; i < rows.length; i++) {
        const rowData = rows[i];
        const rowObj: RowData = {} as RowData;

        // Map each column value to its corresponding header
        for (let j = 0; j < headers.length; j++) {
          rowObj[headers[j]] = rowData[j];
        }

        processedRows.push(rowObj);
      }

      console.log("Transformed first row:", JSON.stringify(processedRows[0]));
    }

    // Let's extract the data from the rows
    const categories = processedRows.map((row: RowData) => {
      return {
        name: row.categoryName || "",
        description: row.categoryDescription || "",
      };
    });
    console.log("categories : ", categories);

    // Filter out categories with empty names
    const validCategories = categories.filter(
      (cat: { name: string; description: string }) =>
        cat.name && cat.name.trim() !== ""
    );

    if (validCategories.length === 0) {
      return NextResponse.json(
        {
          message: "No valid categories found in the data",
        },
        { status: 400 }
      );
    }

    // Lets normalise the categories to remove duplicates
    const categoryKeyToData = new Map<
      string,
      { name: string; description: string }
    >();
    const categoriesKeyToID = new Map<string, mongoose.Types.ObjectId>();

    /* Loop through the parsed categories:
           Normalize the name → use as the key
           Add to categoryKeyToData if it doesn't exist yet */
    validCategories.forEach(
      (category: { name: string; description: string }) => {
        try {
          const categoryKey = category.name.toLowerCase().trim();
          if (!categoryKeyToData.has(categoryKey)) {
            categoryKeyToData.set(categoryKey, category);
          }
        } catch (error) {
          console.error("Error processing category:", category, error);
        }
      }
    );
    console.log("categoryKeyToData : ", categoryKeyToData);

    // Loop through the parsed categories:
    // Add to categoryKeyToID if it doesn't exist yet
    for (const [categoryKey, category] of categoryKeyToData.entries()) {
      try {
        const categoryIfExist = await CategoryModel.findOne({
          name: new RegExp(`^${category.name.trim()}$`, "i"),
          userId: userId,
        });
        if (!categoryIfExist) {
          const newCategory = new CategoryModel({
            name: category.name,
            description: category.description,
            userId: userId,
          });
          await newCategory.save();
          categoriesKeyToID.set(
            categoryKey,
            newCategory._id as mongoose.Types.ObjectId
          );
        } else {
          categoriesKeyToID.set(
            categoryKey,
            categoryIfExist._id as mongoose.Types.ObjectId
          );
        }
      } catch (error) {
        console.error("Error while creating category:", error);
        return NextResponse.json(
          {
            message: "Error while creating category",
            error,
          },
          { status: 500 }
        );
      }
    }

    // Step 4: Build recipient objects and insert in bulk
    const recipientsToInsert: {
      name: string;
      email: string;
      userId: mongoose.Types.ObjectId;
      categoryId: mongoose.Types.ObjectId;
    }[] = [];

    for (const row of processedRows) {
      const categoryKey = row.categoryName?.toLowerCase()?.trim();
      const categoryId = categoryKey
        ? categoriesKeyToID.get(categoryKey)
        : undefined;
      const name = row.recipientName?.trim();
      const email = row.recipientEmail?.trim();

      if (categoryId && name && email) {
        recipientsToInsert.push({
          name,
          email,
          userId,
          categoryId,
        });
      } else {
        console.warn("Skipped row due to missing data:", row);
      }
    }

    if (recipientsToInsert.length > 0) {
      await RecipientModel.insertMany(recipientsToInsert);
      console.log("Recipients inserted:", recipientsToInsert.length);
    } else {
      console.warn("No valid recipients to insert.");
    }

    return NextResponse.json({
      message: "Excel uploaded successfully",
      recipientsAdded: recipientsToInsert.length,
      categoriesAdded: categoriesKeyToID.size,
    });
  } catch (error) {
    console.error("Error in excel upload:", error);
    return NextResponse.json(
      {
        message: "Error in excel upload",
        error,
      },
      { status: 500 }
    );
  }
}

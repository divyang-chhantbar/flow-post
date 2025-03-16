import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
}

const connection: ConnectionObject = {};

// the above thing we have done for the first time so let me explain what we did in detail : 
// we have created a connection object of type ConnectionObject which is an interface that has a property isConnected of type number. This property will be used to check if the connection is already established or not. If it is established, then we will not establish the connection again.

// Now let's create a function that will connect to the database.
export async function dbConnect(): Promise<void> {
    if(connection.isConnected){
        console.log("Already connected to the database");
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "" ,{})
        // console.log("DB details :",db);
        // console.log("db.connections details :",db.connections);
        connection.isConnected = db.connections[0].readyState;
        console.log("DB connection established successfully");
    } catch (error) {
        console.log("DB connection failed",error);
        process.exit(1);
    }
}
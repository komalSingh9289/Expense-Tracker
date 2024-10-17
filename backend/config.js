import mongoose from "mongoose";

export const connectDb = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL);
        console.log("MongoDB Connected : ", conn.connection.host);
        
    } catch (error) {
        console.log("Database error : ", error);
        
    }
}
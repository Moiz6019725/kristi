import mongoose from "mongoose";

async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("Connected to database");
    } catch (error) {
        console.log(error);
    }
}

export default connectToDatabase
import mongoose from "mongoose";

export async function connectDB() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw Error("url not defined");
    }
    await mongoose.connect(uri);
    return mongoose.connection;
  } catch (error) {
    console.log(error);
  }
}

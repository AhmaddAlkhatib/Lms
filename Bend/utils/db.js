import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose
      .connect(process.env.MONGO_URL)
      .then(() => console.log("Connected!"));
  } catch (error) {
    console.log("error coccured", error);
  }
};
export default connectDB;

// mongoose
//   .connect("mongodb://127.0.0.1:27017/LMS")
//   .then(() => console.log("Connected!"));

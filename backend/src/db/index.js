import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dotenv.config({
  path: "./.env",
});
//returns promise since await/async
const connectDB = async () => {
  try {
    //takes few sec to connect so use await
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.log("❌ MongoDb connection error", err);
    process.exit(1);
  }
};
export default connectDB;

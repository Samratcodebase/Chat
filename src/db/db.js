import mongoose from "mongoose";


const ConnectToDB = new Promise(async (resolve, reject) => {
  if (!process.env.MONGO_URI) {
    reject("MongoDB URI is not defined in the environment variables");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    resolve();
  } catch (error) {
    console.log(`Error Connecting to MongoDB: ${error.message}`);
    reject(error);
  }
});

export default ConnectToDB;

import mongoose from "mongoose";

const connectDb = async () => {
  let con = await mongoose.connect(process.env.MONGO_URI);
  console.log("Db connected ==> ", con.connection.host);
};

export { connectDb };
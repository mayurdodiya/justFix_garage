const mongoose = require("mongoose");

module.exports = connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // serverSelectionTimeoutMS: 10000,  // Increase timeout
    });
    console.log("✅ Database Connected successfully...");
  } catch (error) {
    console.log("❌ Database Connection Error:", error);
  }
};

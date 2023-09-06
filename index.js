const express = require("express");
const dotenv = require("dotenv").config();
const app = express();
const contactRoutes = require("./routes/contactRoutes");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middleware/errorHandler");
const connectDB = require("./config/dbConnection");
const PORT = process.env.PORT || 3000;

(async () => {
  await connectDB();
  app.use(express.json());
  app.use("/api/contact", contactRoutes);
  app.use("/api/users", userRoutes);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();

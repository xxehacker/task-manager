const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./db/db");
const cookieParser = require("cookie-parser");

dotenv.config({
  path: "./.env",
});

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(
  express.json({
    limit: "50kb",
  })
);

app.use(
  express.urlencoded({
    limit: "50kb",
    extended: true,
  })
);
app.use(cookieParser());
// app.use(express.static("uploads"));

// routes import
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const taskRoutes = require("./routes/task.routes");

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/task", taskRoutes);

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 9001, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });

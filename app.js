const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
// const sanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
// app.use(sanitize())
app.use(helmet());
app.use(morgan("dev"));

// Rate limiting middleware
const rateLimiterMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});

app.use(rateLimiterMiddleware);

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

app.listen(port, () => {
  connectDB();
  console.log(`Server is running on port ${port}`);
});

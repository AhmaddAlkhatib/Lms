import express from "express";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/userRoute.js";
import courseRoute from "./routes/courseRoute.js";
import mediaRoute from "./routes/mediaRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

dotenv.config();

const app = express();
// default middlware

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const _dirname = path.resolve();

// APIS
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/media", mediaRoute);

app.use(express.static(path.join(_dirname, "/Fend/dist")));
app.get(/.*/, (req, res) => {
  res.sendFile(path.resolve(_dirname, "Fend", "dist", "index.html"));
});
//localhost:8000/api/v1/user/register

app.listen(PORT, () => {
  connectDB();
  console.log(`Server listen at PORT ${PORT}`);
});

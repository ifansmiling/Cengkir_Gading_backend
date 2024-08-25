const express = require("express");
const cors = require("cors");
const session = require("express-session");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const db = require("./config/Database.js");
const UserRoute = require("./routes/UserRoute.js");
const DramaRoute = require("./routes/DramaRoute.js");
const UserRating = require("./routes/UserRatingRoute.js");
const SkenarioRoute = require("./routes/SkenarioRoute.js");
const EvaluasiKarakter = require("./routes/EvaluasiKarakterRoute.js");
const DailyExercise = require("./routes/DailyExerciseRoute.js");
const KalenderAcara = require("./routes/KalenderAcaraRoute.js");
const multer = require("./config/Multer.js");

dotenv.config();

const app = express();

const uploadDirkalender_acara = path.join(__dirname, "uploads/kalender_acara");
const uploadDirdailyExercise = path.join(__dirname, "uploads/dailyExercise");
const uploadDirskenario = path.join(__dirname, "uploads/skenario");

if (!fs.existsSync(uploadDirkalender_acara)) {
  fs.mkdirSync(uploadDirkalender_acara, { recursive: true });
}

if (!fs.existsSync(uploadDirdailyExercise)) {
  fs.mkdirSync(uploadDirdailyExercise, { recursive: true });
}

if (!fs.existsSync(uploadDirskenario)) {
  fs.mkdirSync(uploadDirskenario, { recursive: true });
}

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: "auto",
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// Serve static files untuk upload
app.use("/uploads/kalender_acara", express.static(uploadDirkalender_acara));
app.use("/uploads/dailyExercise", express.static(uploadDirdailyExercise));
app.use("/uploads/skenario", express.static(uploadDirskenario));

// Routes
app.use(UserRoute);
app.use(DramaRoute);
app.use(UserRating);
app.use(SkenarioRoute);
app.use(EvaluasiKarakter);
app.use(DailyExercise);
app.use(KalenderAcara);

app.listen(process.env.APP_PORT, () => {
  console.log(`Server up and running...`);
});

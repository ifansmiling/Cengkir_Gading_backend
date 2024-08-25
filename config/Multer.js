const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Setup penyimpanan dengan dynamic destination
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath;

    if (req.baseUrl.includes("skenario")) {
      uploadPath = path.join(__dirname, "uploads/skenario");
    } else if (req.baseUrl.includes("dailyExercise")) {
      uploadPath = path.join(__dirname, "uploads/dailyExercise");
    } else if (req.baseUrl.includes("kalenderAcara")) {
      uploadPath = path.join(__dirname, "uploads/kalender_acara");
    } else {
      uploadPath = path.join(__dirname, "uploads/other");
    }

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 100 }, 
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|pdf|docx|mp4/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb("Error: File type not supported!");
  },
});

module.exports = upload;

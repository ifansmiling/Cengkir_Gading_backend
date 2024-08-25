const express = require("express");
const upload = require("../config/Multer.js"); 
const {
  createKalenderAcara,
  getKalenderAcara,
  getKalenderAcaraById,
  updateKalenderAcara,
  deleteKalenderAcara,
} = require("../controllers/KalenderAcaraController.js");

const router = express.Router();

//Rute Get
router.get("/kalenderAcara", getKalenderAcara);
router.get("/kalenderAcara/:id", getKalenderAcaraById);

//Rute Post
router.post("/kalenderAcara", upload.single("file"), createKalenderAcara);

//Rute Put
router.put("/kalenderAcara/:id", upload.single("file"), updateKalenderAcara);

//Rute Delete
router.delete("/kalenderAcara/:id", deleteKalenderAcara);

module.exports = router;

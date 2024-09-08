const express = require("express");
const uploadMultiple = require("../config/Multer.js"); 
const {
  createSkenario,
  getSkenario,
  getSkenarioById,
  updateSkenario,
  deleteSkenario,
} = require("../controllers/SkenarioController.js");

const router = express.Router();

// Rute Get
router.get("/skenario", getSkenario); 
router.get("/skenario/:id", getSkenarioById); 

// Rute Post
router.post("/skenario", uploadMultiple, createSkenario); 

// Rute Put
router.put("/skenario/:id", uploadMultiple, updateSkenario);

// Rute Delete
router.delete("/skenario/:id", deleteSkenario);

module.exports = router;

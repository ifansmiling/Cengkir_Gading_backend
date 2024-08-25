const express = require("express");
const upload = require("../config/Multer.js"); 
const {
  createSkenario,
  getSkenario,
  getSkenarioById,
  updateSkenario,
  deleteSkenario,
} = require("../controllers/SkenarioController.js");

const router = express.Router();

//Rute Get
router.get("/skenario", getSkenario); 
router.get("/skenario/:id", getSkenarioById); 

//Rute Post
router.post("/skenario", upload.single("file"), createSkenario); 

//Rute Put
router.put("/skenario/:id", upload.single("file"), updateSkenario);

//Rute Delete
router.delete("/skenario/:id", deleteSkenario);

module.exports = router;

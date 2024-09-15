const express = require("express");
const {
  createEvaluasiKarakter,
  getEvaluasiKarakter,
  getEvaluasiKarakterByUserId,
  getEvaluasiKarakterById,
  updateEvaluasiKarakter,
  deleteEvaluasiKarakter,
} = require("../controllers/EvaluasiKarakterController.js");

const router = express.Router();

//Rute Get
router.get("/evaluasiKarakter", getEvaluasiKarakter);
router.get("/evaluasiKarakter/:id", getEvaluasiKarakterById);
router.get("/evaluasiKarakter/user/:user_id", getEvaluasiKarakterByUserId);

//Rute Post
router.post("/evaluasiKarakter", createEvaluasiKarakter);

//Rute Put
router.put("/evaluasiKarakter/:id", updateEvaluasiKarakter);

//Rute Delete
router.delete("/evaluasiKarakter/:id", deleteEvaluasiKarakter);

module.exports = router;

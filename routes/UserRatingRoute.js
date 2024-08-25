const express = require("express");
const {
  createUserRating,
  getUserRating,
  getUserRatingById,
  updateUserRating,
  deleteUserRating,
} = require("../controllers/UserRatingController.js");

const router = express.Router();

//Rute Get
router.get("/user-rating", getUserRating);
router.get("/user-rating/:id", getUserRatingById);

//Rute Post
router.post("/user-rating", createUserRating);

//Rute Put
router.put("/user-rating/:id", updateUserRating);

//Rute Delete
router.delete("/user-rating/:id", deleteUserRating);

module.exports = router;

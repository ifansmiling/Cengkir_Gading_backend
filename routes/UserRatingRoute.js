const express = require("express");
const {
  createUserRating,
  getUserRating,
  getUserRatingById,
  getUserRatingByUser,
  updateUserRating,
  deleteUserRatings,
} = require("../controllers/UserRatingController.js");

const router = express.Router();

//Rute Get
router.get("/user-rating", getUserRating);
router.get("/user-rating/:id", getUserRatingById);
router.get("/user-rating/user/:id", getUserRatingByUser);

//Rute Post
router.post("/user-rating", createUserRating);

//Rute Put
router.put("/user-rating/:id", updateUserRating);

//Rute Delete
router.delete("/user-rating", deleteUserRatings);

module.exports = router;

const express = require("express");
const {
  createUserRating,
  getUserRating,
  getUserRatingById,
  getUserRatingByUser,
  getUserRatingByUserId,
  updateUserRating,
  deleteUserRatings,
} = require("../controllers/UserRatingController.js");

const router = express.Router();

//Rute Get
router.get("/user-rating", getUserRating);
router.get("/user-rating/rating", getUserRatingById);
router.get("/user-rating/user/:id", getUserRatingByUser);
router.get("/userRating/user/rating/:user_id", getUserRatingByUserId);

//Rute Post
router.post("/user-rating", createUserRating);

//Rute Put
router.put("/user-rating/update/rating", updateUserRating);

//Rute Delete
router.delete("/user-rating", deleteUserRatings);

module.exports = router;

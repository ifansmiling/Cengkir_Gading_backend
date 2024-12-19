const express = require("express");
const {
  createUserRating,
  getUserRating,
  getUserRatingByid,
  getUserRatingByUser,
  getUserRatingByUserId,
  updateUserRating,
  deleteUserRatingsByDate,
} = require("../controllers/UserRatingController.js");

const router = express.Router();

//Rute Get
router.get("/user-rating", getUserRating);
router.get("/user-rating/rating/user/tanggal", getUserRatingByid);
router.get("/user-rating/user/rating", getUserRatingByUser);
router.get("/userRating/user/rating/:user_id", getUserRatingByUserId);

//Rute Post
router.post("/user-rating", createUserRating);

//Rute Put
router.put("/user-rating/update/rating", updateUserRating);

//Rute Delete
router.delete("/user-rating", deleteUserRatingsByDate);

module.exports = router;

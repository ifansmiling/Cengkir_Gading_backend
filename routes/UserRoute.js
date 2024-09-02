const express = require("express");
const {
  createUser,
  getUser,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/UserController.js");

const router = express.Router();

//Rute Get
  router.get("/user", getUser);
router.get("/user/:id", getUserById);

//Rute Post
router.post("/user", createUser);

//Rute Put
router.put("/user/:id", updateUser);

//Rute Delete
router.delete("/user/:id", deleteUser);

module.exports = router;

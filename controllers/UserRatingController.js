const UserRating = require("../models/UserRatingModel.js");
const User = require("../models/UsersModel.js");
const Drama = require("../models/DramaModel.js");

// Membuat data UserRating
exports.createUserRating = async (req, res) => {
  const { rating, user_id, parameter_id } = req.body;
  try {
    const userRating = await UserRating.create({
      rating,
      user_id,
      parameter_id,
    });
    res.status(201).json(userRating);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mendapatkan semua data UserRating
exports.getUserRating = async (req, res) => {
  try {
    const userRatings = await UserRating.findAll({
      include: [
        { model: User, attributes: ['nama', 'email'] },
        { model: Drama, attributes: ['nama'] },
      ],
    });
    res.status(200).json(userRatings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mendapatkan data user rating berdasarkan ID
exports.getUserRatingById = async (req, res) => {
  try {
    const userRating = await UserRating.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['nama', 'email'] },
        { model: Drama, attributes: ['nama'] },
      ],
    });
    if (!userRating) return res.status(404).json({ message: "User Rating Tidak Ditemukan" });
    res.status(200).json(userRating);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update data UserRating
exports.updateUserRating = async (req, res) => {
  const { rating, user_id, parameter_id } = req.body;
  try {
    const userRating = await UserRating.findByPk(req.params.id);
    if (!userRating) return res.status(404).json({ message: "User Rating Tidak Ditemukan" });

    await userRating.update({
      rating,
      user_id,
      parameter_id,
    });
    res.status(200).json(userRating);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Menghapus data UserRating
exports.deleteUserRating = async (req, res) => {
  try {
    const userRating = await UserRating.findByPk(req.params.id);
    if (!userRating) return res.status(404).json({ message: "User Rating Tidak DItemukan" });

    await userRating.destroy();
    res.status(200).json({ message: "User Rating Berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

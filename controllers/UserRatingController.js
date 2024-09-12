const UserRating = require("../models/UserRatingModel.js");
const User = require("../models/UsersModel.js");
const Drama = require("../models/DramaModel.js");
const { Op } = require("sequelize");

// Membuat data UserRating
exports.createUserRating = async (req, res) => {
  const { rating, user_id, parameter_id } = req.body;
  try {
    if (Array.isArray(parameter_id)) {
      const userRatings = await Promise.all(
        parameter_id.map(async (paramId) => {
          return await UserRating.create({
            rating,
            user_id,
            parameter_id: paramId,
          });
        })
      );
      res.status(201).json({
        message: "Rating berhasil dibuat untuk beberapa parameter.",
        data: userRatings,
      });
    } else {
      const userRating = await UserRating.create({
        rating,
        user_id,
        parameter_id,
      });
      res.status(201).json({
        message: "Rating berhasil dibuat.",
        data: userRating,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mendapatkan semua data UserRating
exports.getUserRating = async (req, res) => {
  try {
    const { parameter_ids } = req.query;

    const whereCondition = parameter_ids
      ? { parameter_id: parameter_ids.split(",") }
      : {};

    const userRatings = await UserRating.findAll({
      where: whereCondition,
      include: [
        { model: User, attributes: ["nama", "email", "nim"] },
        { model: Drama, attributes: ["nama"] },
      ],
    });

    if (userRatings.length === 0) {
      return res.status(404).json({
        message: "Tidak ada rating ditemukan.",
      });
    }

    res.status(200).json({
      message: "Rating berhasil diambil.",
      data: userRatings,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mendapatkan data user rating berdasarkan ID
exports.getUserRatingById = async (req, res) => {
  try {
    const { ids } = req.query;

    if (!ids) {
      return res.status(400).json({ message: "IDs diperlukan" });
    }

    const idArray = ids.split(",");

    const userRatings = await UserRating.findAll({
      where: {
        id: idArray,
      },
      include: [
        { model: User, attributes: ["nama", "email", "nim"] },
        { model: Drama, attributes: ["nama"] },
      ],
    });

    if (userRatings.length === 0) {
      return res.status(404).json({ message: "User Rating Tidak Ditemukan" });
    }

    res.status(200).json(userRatings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Mendpatakan user rating berdasarkan id dari user
exports.getUserRatingByUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "User ID harus disediakan." });
    }

    const userRatings = await UserRating.findAll({
      where: { user_id: id },
      include: [
        { model: User, attributes: ["nama", "email", "nim"] },
        { model: Drama, attributes: ["nama"] },
      ],
    });

    if (userRatings.length === 0) {
      return res.status(404).json({
        message: "Rating tidak ditemukan untuk user ID yang diberikan.",
      });
    }

    res.status(200).json({
      message: "Rating berhasil diambil.",
      data: userRatings,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update data UserRating
exports.updateUserRating = async (req, res) => {
  const { rating, user_id, parameter_id } = req.body;
  try {
    const userRating = await UserRating.findByPk(req.params.id);
    if (!userRating)
      return res.status(404).json({ message: "User Rating Tidak Ditemukan" });

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
exports.deleteUserRatings = async (req, res) => {
  const { user_id, parameter_ids } = req.body;

  if (!user_id || !Array.isArray(parameter_ids) || parameter_ids.length === 0) {
    return res.status(400).json({ message: "Invalid parameters" });
  }

  try {
    const result = await UserRating.destroy({
      where: {
        user_id: user_id,
        parameter_id: { [Op.in]: parameter_ids },
      },
    });

    if (result > 0) {
      return res
        .status(200)
        .json({ message: "User ratings berhasil dihapus." });
    } else {
      return res
        .status(404)
        .json({ message: "No matching user ratings found." });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error saat menghapus user ratings.", error });
  }
};

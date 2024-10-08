const UserRating = require("../models/UserRatingModel.js");
const User = require("../models/UsersModel.js");
const Drama = require("../models/DramaModel.js");
const { Op } = require("sequelize");

// Membuat data UserRating
exports.createUserRating = async (req, res) => {
  const { rating, user_id, parameter_id } = req.body;

  try {
    // Pastikan parameter_id dan rating memiliki panjang yang sama
    if (
      Array.isArray(parameter_id) &&
      Array.isArray(rating) &&
      parameter_id.length === rating.length
    ) {
      const userRatings = await Promise.all(
        parameter_id.map(async (paramId, index) => {
          return await UserRating.create({
            rating: rating[index], // Gunakan rating yang sesuai dengan parameter_id
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
      return res.status(400).json({
        error:
          "Parameter ID dan Rating harus berupa array dengan panjang yang sama.",
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

exports.getUserRatingById = async (req, res) => {
  try {
    const { ids } = req.query;

    if (!ids) {
      return res.status(400).json({ message: "User ID diperlukan" });
    }

    const idArray = ids.includes(",") ? ids.split(",") : [ids];

    const userRatings = await UserRating.findAll({
      where: {
        user_id: idArray,
      },
      include: [
        { model: User, attributes: ["nama", "email", "nim"] },
        { model: Drama, attributes: ["nama"] },
      ],
    });

    if (userRatings.length === 0) {
      return res.status(404).json({ message: "User Rating Tidak Ditemukan" });
    }

    res.status(200).json({
      message: "Rating berhasil diambil.",
      data: userRatings,
    });
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

// Mendapatkan data UserRating berdasarkan user_id
exports.getUserRatingByUserId = async (req, res) => {
  try {
    // Mengambil semua rating yang terkait dengan user_id dari parameter URL
    const userRatings = await UserRating.findAll({
      where: { user_id: req.params.user_id }, // Memfilter berdasarkan user_id
      include: [
        { model: User, attributes: ["nama", "email", "nim"] },
        { model: Drama, attributes: ["nama"] },
      ],
    });

    // Jika tidak ada rating ditemukan
    if (userRatings.length === 0) {
      return res.status(200).json({ message: "Belum Ada Rating" });
    }

    // Mengembalikan data rating
    res.status(200).json(userRatings);
  } catch (error) {
    // Mengembalikan error jika ada kesalahan
    res.status(500).json({ message: error.message });
  }
};

// Update data UserRating
exports.updateUserRating = async (req, res) => {
  const { rating, user_id, parameter_id } = req.body;

  if (!user_id || !rating || !parameter_id) {
    return res
      .status(400)
      .json({ message: "user_id, parameter_id, dan rating diperlukan." });
  }

  try {
    if (
      Array.isArray(parameter_id) &&
      Array.isArray(rating) &&
      parameter_id.length === rating.length
    ) {
      const updatedRatings = await Promise.all(
        parameter_id.map(async (paramId, index) => {
          const userRating = await UserRating.findOne({
            where: {
              user_id,
              parameter_id: paramId,
            },
          });

          if (userRating) {
            // Update rating sesuai dengan index yang ada pada array rating
            return await userRating.update({ rating: rating[index] });
          }
          return null;
        })
      );

      const validRatings = updatedRatings.filter((rating) => rating !== null);

      if (validRatings.length === 0) {
        return res.status(404).json({ message: "User Rating Tidak Ditemukan" });
      }

      return res.status(200).json({
        message: "User Rating berhasil diperbarui untuk beberapa parameter.",
        data: validRatings,
      });
    } else {
      return res
        .status(400)
        .json({
          message: "Parameter dan rating tidak valid atau tidak sesuai.",
        });
    }
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

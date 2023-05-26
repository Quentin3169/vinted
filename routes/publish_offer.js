const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

const Offer = require("../models/Offer");
const User = require("../models/User");
const isAuthenticated = require("../middlewares/isAuthenticated");

cloudinary.config({
  cloud_name: "dq6zr9eyh",
  api_key: "274592522247632",
  api_secret: "GJ_avOowBhFA5WlIMssxoGezmjw",
});

const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};
router.post(
  "/offer/publish",
  isAuthenticated,
  fileUpload(),
  async (req, res) => {
    try {
      const newOffer = await new Offer({
        product_name: req.body.title,
        product_description: req.body.description,
        product_price: req.body.price,
        product_details: [
          { MARQUE: req.body.brand },
          { TAILLE: req.body.size },
          { ETAT: req.body.condition },
          { COULEUR: req.body.color },
          { EMPLACEMENT: req.body.city },
        ],

        owner: req.findUser._id,
      });

      if (req.files) {
        const result = await cloudinary.uploader.upload(
          convertToBase64(req.files.picture)
        );
        newOffer.product_image = result;
      }
      await newOffer.save();

      res.status(200).json(newOffer);
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }
);

router.get("/offers", async (req, res) => {
  try {
    const filters = {};
    if (req.query.title) {
      filters.product_name = new RegExp(req.query.title, "i");
    }
    if (req.query.priceMin) {
      filters.product_price = { $gte: Number(req.query.priceMin) };
    }
    if (req.query.priceMax) {
      if (filters.product_price) {
        filters.product_price.$lte = Number(req.query.priceMax);
      } else {
        filters.product_price = {
          $lte: Number(req.query.priceMax),
        };
      }
    }
    const sort = {};
    if (req.query.sort === "price-desc") {
      sort.product_price = -1;
    } else if (req.query.sort === "price-asc") {
      sort.product_price = 1;
    }

    let limit = 5;
    if (req.query.limit) {
      limit = req.query.limit;
    }

    let page = 1;

    if (req.query.page) {
      page = req.query.page;
    }

    const skip = (page - 1) * limit;
    const result = await Offer.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select("product_name product_price -_id");

    const count = await Offer.countDocuments(filters);
    res.status(200).json({ count: count, offers: result });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

router.get("/offer/:id", async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id).populate(
      "owner",
      "account"
    );
    res.json(offer);
  } catch (error) {
    res.status(400).json({});
  }
});

module.exports = router;

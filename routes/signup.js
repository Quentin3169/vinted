const express = require("express");
const router = express.Router();
const User = require("../models/User");
const uid2 = require("uid2");

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};

router.post("/user/signup", fileUpload(), async (req, res) => {
  try {
    const searchMail = await User.findOne({ email: req.body.email });
    if (searchMail) {
      return res.json("Email deja pris");
    }

    const newToken = uid2(64);
    const newSalt = uid2(16);
    const newHash = SHA256(req.body.password + newSalt).toString(encBase64);

    const result = await cloudinary.uploader.upload(
      convertToBase64(req.files.avatar)
    );
    const newUser = await new User({
      email: req.body.email,
      account: {
        username: req.body.username,
        avatar: result.secure_url,
      },
      newsletter: req.body.newsletter,
      token: newToken,
      hash: newHash,
      salt: newSalt,
    });

    await newUser.save();

    res.json(newUser);
  } catch (error) {
    res.json({
      error: error.message,
    });
  }
});

module.exports = router;

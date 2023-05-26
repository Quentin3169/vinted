const express = require("express");
const router = express.Router();
const User = require("../models/User");
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

router.post("/user/login", async (req, res) => {
  try {
    const alreadyRegister = await User.findOne({ email: req.body.email });
    const saltRegister = alreadyRegister.salt;
    const hashRegister = alreadyRegister.hash;
    //console.log(saltRegister);

    const newHash = SHA256(req.body.password + saltRegister).toString(
      encBase64
    );
    if (newHash === hashRegister) {
      return res.json("Connexion Autorisée");
    } else {
      return res.status(400).json("Mauvais MDP");
    }
  } catch (error) {
    res.json({
      error: error.message,
    });
  }
});

module.exports = router;

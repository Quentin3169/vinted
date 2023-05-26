const express = require("express");
const mongoose = require("mongoose");
const uid2 = require("uid2"); //générer des chaines de caracteres aléatoire
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");
require("dotenv").config();

const isAuthenticated = require("./middlewares/isAuthenticated");

const app = express(); // initialise le server

app.use(express.json()); //lire des body
app.use(cors());

mongoose.connect(process.env.MONGODB_URI);
const User = require("./models/User");
const Offer = require("./models/Offer");

const signupRoutes = require("./routes/signup");
app.use(signupRoutes);

const loginRoutes = require("./routes/login");
app.use(loginRoutes);

const publishOfferRoutes = require("./routes/publish_offer");
app.use(publishOfferRoutes);

console.log("bonjour");
console.log("loll");

app.all("*", (req, res) => {
  res.json("Route introuvable");
});

app.listen(process.env.PORT, () => {
  console.log(
    "Server Started 🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀"
  );
});

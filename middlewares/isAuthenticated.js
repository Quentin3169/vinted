const express = require("express");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/vinted");
const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  const findUser = await User.findOne({
    token: req.headers.authorization.replace("Bearer ", ""),
  });

  req.findUser = findUser;

  if (findUser) {
    next();
  } else {
    return res.status(404).json({
      message: "Vous devez vous créer un compte",
    });
  }
};

module.exports = isAuthenticated;

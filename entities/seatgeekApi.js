const GeneralApi = require("./generalApi");
const express = require("express");
const router = express.Router();
const models = require("../models");
const axios = require("axios");
const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "..", ".env")
});

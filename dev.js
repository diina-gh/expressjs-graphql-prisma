import app from "./api/index.js";
import consola from "consola";
import dotenv from "dotenv";

// const app = require('./api/index')
// const consola = require('consola')
// const dotenv = require('dotenv')

dotenv.config();
app.listen(3000, () => consola.info("Server started"));
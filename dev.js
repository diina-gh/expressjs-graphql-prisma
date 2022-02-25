// const {httpServer} = require('./api/index')
// const consola = require('consola')
// const dotenv = require('dotenv')

import httpServer from "./api/index.js";
import consola from "consola";
import dotenv from "dotenv";

dotenv.config();
httpServer.listen(3000, () => consola.info("Server started"));
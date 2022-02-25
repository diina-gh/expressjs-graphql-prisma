const {httpServer} = require('./api/index')
const consola = require('consola')
const dotenv = require('dotenv')

dotenv.config();
httpServer.listen(3000, () => consola.info("Server started"));
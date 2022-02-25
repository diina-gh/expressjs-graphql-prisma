const { ApolloServer, gql } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const http = require('http');
const express = require('express')
const cors = require('cors');
const fs = require('fs');
const path = require('path')
const {fileURLToPath} = require('url');
const { PrismaClient } = require('@prisma/client')
const {getUserId} = require('./utils')

const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const User = require('./resolvers/User')
const Link = require('./resolvers/Link')

const prisma = new PrismaClient()
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const resolvers = {
    Query,
    Mutation,
    User,
    Link
  }

const app = express();
app.use(cors());
app.use(express.json());
const httpServer = http.createServer(app);


const startApolloServer = async(app, httpServer) => {
    const server = new ApolloServer({
      typeDefs: fs.readFileSync( path.join(__dirname, 'schema.graphql'),'utf8'),
      resolvers,
      context: ({ req }) => {
        return {
          ...req,
          prisma,
          userId:
            req && req.headers.authorization
              ? getUserId(req)
              : null
        };
      },    
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });
  
    await server.start();
    server.applyMiddleware({ app });
}

startApolloServer(app, httpServer);
// export default httpServer;

module.exports = {
    httpServer
}
  
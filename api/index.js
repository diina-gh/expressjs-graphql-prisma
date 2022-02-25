// const { ApolloServer, gql } = require('apollo-server-express');
// const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
// const http = require('http');
// const express = require('express')
// const cors = require('cors');

import { ApolloServer, gql } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import http from "http";
import express from "express";
import cors from "cors";


// const fs = require('fs');
// const path = require('path')
// const {fileURLToPath} = require('url');

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url";

// const { PrismaClient } = require('@prisma/client')
// const {getUserId} = require('./utils')

import { PrismaClient } from ".prisma/client/index.js";
import { getUserId } from "./utils.js";

// const Query = require('./resolvers/Query')
// const Mutation = require('./resolvers/Mutation')
// const User = require('./resolvers/User')
// const Link = require('./resolvers/Link')

import * as Query from "./resolvers/Query.js";
import * as Mutation from "./resolvers/Mutation.js";
import * as User from "./resolvers/User.js";
import * as Link from "./resolvers/Link.js";


const prisma = new PrismaClient()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
export default httpServer;

// module.exports = {
//     httpServer
// }
  
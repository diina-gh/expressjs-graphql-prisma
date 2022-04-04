import { ApolloServer, gql } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import {GraphQLDate,GraphQLDateTime,GraphQLTime} from 'graphql-scalars';
import http from "http";
import express from "express";
import cors from "cors";
import helmet from "helmet";

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url";

import { PrismaClient } from ".prisma/client/index.js";
import { getUserId } from "../utils.js";

import * as Query from "../resolvers/Queries/index.js";
import * as Mutation from "../resolvers/Mutations/index.js";

const prisma = new PrismaClient()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resolvers = {
    Date: GraphQLDate,
    Time: GraphQLTime,
    DateTime: GraphQLDateTime,
    Query,
    Mutation,
  }

const app = express();

var whitelist = ['https://tradeadmin.vercel.app/', 'https://store-front-three.vercel.app/', 'http://localhost:3001/']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed ☠'))
    }
  }
}

app.use(cors(corsOptions));

app.use(express.json());
app.use(helmet());

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
              : null,
          url: req.headers.referer
        };
      },    
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
      // introspection: true
    });
  
    await server.start();
    server.applyMiddleware({ app });
}

startApolloServer(app, httpServer);
export default httpServer;

  
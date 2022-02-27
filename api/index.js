import { ApolloServer, gql } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import http from "http";
import express from "express";
import cors from "cors";

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
    Query,
    Mutation,
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
      // introspection: true
    });
  
    await server.start();
    server.applyMiddleware({ app });
}

startApolloServer(app, httpServer);
export default httpServer;

  
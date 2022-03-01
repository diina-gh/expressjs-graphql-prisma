// const jwt = require('jsonwebtoken');

import jwt from "jsonwebtoken"

export const APP_SECRET = 'GraphQL-is-aw3some';

export function getTokenPayload(token) {
  return jwt.verify(token, APP_SECRET);
}

export function getUserId(req, authToken) {
  if (req) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      if (!token) {
        throw new Error('No token found');
      }
      const { userId } = getTokenPayload(token);
      return userId;
    }
  } else if (authToken) {
    const { userId } = getTokenPayload(authToken);
    return userId;
  }

  throw new Error('Not authenticated');
}

export async function checkLinks(context, entity, entity_ids) {

  var row = null

  for (let i = 0; i < entity_ids.length; i++) {
    if(entity = "permission") row = await context.prisma.permission.findUnique({ where: { id: entity_ids[i] } })
    if(!row) break
  }

  if(!row) return false
  return true

}

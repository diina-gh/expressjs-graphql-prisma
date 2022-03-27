// const jwt = require('jsonwebtoken');
import jwt from "jsonwebtoken";

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

export function  getDifference(tab1 = [], tab2 = []){

  var result = []

  if(tab1?.length == 0) return tab2
  if(tab2.length == 0) return result

  for(let i=0; i< tab2.length; i++){
    var found = false
    for(let j=0; j< tab1.length; j++){
      if(tab2[i] == tab1[j]) found = true
    }
    if(!found) result.push(tab2[i])
  }

  return result

}




const { sign } = require('jsonwebtoken');

export function createAuthenticationToken(uid) {
  if (process.env.JWT_SECRET == null) {
    throw new Error();
  }
  const payload = { uid };
  const token = sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
  return token;
}

export function isBearerToken(token) {
  if (token == null) {
    return false;
  }
  const words = token.split(' ');
  return words[0] === 'Bearer' && !!words[1];
}

function hasTokenLifespan(payload) {
  return typeof payload.iat === 'number' && typeof payload.exp === 'number';
}

export function isAccessTokenSignedPayload(payload) {
  return typeof payload.userId === 'number' && hasTokenLifespan(payload);
}

const { mockAuthDB } = require('./auth');

// Simple token-based mock auth middleware-like function
function getUserFromAuthHeader(req) {
  const auth = req.headers.authorization || '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  if (!token) return null;
  const userId = mockAuthDB.tokens[token];
  if (!userId) return null;
  return mockAuthDB.users.find((u) => u.id === userId) || null;
}

class AuthExtController {
  // PUBLIC_INTERFACE
  me(req, res) {
    /** Returns current user using Authorization: Bearer <token> */
    const user = getUserFromAuthHeader(req);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    return res.status(200).json({ user });
  }
}

module.exports = {
  authExtController: new AuthExtController(),
  getUserFromAuthHeader,
};

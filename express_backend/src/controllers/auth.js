const { v4: uuidv4 } = require('uuid');

/**
 * In-memory mock store for users and tokens.
 * This is ONLY for development/testing and will reset on server restart.
 */
const mockDB = {
  users: [
    // Default demo users
    { id: 'u1', name: 'Alice Applicant', email: 'alice@example.com', role: 'applicant' },
    { id: 'u2', name: 'Evan Employer', email: 'evan@company.com', role: 'employer' }
  ],
  tokens: {} // token -> userId
};

class AuthController {
  /**
   * POST /login
   * Accepts email and password (ignored for mock).
   * Returns a mock JWT-like token and user info if email exists.
   */
  login(req, res) {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }
    const user = mockDB.users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = `mock-token-${uuidv4()}`;
    mockDB.tokens[token] = user.id;

    return res.status(200).json({
      token,
      tokenType: 'Bearer',
      expiresIn: 3600,
      user
    });
  }

  /**
   * POST /register
   * Accepts name, email, password, role (applicant|employer)
   * Returns created user and token.
   */
  register(req, res) {
    const { name, email, password, role } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email and password are required' });
    }
    if (role && !['applicant', 'employer'].includes(role)) {
      return res.status(400).json({ message: 'role must be applicant or employer if provided' });
    }
    const exists = mockDB.users.find(u => u.email === email);
    if (exists) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }
    const id = uuidv4();
    const newUser = { id, name, email, role: role || 'applicant' };
    mockDB.users.push(newUser);

    const token = `mock-token-${uuidv4()}`;
    mockDB.tokens[token] = id;

    return res.status(201).json({
      token,
      tokenType: 'Bearer',
      expiresIn: 3600,
      user: newUser
    });
  }
}

module.exports = {
  authController: new AuthController(),
  mockAuthDB: mockDB
};

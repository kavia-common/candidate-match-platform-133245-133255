const { v4: uuidv4 } = require('uuid');

/**
 * In-memory mock store for users.
 */
const mockUsers = [
  { id: 'u1', name: 'Alice Applicant', email: 'alice@example.com', role: 'applicant' },
  { id: 'u2', name: 'Evan Employer', email: 'evan@company.com', role: 'employer' }
];

class UsersController {
  /**
   * GET /users
   * Optional query: role filter.
   */
  list(req, res) {
    const { role } = req.query || {};
    if (!role) {
      return res.status(200).json({ users: mockUsers });
    }
    const filtered = mockUsers.filter(u => u.role === role);
    return res.status(200).json({ users: filtered });
  }

  /**
   * POST /users
   * Creates a mock user: { name, email, role }
   */
  create(req, res) {
    const { name, email, role } = req.body || {};
    if (!name || !email) {
      return res.status(400).json({ message: 'name and email are required' });
    }
    if (role && !['applicant', 'employer', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'role must be applicant, employer, or admin if provided' });
    }
    const exists = mockUsers.find(u => u.email === email);
    if (exists) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }
    const newUser = { id: uuidv4(), name, email, role: role || 'applicant' };
    mockUsers.push(newUser);
    return res.status(201).json({ user: newUser });
  }

  /**
   * GET /users/:id
   * Returns a user by id if found.
   */
  getById(req, res) {
    const { id } = req.params;
    const user = mockUsers.find(u => u.id === id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ user });
  }
}

module.exports = {
  usersController: new UsersController(),
  mockUsers
};

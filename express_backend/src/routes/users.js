const express = require('express');
const { usersController } = require('../controllers/users');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management APIs
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: List users
 *     description: Returns mock users. Optional role filter.
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [applicant, employer, admin]
 *         description: Filter by role
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/users', usersController.list.bind(usersController));

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create user
 *     description: Creates a mock user.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jane Doe
 *               email:
 *                 type: string
 *                 example: jane@example.com
 *               role:
 *                 type: string
 *                 enum: [applicant, employer, admin]
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Missing/invalid fields
 *       409:
 *         description: Email already exists
 */
router.post('/users', usersController.create.bind(usersController));

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Returns a user object by id if found.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
router.get('/users/:id', usersController.getById.bind(usersController));

module.exports = router;

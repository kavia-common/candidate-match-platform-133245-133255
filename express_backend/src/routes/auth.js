const express = require('express');
const { authController } = require('../controllers/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login with email and password
 *     description: Returns a mock token and user info for an existing user email.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: alice@example.com
 *               password:
 *                 type: string
 *                 example: secret
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', authController.login.bind(authController));

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a mock user and returns a token and the user object.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Alice Applicant
 *               email:
 *                 type: string
 *                 example: alice@example.com
 *               password:
 *                 type: string
 *                 example: secret
 *               role:
 *                 type: string
 *                 enum: [applicant, employer]
 *     responses:
 *       201:
 *         description: User registered
 *       400:
 *         description: Missing/invalid fields
 *       409:
 *         description: Email already exists
 */
router.post('/register', authController.register.bind(authController));

module.exports = router;

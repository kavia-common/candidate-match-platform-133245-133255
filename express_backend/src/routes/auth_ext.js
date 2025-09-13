const express = require('express');
const { authExtController } = require('../controllers/auth_ext');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Get current user profile (mock)
 *     description: Requires Authorization header with mock Bearer token returned from /login or /register.
 *     tags: [Auth]
 *     responses:
 *       200: { description: Current user }
 *       401: { description: Unauthorized }
 */
router.get('/me', authExtController.me.bind(authExtController));

module.exports = router;

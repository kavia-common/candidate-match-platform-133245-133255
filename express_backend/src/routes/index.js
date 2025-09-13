const express = require('express');
const healthController = require('../controllers/health');

// Feature routers
const authRoutes = require('./auth');
const assessmentsRoutes = require('./assessments');
const jobsRoutes = require('./jobs');
const usersRoutes = require('./users');

const router = express.Router();

// Health endpoint
/**
 * @swagger
 * /:
 *   get:
 *     summary: Health endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service health check passed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Service is healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: development
 */
router.get('/', healthController.check.bind(healthController));

// Mount feature routes
router.use('/', authRoutes);
router.use('/', assessmentsRoutes);
router.use('/', jobsRoutes);
router.use('/', usersRoutes);

module.exports = router;

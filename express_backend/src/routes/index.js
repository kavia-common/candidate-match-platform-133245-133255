const express = require('express');
const healthController = require('../controllers/health');

// Feature routers
const authRoutes = require('./auth');
const authExtRoutes = require('./auth_ext');
const assessmentsRoutes = require('./assessments');
const assessmentsExtRoutes = require('./assessments_ext');
const jobsRoutes = require('./jobs');
const jobsExtRoutes = require('./jobs_ext');
const usersRoutes = require('./users');
const candidatesRoutes = require('./candidates');

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
router.use('/', authExtRoutes);
router.use('/', assessmentsRoutes);
router.use('/', assessmentsExtRoutes);
router.use('/', jobsRoutes);
router.use('/', jobsExtRoutes);
router.use('/', usersRoutes);
router.use('/', candidatesRoutes);

module.exports = router;

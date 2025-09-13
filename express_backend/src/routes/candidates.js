const express = require('express');
const { candidatesController } = require('../controllers/candidates');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Candidates
 *   description: Candidate listing and matching APIs
 */

/**
 * @swagger
 * /candidates:
 *   get:
 *     summary: List candidates
 *     tags: [Candidates]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *       - in: query
 *         name: minScore
 *         schema: { type: number }
 *       - in: query
 *         name: skills
 *         schema: { type: string }
 *         description: Comma separated skills
 *     responses:
 *       200: { description: List of candidates }
 */
router.get('/candidates', candidatesController.list.bind(candidatesController));

/**
 * @swagger
 * /candidates/{id}:
 *   get:
 *     summary: Get candidate by ID
 *     tags: [Candidates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Candidate }
 *       404: { description: Not found }
 */
router.get('/candidates/:id', candidatesController.getById.bind(candidatesController));

/**
 * @swagger
 * /candidates/match/{jobId}:
 *   get:
 *     summary: Get matched candidates for a job
 *     tags: [Candidates]
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: minScore
 *         schema: { type: number }
 *       - in: query
 *         name: skills
 *         schema: { type: string }
 *     responses:
 *       200: { description: Matches }
 */
router.get('/candidates/match/:jobId', candidatesController.matchForJob.bind(candidatesController));

module.exports = router;

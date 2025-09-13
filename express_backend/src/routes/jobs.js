const express = require('express');
const { jobsController } = require('../controllers/jobs');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Job listing and matching APIs
 */

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Get job listings
 *     description: Returns a list of mock job objects. Use query param q to filter by title/company/location.
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search term
 *     responses:
 *       200:
 *         description: List of jobs
 */
router.get('/jobs', jobsController.list.bind(jobsController));

/**
 * @swagger
 * /jobs/match:
 *   get:
 *     summary: Get matched jobs for a candidate
 *     description: Matches jobs based on optional score and skills provided.
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: candidateId
 *         required: true
 *         schema:
 *           type: string
 *         description: Candidate user ID
 *       - in: query
 *         name: score
 *         schema:
 *           type: number
 *         description: Candidate score used for simple matching
 *       - in: query
 *         name: skills
 *         schema:
 *           type: string
 *         description: Comma-separated skill list, e.g., "React,Node.js"
 *     responses:
 *       200:
 *         description: Matched jobs
 *       400:
 *         description: Missing candidateId
 */
router.get('/jobs/match', jobsController.match.bind(jobsController));

module.exports = router;

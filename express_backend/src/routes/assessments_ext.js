const express = require('express');
const { assessmentsController } = require('../controllers/assessments');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Assessments
 *   description: Candidate assessment APIs
 */

/**
 * @swagger
 * /assessments/list:
 *   get:
 *     summary: List available assessments
 *     tags: [Assessments]
 *     responses:
 *       200:
 *         description: List of assessment definitions
 */
router.get('/assessments/list', assessmentsController.list.bind(assessmentsController));

/**
 * @swagger
 * /assessments/{id}:
 *   get:
 *     summary: Get assessment definition by ID
 *     tags: [Assessments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Assessment definition
 *       404:
 *         description: Assessment not found
 */
router.get('/assessments/:id', assessmentsController.getById.bind(assessmentsController));

/**
 * @swagger
 * /assessments:
 *   post:
 *     summary: Submit assessment answers
 *     description: Accepts candidate answers and returns a mock graded result with breakdown.
 *     tags: [Assessments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [candidateId, assessmentId, answers]
 *             properties:
 *               candidateId:
 *                 type: string
 *               assessmentId:
 *                 type: string
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionId:
 *                       type: string
 *                     selectedIndex:
 *                       type: number
 *     responses:
 *       201:
 *         description: Assessment submitted
 *       400:
 *         description: Invalid or missing fields
 */
router.post('/assessments', assessmentsController.submit.bind(assessmentsController));

/**
 * @swagger
 * /assessments/results:
 *   get:
 *     summary: Get latest assessment results for candidate
 *     description: Returns chart-friendly data for the latest attempt.
 *     tags: [Assessments]
 *     parameters:
 *       - in: query
 *         name: candidateId
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: assessmentId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Results
 *       400:
 *         description: Missing parameters
 */
router.get('/assessments/results', assessmentsController.results.bind(assessmentsController));

module.exports = router;

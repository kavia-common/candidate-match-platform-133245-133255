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
 *                 example: u1
 *               assessmentId:
 *                 type: string
 *                 example: a1
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionId:
 *                       type: string
 *                     selectedIndex:
 *                       type: number
 *               score:
 *                 type: number
 *                 example: 75
 *     responses:
 *       201:
 *         description: Assessment submitted
 *       400:
 *         description: Invalid or missing fields
 */
router.post('/assessments', assessmentsController.submit.bind(assessmentsController));

module.exports = router;

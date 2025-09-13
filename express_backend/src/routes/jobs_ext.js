const express = require('express');
const { jobsExtController } = require('../controllers/jobs_ext');
const { jobsController } = require('../controllers/jobs');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Job listing, matching and management APIs
 */

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     summary: Get job details by ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Job details }
 *       404: { description: Not found }
 */
router.get('/jobs/:id', jobsExtController.details.bind(jobsExtController));

/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Create a new job (employer)
 *     tags: [Jobs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, company, location]
 *             properties:
 *               title: { type: string }
 *               company: { type: string }
 *               location: { type: string }
 *               skills: { type: array, items: { type: string } }
 *               minScore: { type: number }
 *               employerId: { type: string }
 *     responses:
 *       201: { description: Created }
 *       400: { description: Missing fields }
 */
router.post('/jobs', jobsExtController.create.bind(jobsExtController));

/**
 * @swagger
 * /jobs/{id}:
 *   put:
 *     summary: Update a job
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200: { description: Updated }
 *       404: { description: Not found }
 */
router.put('/jobs/:id', jobsExtController.update.bind(jobsExtController));

/**
 * @swagger
 * /jobs/{id}:
 *   delete:
 *     summary: Delete a job
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Deleted }
 *       404: { description: Not found }
 */
router.delete('/jobs/:id', jobsExtController.remove.bind(jobsExtController));

/**
 * @swagger
 * /jobs/{id}/apply:
 *   post:
 *     summary: Apply to a job
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [candidateId]
 *             properties:
 *               candidateId: { type: string }
 *     responses:
 *       201: { description: Applied }
 *       400: { description: Missing candidateId }
 *       409: { description: Already applied }
 */
router.post('/jobs/:id/apply', jobsExtController.apply.bind(jobsExtController));

/**
 * @swagger
 * /jobs/{id}/applicants:
 *   get:
 *     summary: Get applicants for a job
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Applicants list }
 */
router.get('/jobs/:id/applicants', jobsExtController.applicants.bind(jobsExtController));

/**
 * @swagger
 * /applications/{applicationId}/status:
 *   patch:
 *     summary: Update application status
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [applied, shortlisted, rejected, hired]
 *     responses:
 *       200: { description: Updated }
 *       400: { description: Invalid status }
 *       404: { description: Application not found }
 */
router.patch('/applications/:applicationId/status', jobsExtController.updateApplicationStatus.bind(jobsExtController));

// Keep existing listing and match routes mounted from the base jobs router
router.get('/jobs', jobsController.list.bind(jobsController));
router.get('/jobs/match', jobsController.match.bind(jobsController));

module.exports = router;

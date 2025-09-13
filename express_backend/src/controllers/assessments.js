const { v4: uuidv4 } = require('uuid');

/**
 * In-memory mock store for assessments.
 */
const mockAssessments = [];

class AssessmentsController {
  /**
   * POST /assessments
   * Accepts: { candidateId, assessmentId?, answers, score? }
   * Returns a mock grading response.
   */
  submit(req, res) {
    const { candidateId, answers, assessmentId, score } = req.body || {};
    if (!candidateId || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'candidateId and answers[] are required' });
    }
    const id = uuidv4();
    // For mocking: derive score if not provided
    const computedScore = typeof score === 'number' ? score : Math.min(100, Math.round(answers.length * 10));
    const record = {
      id,
      candidateId,
      assessmentId: assessmentId || `mock-assessment-${Math.ceil(Math.random() * 10)}`,
      answersCount: answers.length,
      score: computedScore,
      submittedAt: new Date().toISOString()
    };
    mockAssessments.push(record);

    return res.status(201).json({
      message: 'Assessment submitted successfully',
      assessment: record
    });
  }
}

module.exports = {
  assessmentsController: new AssessmentsController(),
  mockAssessments
};

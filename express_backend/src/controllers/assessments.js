const { v4: uuidv4 } = require('uuid');

/**
 * In-memory mock store for assessments and definitions.
 */
const mockAssessments = [];
const mockAssessmentDefinitions = [
  {
    id: 'a1',
    title: 'Frontend Basics',
    description: 'Assess core frontend skills.',
    durationMinutes: 20,
    questions: [
      {
        id: 'q1',
        type: 'mcq',
        question: 'Which HTML tag is used to define an unordered list?',
        options: ['<ol>', '<ul>', '<li>', '<dl>'],
        correctOptionIndex: 1,
      },
      {
        id: 'q2',
        type: 'mcq',
        question: 'Which CSS property is used to change text color?',
        options: ['font-color', 'text-color', 'color', 'font-style'],
        correctOptionIndex: 2,
      },
      {
        id: 'q3',
        type: 'mcq',
        question: 'Which hook lets you add state to a function component in React?',
        options: ['useState', 'useMemo', 'useContext', 'useRef'],
        correctOptionIndex: 0,
      },
    ],
  },
  {
    id: 'a2',
    title: 'Backend Fundamentals',
    description: 'Assess basic backend & Node.js knowledge.',
    durationMinutes: 25,
    questions: [
      {
        id: 'q4',
        type: 'mcq',
        question: 'Which HTTP method is idempotent?',
        options: ['POST', 'PUT', 'PATCH', 'CONNECT'],
        correctOptionIndex: 1,
      },
      {
        id: 'q5',
        type: 'mcq',
        question: 'Which of the following stores data in JSON-like documents?',
        options: ['PostgreSQL', 'MongoDB', 'MySQL', 'SQLite'],
        correctOptionIndex: 1,
      },
      {
        id: 'q6',
        type: 'mcq',
        question: 'In Express, which object represents the response?',
        options: ['req', 'res', 'next', 'app'],
        correctOptionIndex: 1,
      },
    ],
  },
];

class AssessmentsController {
  // PUBLIC_INTERFACE
  list(req, res) {
    /** Returns available assessment definitions (without correct answers). */
    const list = mockAssessmentDefinitions.map(({ id, title, description, durationMinutes, questions }) => ({
      id,
      title,
      description,
      durationMinutes,
      questionCount: questions.length,
    }));
    return res.status(200).json({ assessments: list });
  }

  // PUBLIC_INTERFACE
  getById(req, res) {
    /** Returns a single assessment definition (without revealing answer keys). */
    const { id } = req.params;
    const found = mockAssessmentDefinitions.find((a) => a.id === id);
    if (!found) return res.status(404).json({ message: 'Assessment not found' });
    const sanitized = {
      id: found.id,
      title: found.title,
      description: found.description,
      durationMinutes: found.durationMinutes,
      questions: found.questions.map((q) => ({
        id: q.id,
        type: q.type,
        question: q.question,
        options: q.options,
      })),
    };
    return res.status(200).json({ assessment: sanitized });
  }

  /**
   * POST /assessments
   * Accepts: { candidateId, assessmentId, answers: [{questionId, selectedIndex}] }
   * Returns scoring details and stores submission in memory.
   */
  // PUBLIC_INTERFACE
  submit(req, res) {
    const { candidateId, answers, assessmentId, score } = req.body || {};
    if (!candidateId || !Array.isArray(answers) || !assessmentId) {
      return res
        .status(400)
        .json({ message: 'candidateId, assessmentId and answers[] are required' });
    }
    const def = mockAssessmentDefinitions.find((a) => a.id === assessmentId);
    if (!def) {
      return res.status(400).json({ message: 'Unknown assessmentId' });
    }

    // Grade answers
    let correct = 0;
    const breakdown = def.questions.map((q) => {
      const given = answers.find((a) => a.questionId === q.id);
      const selectedIndex = given ? Number(given.selectedIndex) : null;
      const isCorrect = selectedIndex === q.correctOptionIndex;
      if (isCorrect) correct += 1;
      return {
        questionId: q.id,
        selectedIndex,
        correct: isCorrect,
        correctOptionIndex: q.correctOptionIndex, // can be omitted in real environment
      };
    });

    const computedScore =
      typeof score === 'number'
        ? score
        : Math.round((correct / def.questions.length) * 100);

    const id = uuidv4();
    const record = {
      id,
      candidateId,
      assessmentId,
      answersCount: answers.length,
      correctCount: correct,
      totalQuestions: def.questions.length,
      score: computedScore,
      submittedAt: new Date().toISOString(),
      breakdown,
    };
    mockAssessments.push(record);

    return res.status(201).json({
      message: 'Assessment submitted successfully',
      assessment: record,
    });
  }

  // PUBLIC_INTERFACE
  results(req, res) {
    /**
     * Returns aggregated results in a chart-friendly format for a candidate+assessment.
     * Query: ?candidateId=...&assessmentId=...
     * Mock returns: distribution and per-question correctness.
     */
    const { candidateId, assessmentId } = req.query || {};
    if (!candidateId || !assessmentId) {
      return res
        .status(400)
        .json({ message: 'candidateId and assessmentId are required' });
    }
    const submissions = mockAssessments.filter(
      (r) => r.candidateId === candidateId && r.assessmentId === assessmentId
    );
    if (submissions.length === 0) {
      return res.status(200).json({
        candidateId,
        assessmentId,
        attempts: 0,
        latest: null,
        chart: {
          labels: [],
          datasets: [],
        },
      });
    }
    const latest = submissions[submissions.length - 1];

    // Build chart data: simple donut-style of correct vs wrong
    const wrong = latest.totalQuestions - latest.correctCount;
    const chart = {
      labels: ['Correct', 'Wrong'],
      datasets: [
        {
          label: 'Answers',
          data: [latest.correctCount, wrong],
          backgroundColor: ['#22c55e', '#ef4444'],
        },
      ],
    };

    // Per-question correctness (bar)
    const perQuestion = {
      labels: latest.breakdown.map((b) => b.questionId),
      datasets: [
        {
          label: 'Correct (1) / Wrong (0)',
          data: latest.breakdown.map((b) => (b.correct ? 1 : 0)),
          backgroundColor: latest.breakdown.map((b) => (b.correct ? '#22c55e' : '#ef4444')),
        },
      ],
    };

    return res.status(200).json({
      candidateId,
      assessmentId,
      attempts: submissions.length,
      latest,
      chart,
      perQuestion,
    });
  }
}

module.exports = {
  assessmentsController: new AssessmentsController(),
  mockAssessments,
  mockAssessmentDefinitions,
};

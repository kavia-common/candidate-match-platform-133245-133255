const { v4: uuidv4 } = require('uuid');

/**
 * In-memory mock store for jobs.
 */
const mockJobs = [
  { id: 'j1', title: 'Frontend Developer', company: 'TechNova', location: 'Remote', skills: ['React', 'JavaScript', 'CSS'], minScore: 50 },
  { id: 'j2', title: 'Backend Engineer', company: 'DataForge', location: 'NYC', skills: ['Node.js', 'Express', 'SQL'], minScore: 60 },
  { id: 'j3', title: 'Full Stack Developer', company: 'CloudLabs', location: 'SF', skills: ['Node.js', 'React', 'PostgreSQL'], minScore: 70 },
  { id: 'j4', title: 'DevOps Engineer', company: 'OpsWorks', location: 'Remote', skills: ['AWS', 'Docker', 'CI/CD'], minScore: 65 }
];

class JobsController {
  /**
   * GET /jobs
   * Optional query: q for search filter on title/company/location.
   */
  list(req, res) {
    const { q } = req.query || {};
    if (!q) {
      return res.status(200).json({ jobs: mockJobs });
    }
    const term = String(q).toLowerCase();
    const filtered = mockJobs.filter(j =>
      j.title.toLowerCase().includes(term) ||
      j.company.toLowerCase().includes(term) ||
      j.location.toLowerCase().includes(term)
    );
    return res.status(200).json({ jobs: filtered });
  }

  /**
   * GET /jobs/match?candidateId=xxx
   * Simple matching: uses optional score and skills in query to choose jobs.
   * For now, accept skills as comma-separated and score as number.
   */
  match(req, res) {
    const { candidateId, score, skills } = req.query || {};
    if (!candidateId) {
      return res.status(400).json({ message: 'candidateId is required' });
    }
    const numericScore = score ? Number(score) : 60; // default mock score
    const skillList = typeof skills === 'string' && skills.length > 0
      ? skills.split(',').map(s => s.trim().toLowerCase())
      : [];

    const matched = mockJobs
      .map(job => {
        const meetsScore = numericScore >= job.minScore;
        const hasSkills = skillList.length === 0
          ? true
          : job.skills.some(s => skillList.includes(s.toLowerCase()));
        const weight = (meetsScore ? 1 : 0) + (hasSkills ? 1 : 0);
        return { ...job, matchWeight: weight };
      })
      .filter(j => j.matchWeight > 0)
      .sort((a, b) => b.matchWeight - a.matchWeight);

    return res.status(200).json({
      candidateId,
      score: numericScore,
      skills: skillList,
      matches: matched
    });
  }
}

module.exports = {
  jobsController: new JobsController(),
  mockJobs
};

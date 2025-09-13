const { v4: uuidv4 } = require('uuid');

const mockCandidates = [
  { id: 'u1', name: 'Alice Applicant', email: 'alice@example.com', role: 'applicant', skills: ['React', 'Node.js'], score: 78 },
  { id: 'u3', name: 'Bob Builder', email: 'bob@example.com', role: 'applicant', skills: ['Docker', 'AWS'], score: 65 },
  { id: 'u4', name: 'Cara Coder', email: 'cara@example.com', role: 'applicant', skills: ['TypeScript', 'React'], score: 88 },
];

class CandidatesController {
  // PUBLIC_INTERFACE
  list(req, res) {
    /** Returns candidate list with optional search/skill filter */
    const { q, minScore, skills } = req.query || {};
    let list = [...mockCandidates];

    if (q) {
      const term = String(q).toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(term) || c.email.toLowerCase().includes(term));
    }
    if (minScore) {
      const m = Number(minScore);
      list = list.filter((c) => Number(c.score) >= m);
    }
    if (skills) {
      const sArr = String(skills)
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
      list = list.filter((c) => c.skills.some((s) => sArr.includes(String(s).toLowerCase())));
    }

    return res.status(200).json({ candidates: list });
  }

  // PUBLIC_INTERFACE
  getById(req, res) {
    /** Return candidate by id */
    const { id } = req.params;
    const c = mockCandidates.find((x) => x.id === id);
    if (!c) return res.status(404).json({ message: 'Candidate not found' });
    return res.status(200).json({ candidate: c });
  }

  // PUBLIC_INTERFACE
  matchForJob(req, res) {
    /** Simple match: filter by job minScore and overlapping skills */
    const { jobId } = req.params;
    const { minScore, skills } = req.query || {};
    let list = [...mockCandidates];

    const m = typeof minScore === 'undefined' ? 60 : Number(minScore);
    list = list.filter((c) => Number(c.score) >= m);
    const sArr =
      typeof skills === 'string' && skills.length
        ? skills.split(',').map((s) => s.trim().toLowerCase())
        : [];

    if (sArr.length) {
      list = list.filter((c) => c.skills.some((s) => sArr.includes(String(s).toLowerCase())));
    }

    // add a simple weight
    list = list
      .map((c) => ({
        ...c,
        matchWeight:
          (Number(c.score) >= m ? 1 : 0) +
          (sArr.length ? (c.skills.some((s) => sArr.includes(String(s).toLowerCase())) ? 1 : 0) : 0),
      }))
      .sort((a, b) => b.matchWeight - a.matchWeight);

    return res.status(200).json({ jobId, matches: list });
  }
}

module.exports = {
  candidatesController: new CandidatesController(),
  mockCandidates,
};

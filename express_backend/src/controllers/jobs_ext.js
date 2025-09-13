const { v4: uuidv4 } = require('uuid');
const { mockJobs } = require('./jobs');

/**
 * Extra in-memory structures for job management (employer side)
 */
const mockApplications = [
  // { id, jobId, candidateId, status, appliedAt }
  { id: 'app1', jobId: 'j1', candidateId: 'u1', status: 'applied', appliedAt: new Date().toISOString() },
];
const jobOwners = {
  // jobId -> employerId
  j1: 'u2',
  j2: 'u2',
};

class JobsExtController {
  // PUBLIC_INTERFACE
  create(req, res) {
    /** Employer posts a new job */
    const { title, company, location, skills, minScore, employerId } = req.body || {};
    if (!title || !company || !location) {
      return res.status(400).json({ message: 'title, company, location are required' });
    }
    const id = uuidv4();
    const job = {
      id,
      title,
      company,
      location,
      skills: Array.isArray(skills) ? skills : [],
      minScore: typeof minScore === 'number' ? minScore : 50,
    };
    mockJobs.push(job);
    if (employerId) jobOwners[id] = employerId;
    return res.status(201).json({ job });
  }

  // PUBLIC_INTERFACE
  update(req, res) {
    /** Employer updates an existing job by ID */
    const { id } = req.params;
    const idx = mockJobs.findIndex((j) => j.id === id);
    if (idx === -1) return res.status(404).json({ message: 'Job not found' });

    const { title, company, location, skills, minScore } = req.body || {};
    if (title) mockJobs[idx].title = title;
    if (company) mockJobs[idx].company = company;
    if (location) mockJobs[idx].location = location;
    if (Array.isArray(skills)) mockJobs[idx].skills = skills;
    if (typeof minScore === 'number') mockJobs[idx].minScore = minScore;

    return res.status(200).json({ job: mockJobs[idx] });
  }

  // PUBLIC_INTERFACE
  remove(req, res) {
    /** Employer deletes a job by ID */
    const { id } = req.params;
    const idx = mockJobs.findIndex((j) => j.id === id);
    if (idx === -1) return res.status(404).json({ message: 'Job not found' });
    const removed = mockJobs.splice(idx, 1)[0];
    return res.status(200).json({ job: removed, message: 'Deleted' });
  }

  // PUBLIC_INTERFACE
  details(req, res) {
    /** Get job details by ID */
    const { id } = req.params;
    const job = mockJobs.find((j) => j.id === id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    return res.status(200).json({ job });
  }

  // PUBLIC_INTERFACE
  applicants(req, res) {
    /** Employer fetches applicants for a job */
    const { id } = req.params;
    const applicants = mockApplications.filter((a) => a.jobId === id);
    return res.status(200).json({ applicants });
  }

  // PUBLIC_INTERFACE
  apply(req, res) {
    /** Candidate applies to a job */
    const { id } = req.params; // jobId
    const { candidateId } = req.body || {};
    if (!candidateId) return res.status(400).json({ message: 'candidateId is required' });
    const exists = mockApplications.find((a) => a.jobId === id && a.candidateId === candidateId);
    if (exists) return res.status(409).json({ message: 'Already applied' });

    const record = {
      id: uuidv4(),
      jobId: id,
      candidateId,
      status: 'applied',
      appliedAt: new Date().toISOString(),
    };
    mockApplications.push(record);
    return res.status(201).json({ application: record });
  }

  // PUBLIC_INTERFACE
  updateApplicationStatus(req, res) {
    /** Employer updates candidate application status: shortlist/reject/hire */
    const { applicationId } = req.params;
    const { status } = req.body || {};
    if (!status || !['applied', 'shortlisted', 'rejected', 'hired'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const app = mockApplications.find((a) => a.id === applicationId);
    if (!app) return res.status(404).json({ message: 'Application not found' });
    app.status = status;
    app.updatedAt = new Date().toISOString();
    return res.status(200).json({ application: app });
  }
}

module.exports = {
  jobsExtController: new JobsExtController(),
  mockApplications,
  jobOwners,
};

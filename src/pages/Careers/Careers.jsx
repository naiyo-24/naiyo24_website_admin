import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, RefreshCw } from 'lucide-react';
import { API_URL } from '../../config/api';

export default function Careers() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('tech');
  const [location, setLocation] = useState('');
  const [employmentType, setEmploymentType] = useState('Full-Time');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/jobs/`);
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/jobs/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          location,
          employment_type: employmentType,
          status: 'Open',
          description
        })
      });

      if (response.ok) {
        fetchJobs();
        setIsModalOpen(false);
        setTitle('');
        setCategory('tech');
        setLocation('');
        setEmploymentType('Full-Time');
        setDescription('');
      } else {
        alert('Failed to add job position');
      }
    } catch (error) {
      console.error('Error adding job:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this position?')) return;
    try {
      const response = await fetch(`${API_URL}/jobs/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchJobs();
      } else {
        alert('Failed to delete job position');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  return (
    <div className="page-content">
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Careers (Open Positions)</h1>
          <p>Manage job postings and open roles.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="neo-button" onClick={fetchJobs} disabled={loading}>
            <RefreshCw size={18} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '6px' }} />
            Refresh
          </button>
          <button className="neo-button primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '6px' }} />
            Add Open Position
          </button>
        </div>
      </header>

      <div className="neo-table-container">
        {loading ? (
          <p style={{ padding: '24px' }}>Loading open positions...</p>
        ) : (
          <table className="neo-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Category</th>
                <th>Location</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: 'var(--muted)' }}>No open positions found.</td>
                </tr>
              ) : (
                jobs.map(job => (
                  <tr key={job.id}>
                    <td><strong>{job.title}</strong></td>
                    <td>{job.category === 'tech' ? 'Tech Role' : 'Non-Tech Role'}</td>
                    <td>{job.location}</td>
                    <td><span style={{ backgroundColor: 'var(--black)', color: 'var(--white)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>{job.employment_type}</span></td>
                    <td><span style={{ color: job.status === 'Open' ? 'green' : 'gray', fontWeight: 'bold' }}>{job.status}</span></td>
                    <td>
                      <div className="action-buttons">
                        <button className="icon-btn" onClick={() => handleDelete(job.id)} style={{ color: 'red' }}><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '24px' }}>
          <div className="neo-card" style={{ width: '100%', maxWidth: '700px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2>Add Open Position</h2>
              <button className="icon-btn" onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleAddJob}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Job Title</label>
                  <input type="text" className="neo-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Frontend Developer (React)" required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Job Category</label>
                  <select className="neo-input" required value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="tech">Tech Role (Requires GitHub Profile in Application)</option>
                    <option value="non-tech">Non-Tech Role (Standard Application)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Location</label>
                  <input type="text" className="neo-input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Kolkata, India / Remote" required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Employment Type</label>
                  <select className="neo-input" required value={employmentType} onChange={(e) => setEmploymentType(e.target.value)}>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Job Description</label>
                <textarea className="neo-input" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Join our core engineering team to build high-performance..." required></textarea>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '24px', borderTop: 'var(--border-thin) solid var(--border-light)' }}>
                <button type="button" className="neo-button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="neo-button primary">Publish Position</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

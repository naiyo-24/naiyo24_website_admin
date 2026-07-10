import React, { useState, useEffect } from 'react';
import { Eye, Download, Github, Linkedin, Globe, X, RefreshCw } from 'lucide-react';
import { API_URL } from '../../config/api';

export default function Applications() {
  const [selectedApp, setSelectedApp] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/apply`);
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      } else {
        console.error('Failed to fetch applications');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Career Applications</h1>
          <p>Review applicants for open positions.</p>
        </div>
        <button className="neo-button" onClick={fetchApplications} disabled={loading}>
          <RefreshCw size={18} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '6px' }} />
          Refresh
        </button>
      </header>
      
      <div className="neo-table-container">
        {loading ? (
          <p style={{ padding: '24px' }}>Loading applications...</p>
        ) : (
          <table className="neo-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Applicant</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: 'var(--muted)' }}>No applications found.</td>
                </tr>
              ) : (
                applications.map(app => (
                  <tr key={app.id}>
                    <td>#{app.id}</td>
                    <td><strong>{app.full_name}</strong></td>
                    <td>{app.email}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="icon-btn" onClick={() => setSelectedApp(app)} title="View Details"><Eye size={18} /></button>
                        <button className="icon-btn" onClick={() => window.open(`${API_URL}/${app.cv_path}`, '_blank')} style={{ color: 'var(--accent)' }} title="Download Resume"><Download size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {selectedApp && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '24px' }}>
          <div className="neo-card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'center' }}>
              <div>
                <h2>Application Details</h2>
              </div>
              <button className="icon-btn" onClick={() => setSelectedApp(null)}><X size={24} /></button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              <div>
                <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginBottom: '4px' }}>Applicant Info</p>
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{selectedApp.full_name}</p>
                <p>{selectedApp.email}</p>
                <p>{selectedApp.phone || 'No phone provided'}</p>
              </div>
              <div>
                <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginBottom: '4px' }}>Links & Profiles</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedApp.github && (
                    <a href={selectedApp.github} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--black)', textDecoration: 'none', fontWeight: 'bold' }}>
                      <Github size={16} /> GitHub Profile
                    </a>
                  )}
                  {selectedApp.linkedin && (
                    <a href={selectedApp.linkedin} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0a66c2', textDecoration: 'none', fontWeight: 'bold' }}>
                      <Linkedin size={16} /> LinkedIn Profile
                    </a>
                  )}
                  {selectedApp.portfolio && (
                    <a href={selectedApp.portfolio} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--black)', textDecoration: 'none', fontWeight: 'bold' }}>
                      <Globe size={16} /> Portfolio / Website
                    </a>
                  )}
                </div>
              </div>
            </div>

            {selectedApp.cover_letter && (
              <div style={{ marginBottom: '24px' }}>
                <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginBottom: '8px' }}>Cover Letter / Note</p>
                <div style={{ padding: '16px', backgroundColor: 'var(--bg-primary)', border: 'var(--border-thin) solid var(--border-light)', borderRadius: 'var(--radius-xs)' }}>
                  {selectedApp.cover_letter}
                </div>
              </div>
            )}

            <div style={{ marginBottom: '24px' }}>
              <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginBottom: '8px' }}>Resume</p>
              <button onClick={() => window.open(`${API_URL}/${selectedApp.cv_path}`, '_blank')} className="neo-button" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Download size={16} /> Download CV
              </button>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px', borderTop: 'var(--border-thin) solid var(--border-light)' }}>
              <button className="neo-button primary" onClick={() => setSelectedApp(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

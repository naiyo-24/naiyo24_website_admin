import React, { useState, useEffect } from 'react';
import { Eye, Check, RefreshCw } from 'lucide-react';
import { API_URL } from '../../config/api';

export default function Queries() {
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/query`);
      if (response.ok) {
        const data = await response.json();
        setQueries(data);
      } else {
        console.error('Failed to fetch queries');
      }
    } catch (error) {
      console.error('Error fetching queries:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Customer Queries</h1>
          <p>Manage and respond to "Get In Touch" submissions.</p>
        </div>
        <button className="neo-button" onClick={fetchQueries} disabled={loading}>
          <RefreshCw size={18} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '6px' }} />
          Refresh
        </button>
      </header>
      
      <div className="neo-table-container">
        {loading ? (
          <p style={{ padding: '24px' }}>Loading queries...</p>
        ) : (
          <table className="neo-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {queries.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: 'var(--muted)' }}>No queries found.</td>
                </tr>
              ) : (
                queries.map(q => (
                  <tr key={q.id}>
                    <td>#{q.id}</td>
                    <td><strong>{q.name}</strong><br/><small style={{ color: 'var(--muted)' }}>{q.email}</small></td>
                    <td>{q.subject || 'No Subject'}</td>
                    <td>
                      <span style={{ 
                        color: '#d97706',
                        fontWeight: 'bold',
                        backgroundColor: '#fef3c7',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: '1px solid currentColor'
                      }}>
                        Received
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="icon-btn" onClick={() => setSelectedQuery(q)} title="View Details"><Eye size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {selectedQuery && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="neo-card" style={{ width: '100%', maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2>Query Details</h2>
              <button className="icon-btn" onClick={() => setSelectedQuery(null)}>✕</button>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>From</p>
              <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{selectedQuery.name} ({selectedQuery.email})</p>
              <p>{selectedQuery.phone}</p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>Subject</p>
              <p style={{ fontWeight: 'bold' }}>{selectedQuery.subject || 'No Subject'}</p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginBottom: '8px' }}>Message</p>
              <div style={{ padding: '16px', backgroundColor: 'var(--bg-primary)', border: 'var(--border-thin) solid var(--border-light)', borderRadius: 'var(--radius-xs)' }}>
                {selectedQuery.message}
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="neo-button primary" onClick={() => setSelectedQuery(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Mail, Trash2, RefreshCw } from 'lucide-react';
import { API_URL } from '../../config/api';

export default function Newsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/newsletter`);
      if (response.ok) {
        const data = await response.json();
        setSubscribers(data);
      } else {
        console.error('Failed to fetch subscribers');
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Newsletter Subscribers</h1>
          <p>Manage people who subscribed to updates.</p>
        </div>
        <button className="neo-button" onClick={fetchSubscribers} disabled={loading}>
          <RefreshCw size={18} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '6px' }} />
          Refresh
        </button>
      </header>
      
      <div className="neo-table-container">
        {loading ? (
          <p style={{ padding: '24px' }}>Loading subscribers...</p>
        ) : (
          <table className="neo-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Email Address</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '24px', color: 'var(--muted)' }}>No subscribers found.</td>
                </tr>
              ) : (
                subscribers.map(sub => (
                  <tr key={sub.id}>
                    <td>#{sub.id}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Mail size={16} color="var(--muted)" />
                        <strong>{sub.email}</strong>
                      </div>
                    </td>
                    <td><span style={{ color: 'green', fontWeight: 'bold' }}>Active</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, X, RefreshCw } from 'lucide-react';
import { API_URL } from '../../config/api';

export default function LegalDocs() {
  const [activeTab, setActiveTab] = useState('terms'); // 'terms' or 'privacy'
  const [docId, setDocId] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('July 10, 2026');
  const [loading, setLoading] = useState(true);
  
  const [sections, setSections] = useState([]);

  useEffect(() => {
    fetchDocument();
  }, [activeTab]);

  const fetchDocument = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${activeTab}`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setDocId(data[0].id);
          try {
            const parsed = JSON.parse(data[0].content);
            setSections(Array.isArray(parsed) ? parsed : []);
          } catch (e) {
            setSections([{ id: 1, title: 'Document', content: data[0].content }]);
          }
        } else {
          setDocId(null);
          setSections([]);
        }
      }
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSection = () => {
    setSections([...sections, { id: Date.now(), title: '', content: '' }]);
  };

  const handleRemoveSection = (id) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const handleUpdateSection = (id, field, value) => {
    setSections(sections.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSave = async () => {
    const payload = { content: JSON.stringify(sections) };
    
    try {
      let response;
      if (docId) {
        response = await fetch(`${API_URL}/${activeTab}/${docId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch(`${API_URL}/${activeTab}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (response.ok) {
        alert('Changes Published!');
        fetchDocument();
      } else {
        alert('Failed to publish changes');
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving document');
    }
  };

  return (
    <div className="page-content">
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Legal Documents</h1>
          <p>Manage your Terms & Conditions and Privacy Policy content.</p>
        </div>
        <button className="neo-button" onClick={fetchDocument} disabled={loading}>
          <RefreshCw size={18} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '6px' }} />
          Refresh
        </button>
      </header>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <button 
          className={`neo-button ${activeTab === 'terms' ? 'primary' : ''}`}
          onClick={() => setActiveTab('terms')}
        >
          Terms & Conditions
        </button>
        <button 
          className={`neo-button ${activeTab === 'privacy' ? 'primary' : ''}`}
          onClick={() => setActiveTab('privacy')}
        >
          Privacy Policy
        </button>
      </div>

      <div className="neo-card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2>{activeTab === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}</h2>
          <div>
            <label style={{ fontSize: '0.9rem', fontWeight: 'bold', marginRight: '8px' }}>Last Updated:</label>
            <input 
              type="text" 
              className="neo-input" 
              style={{ width: 'auto', display: 'inline-block', padding: '4px 8px' }} 
              value={lastUpdated}
              onChange={(e) => setLastUpdated(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <p>Loading document...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {sections.length === 0 && <p style={{ color: 'var(--muted)' }}>No sections added yet.</p>}
            
            {sections.map((section, index) => (
              <div key={section.id} style={{ border: '2px solid var(--border-light)', padding: '24px', borderRadius: 'var(--radius-md)', position: 'relative' }}>
                <button 
                  className="icon-btn" 
                  style={{ position: 'absolute', top: '16px', right: '16px', color: 'red' }} 
                  onClick={() => handleRemoveSection(section.id)}
                  title="Delete Section"
                >
                  <Trash2 size={20} />
                </button>
                
                <div style={{ marginBottom: '16px', paddingRight: '40px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Section Title</label>
                  <input 
                    type="text" 
                    className="neo-input" 
                    style={{ fontSize: '1.2rem', fontWeight: 'bold' }}
                    placeholder="e.g. 1. Introduction" 
                    value={section.title}
                    onChange={(e) => handleUpdateSection(section.id, 'title', e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Section Content</label>
                  <textarea 
                    className="neo-input" 
                    rows="6"
                    placeholder="Enter section content here..."
                    value={section.content}
                    onChange={(e) => handleUpdateSection(section.id, 'content', e.target.value)}
                  ></textarea>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '24px', borderTop: '2px solid var(--border-light)' }}>
          <button className="neo-button" onClick={handleAddSection} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} /> Add New Section
          </button>
          
          <button className="neo-button primary" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Save size={18} /> Publish Document
          </button>
        </div>
      </div>
    </div>
  );
}

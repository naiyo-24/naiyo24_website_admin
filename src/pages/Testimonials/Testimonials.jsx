import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Star, RefreshCw } from 'lucide-react';
import { API_URL } from '../../config/api';

export default function Testimonials() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [rating, setRating] = useState('5'); // Default to 5 stars

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/testimonials`);
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data);
      } else {
        console.error('Failed to fetch testimonials');
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTestimonial = async (e) => {
    e.preventDefault();
    try {
      const stars = '⭐'.repeat(Number(rating));
      const combinedDesignation = `${serviceType} ${stars}`;
      
      const response = await fetch(`${API_URL}/testimonials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          author_name: authorName, 
          content, 
          designation: combinedDesignation,
          company: '' // We don't need company anymore based on design
        })
      });
      if (response.ok) {
        fetchTestimonials();
        setIsModalOpen(false);
        setAuthorName('');
        setContent('');
        setServiceType('');
        setRating('5');
      } else {
        alert('Failed to add testimonial');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding testimonial');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      const response = await fetch(`${API_URL}/testimonials/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchTestimonials();
      } else {
        alert('Failed to delete testimonial');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="page-content">
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Testimonials</h1>
          <p>Manage client reviews and feedback.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="neo-button" onClick={fetchTestimonials} disabled={loading}>
            <RefreshCw size={18} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '6px' }} />
            Refresh
          </button>
          <button className="neo-button primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '6px' }} />
            Add Testimonial
          </button>
        </div>
      </header>

      <div className="neo-table-container">
        {loading ? (
          <p style={{ padding: '24px' }}>Loading testimonials...</p>
        ) : (
          <table className="neo-table">
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Service & Rating</th>
                <th>Review Snippet</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: 'var(--muted)' }}>No testimonials found.</td>
                </tr>
              ) : (
                testimonials.map((testimonial) => (
                  <tr key={testimonial.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', backgroundColor: 'var(--black)', color: 'var(--white)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>
                          {testimonial.author_name ? testimonial.author_name.substring(0, 2).toUpperCase() : ''}
                        </div>
                        <strong>{testimonial.author_name || ''}</strong>
                      </div>
                    </td>
                    <td>{testimonial.designation}</td>
                    <td>"{testimonial.content ? testimonial.content.substring(0, 50) : ''}{testimonial.content && testimonial.content.length > 50 ? '...' : ''}"</td>
                    <td>
                      <div className="action-buttons">
                        <button className="icon-btn" onClick={() => handleDelete(testimonial.id)} style={{ color: 'red' }}><Trash2 size={18} /></button>
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
          <div className="neo-card" style={{ width: '100%', maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2>Add Testimonial</h2>
              <button type="button" className="icon-btn" onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleAddTestimonial}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Client Name</label>
                  <input type="text" className="neo-input" value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="e.g. SAYAR PAUL" required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Service / Subtitle</label>
                  <input type="text" className="neo-input" value={serviceType} onChange={(e) => setServiceType(e.target.value)} placeholder="e.g. Website & UI/UX" required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Star Rating</label>
                  <select className="neo-input" value={rating} onChange={(e) => setRating(e.target.value)} style={{ padding: '8px' }}>
                    <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                    <option value="3">⭐⭐⭐ (3 Stars)</option>
                    <option value="2">⭐⭐ (2 Stars)</option>
                    <option value="1">⭐ (1 Star)</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Review Text</label>
                <textarea className="neo-input" rows="5" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Enter the full testimonial..." required></textarea>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '24px', borderTop: 'var(--border-thin) solid var(--border-light)' }}>
                <button type="button" className="neo-button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="neo-button primary">Publish Testimonial</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

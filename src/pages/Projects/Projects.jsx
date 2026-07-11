import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, RefreshCw } from 'lucide-react';
import { API_URL } from '../../config/api';

export default function Projects() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [client, setClient] = useState('');
  const [timeline, setTimeline] = useState('');
  const [servicesUsed, setServicesUsed] = useState('');
  const [challenge, setChallenge] = useState('');
  const [solution, setSolution] = useState('');
  const [galleryFiles, setGalleryFiles] = useState([]); // Multiple files
  const [technologies, setTechnologies] = useState(''); // comma-separated names

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/projects`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        console.error('Failed to fetch projects');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setLink('');
    setClient('');
    setTimeline('');
    setServicesUsed('');
    setChallenge('');
    setSolution('');
    setGalleryFiles([]);
    setTechnologies('');
    setEditingId(null);
    
    // Reset file input UI
    const fileInput = document.getElementById('gallery-upload');
    if (fileInput) fileInput.value = '';
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project) => {
    setEditingId(project.id);
    setTitle(project.title || '');
    setDescription(project.description || '');
    setLink(project.link || '');
    setClient(project.client || '');
    setTimeline(project.timeline || '');
    setServicesUsed(project.services_used || '');
    setChallenge(project.challenge || '');
    setSolution(project.solution || '');
    
    // Parse technologies JSON
    let techStr = '';
    try {
      if (project.technologies_json) {
        const arr = JSON.parse(project.technologies_json);
        techStr = arr.join(', ');
      }
    } catch (e) {}
    setTechnologies(techStr);

    setIsModalOpen(true);
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // PUT Request (JSON)
        const techArray = technologies.split(',').map(s => s.trim()).filter(Boolean);
        const payload = {
          title,
          description,
          link: link || null,
          client: client || null,
          timeline: timeline || null,
          services_used: servicesUsed || null,
          challenge: challenge || null,
          solution: solution || null,
          technologies_json: techArray.length > 0 ? JSON.stringify(techArray) : null,
          image_url: '',
          gallery_json: projects.find(p => p.id === editingId)?.gallery_json || null
        };

        const response = await fetch(`${API_URL}/projects/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          fetchProjects();
          setIsModalOpen(false);
          resetForm();
        } else {
          const errText = await response.text();
          console.error(errText);
          alert('Failed to update project');
        }
      } else {
        // POST Request (FormData)
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if (link) formData.append('link', link);
        if (client) formData.append('client', client);
        if (timeline) formData.append('timeline', timeline);
        if (servicesUsed) formData.append('services_used', servicesUsed);
        if (challenge) formData.append('challenge', challenge);
        if (solution) formData.append('solution', solution);
        
        const techArray = technologies.split(',').map(s => s.trim()).filter(Boolean);
        if (techArray.length > 0) {
          formData.append('technologies_json', JSON.stringify(techArray));
        }

        Array.from(galleryFiles).forEach(file => {
          formData.append('gallery_files', file);
        });

        const response = await fetch(`${API_URL}/projects`, {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          fetchProjects();
          setIsModalOpen(false);
          resetForm();
        } else {
          alert('Failed to add project');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving project');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      const response = await fetch(`${API_URL}/projects/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchProjects();
      } else {
        alert('Failed to delete project');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="page-content">
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Projects</h1>
          <p>Manage your portfolio projects and case studies.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="neo-button" onClick={fetchProjects} disabled={loading}>
            <RefreshCw size={18} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '6px' }} />
            Refresh
          </button>
          <button className="neo-button primary" onClick={handleOpenAdd}>
            <Plus size={18} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '6px' }} />
            Add Project
          </button>
        </div>
      </header>

      <div className="neo-table-container">
        {loading ? (
          <p style={{ padding: '24px' }}>Loading projects...</p>
        ) : (
          <table className="neo-table">
            <thead>
              <tr>
                <th>Project Title</th>
                <th>Link</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: 'var(--muted)' }}>No projects found.</td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id}>
                    <td>
                      <strong>{project.title}</strong>
                    </td>
                    <td>{project.link ? <a href={project.link} target="_blank" rel="noreferrer" style={{ color: 'var(--black)' }}>View Link</a> : 'N/A'}</td>
                    <td><span style={{ color: 'green', fontWeight: 'bold' }}>Published</span></td>
                    <td>
                      <div className="action-buttons">
                        <button className="icon-btn" onClick={() => handleOpenEdit(project)} style={{ color: 'var(--black)', marginRight: '12px' }}>
                          <Edit2 size={18} />
                        </button>
                        <button className="icon-btn" onClick={() => handleDelete(project.id)} style={{ color: 'red' }}>
                          <Trash2 size={18} />
                        </button>
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
          <div className="neo-card" style={{ width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2>{editingId ? 'Edit Project' : 'Add New Project'}</h2>
              <button type="button" className="icon-btn" onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSaveProject}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Project Title</label>
                  <input type="text" className="neo-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. ATTENDX 24" required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Live Website URL</label>
                  <input type="url" className="neo-input" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Short Description / Subtitle</label>
                <input type="text" className="neo-input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Workforce Management Platform" required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px', padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--gray-500)' }}>CLIENT</label>
                  <input type="text" className="neo-input" value={client} onChange={(e) => setClient(e.target.value)} placeholder="Internal Product" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--gray-500)' }}>TIMELINE</label>
                  <input type="text" className="neo-input" value={timeline} onChange={(e) => setTimeline(e.target.value)} placeholder="3 Months" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--gray-500)' }}>SERVICES</label>
                  <input type="text" className="neo-input" value={servicesUsed} onChange={(e) => setServicesUsed(e.target.value)} placeholder="UI/UX Design, Dev..." />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>The Challenge</label>
                  <textarea className="neo-input" rows="4" value={challenge} onChange={(e) => setChallenge(e.target.value)} placeholder="Describe the challenge..." />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>The Solution</label>
                  <textarea className="neo-input" rows="4" value={solution} onChange={(e) => setSolution(e.target.value)} placeholder="Describe the solution..." />
                </div>
              </div>

              {!editingId && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Product Gallery (Upload images and videos)</label>
                  <input type="file" id="gallery-upload" multiple accept="image/*,video/*" className="neo-input" onChange={(e) => setGalleryFiles(e.target.files)} />
                </div>
              )}

              {editingId && (
                <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-xs)', fontSize: '0.9rem', color: 'var(--gray-500)' }}>
                  Note: Project gallery files cannot be edited directly. To upload new mockups or videos, please create a new project.
                </div>
              )}

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Technologies Used (Comma-separated tags)</label>
                <input type="text" className="neo-input" value={technologies} onChange={(e) => setTechnologies(e.target.value)} placeholder="React, Node.js, PostgreSQL" />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '24px', borderTop: 'var(--border-thin) solid var(--border-light)' }}>
                <button type="button" className="neo-button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="neo-button primary">{editingId ? 'Save Changes' : 'Publish Project'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

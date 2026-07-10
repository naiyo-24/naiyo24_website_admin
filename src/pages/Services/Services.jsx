import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, PlusCircle, MinusCircle, RefreshCw } from 'lucide-react';
import { API_URL } from '../../config/api';

export default function Services() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  // Form state
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [iconFile, setIconFile] = useState(null);
  const [timeline, setTimeline] = useState('');
  const [pricingModel, setPricingModel] = useState('');
  const [whatYouGet, setWhatYouGet] = useState('');
  
  // Dynamic Arrays State
  const [keyCapabilities, setKeyCapabilities] = useState(['']);
  const [executionRoadmap, setExecutionRoadmap] = useState([
    { step_number: '01', title: '', description: '' }
  ]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/services`);
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      } else {
        console.error('Failed to fetch services');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setTagline('');
    setDescription('');
    setIconFile(null);
    setTimeline('');
    setPricingModel('');
    setWhatYouGet('');
    setKeyCapabilities(['']);
    setExecutionRoadmap([{ step_number: '01', title: '', description: '' }]);
    setEditingId(null);
    
    // Reset file input UI if present
    const fileInput = document.getElementById('icon-upload');
    if (fileInput) fileInput.value = '';
  };

  const handleOpenEdit = (service) => {
    setEditingId(service.id);
    setName(service.name || '');
    setTagline(service.tagline || '');
    setDescription(service.description || '');
    setIconFile(null); // Can't easily prefill file input, they can upload a new one
    setTimeline(service.timeline || '');
    setPricingModel(service.pricing_model || '');
    setWhatYouGet(service.what_you_get || '');
    
    // Safely set dynamic arrays
    setKeyCapabilities(service.key_capabilities && service.key_capabilities.length > 0 ? service.key_capabilities : ['']);
    
    let initialRoadmap = [{ step_number: '01', title: '', description: '' }];
    if (service.execution_roadmap && service.execution_roadmap.length > 0) {
      initialRoadmap = service.execution_roadmap.map((item, index) => ({
        step_number: item.step_number || String(index + 1).padStart(2, '0'),
        title: item.title || item.step || '',
        description: item.description || ''
      }));
    }
    setExecutionRoadmap(initialRoadmap);
    
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    
    formData.append('name', name);
    formData.append('description', description);
    
    if (tagline) formData.append('tagline', tagline);
    if (timeline) formData.append('timeline', timeline);
    if (pricingModel) formData.append('pricing_model', pricingModel);
    if (whatYouGet) formData.append('what_you_get', whatYouGet);
    if (iconFile) formData.append('icon', iconFile);

    // Clean up empty items before sending
    const cleanedCapabilities = keyCapabilities.filter(cap => cap.trim() !== '');
    const cleanedRoadmap = executionRoadmap.filter(step => step.title.trim() !== '' || step.description.trim() !== '');
    
    if (cleanedCapabilities.length > 0) {
      formData.append('key_capabilities', JSON.stringify(cleanedCapabilities));
    }
    
    if (cleanedRoadmap.length > 0) {
      formData.append('execution_roadmap', JSON.stringify(cleanedRoadmap));
    }

    try {
      const url = editingId ? `${API_URL}/services/${editingId}` : `${API_URL}/services`;
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        // Do NOT set Content-Type header; the browser will set it to multipart/form-data with the correct boundary
        body: formData
      });
      
      if (response.ok) {
        fetchServices();
        setIsModalOpen(false);
        resetForm();
      } else {
        const errText = await response.text();
        console.error('Backend Error:', errText);
        alert(`Failed to ${editingId ? 'update' : 'add'} service. Error: ${errText}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`Error ${editingId ? 'updating' : 'adding'} service`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      const response = await fetch(`${API_URL}/services/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchServices();
      } else {
        alert('Failed to delete service');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // --- Dynamic Array Handlers ---
  const updateCapability = (index, value) => {
    const newCaps = [...keyCapabilities];
    newCaps[index] = value;
    setKeyCapabilities(newCaps);
  };
  const addCapability = () => setKeyCapabilities([...keyCapabilities, '']);
  const removeCapability = (index) => setKeyCapabilities(keyCapabilities.filter((_, i) => i !== index));

  const updateRoadmap = (index, field, value) => {
    const newRoadmap = [...executionRoadmap];
    newRoadmap[index][field] = value;
    setExecutionRoadmap(newRoadmap);
  };
  const addRoadmapStep = () => {
    const nextStepNum = (executionRoadmap.length + 1).toString().padStart(2, '0');
    setExecutionRoadmap([...executionRoadmap, { step_number: nextStepNum, title: '', description: '' }]);
  };
  const removeRoadmapStep = (index) => setExecutionRoadmap(executionRoadmap.filter((_, i) => i !== index));


  return (
    <div className="page-content">
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Services</h1>
          <p>Manage your service catalog and offerings.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="neo-button" onClick={fetchServices} disabled={loading}>
            <RefreshCw size={18} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '6px' }} />
            Refresh
          </button>
          <button className="neo-button primary" onClick={handleOpenAdd}>
            <Plus size={18} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '6px' }} />
            Add Service
          </button>
        </div>
      </header>

      <div className="neo-table-container">
        {loading ? (
          <p style={{ padding: '24px' }}>Loading services...</p>
        ) : (
          <table className="neo-table">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '24px', color: 'var(--muted)' }}>No services found.</td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr key={service.id}>
                    <td>
                      <strong>{service.name}</strong>
                    </td>
                    <td><span style={{ color: 'green', fontWeight: 'bold' }}>Active</span></td>
                    <td>
                      <div className="action-buttons">
                        <button className="icon-btn" onClick={() => handleOpenEdit(service)} style={{ color: 'var(--primary)' }}><Edit2 size={18} /></button>
                        <button className="icon-btn" onClick={() => handleDelete(service.id)} style={{ color: 'red' }}><Trash2 size={18} /></button>
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
          <div className="neo-card" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexShrink: 0 }}>
              <h2>{editingId ? 'Edit Service' : 'Add New Service'}</h2>
              <button type="button" className="icon-btn" onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSaveService} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
              <div style={{ paddingRight: '8px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Service Name *</label>
                    <input type="text" className="neo-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. MARKETING" required />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Upload Icon (Optional)</label>
                    <input id="icon-upload" type="file" accept="image/*" className="neo-input" onChange={(e) => setIconFile(e.target.files[0])} style={{ padding: '8px' }} />
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Tagline</label>
                  <input type="text" className="neo-input" value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Short, catchy description" />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Full Description *</label>
                  <textarea className="neo-input" rows="3" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detailed service description..." required></textarea>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Timeline</label>
                    <input type="text" className="neo-input" value={timeline} onChange={(e) => setTimeline(e.target.value)} placeholder="e.g. Ongoing (Monthly Retainers)" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Pricing Model</label>
                    <input type="text" className="neo-input" value={pricingModel} onChange={(e) => setPricingModel(e.target.value)} placeholder="e.g. Monthly retainer based on media budget" />
                  </div>
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>What You Get</label>
                  <textarea className="neo-input" rows="2" value={whatYouGet} onChange={(e) => setWhatYouGet(e.target.value)} placeholder="Interactive Performance Dashboards, Lead Lists..."></textarea>
                </div>

                <div style={{ marginBottom: '24px', padding: '16px', border: 'var(--border-thin) solid var(--border-light)', borderRadius: '4px' }}>
                  <label style={{ display: 'block', marginBottom: '12px', fontWeight: 'bold' }}>Key Capabilities</label>
                  {keyCapabilities.map((cap, index) => (
                    <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <input type="text" className="neo-input" value={cap} onChange={(e) => updateCapability(index, e.target.value)} placeholder={`Capability ${index + 1}`} style={{ flex: 1 }} />
                      <button type="button" className="icon-btn" onClick={() => removeCapability(index)} disabled={keyCapabilities.length === 1} style={{ color: 'red' }}><MinusCircle size={20}/></button>
                    </div>
                  ))}
                  <button type="button" onClick={addCapability} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}><PlusCircle size={16}/> Add Capability</button>
                </div>

                <div style={{ marginBottom: '24px', padding: '16px', border: 'var(--border-thin) solid var(--border-light)', borderRadius: '4px' }}>
                  <label style={{ display: 'block', marginBottom: '12px', fontWeight: 'bold' }}>Execution Roadmap</label>
                  {executionRoadmap.map((step, index) => (
                    <div key={index} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'flex-start', paddingBottom: '12px', borderBottom: index < executionRoadmap.length - 1 ? '1px dashed #ccc' : 'none' }}>
                      <input type="text" className="neo-input" value={step.step_number} onChange={(e) => updateRoadmap(index, 'step_number', e.target.value)} placeholder="01" style={{ width: '60px' }} />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <input type="text" className="neo-input" value={step.title} onChange={(e) => updateRoadmap(index, 'title', e.target.value)} placeholder="Step Title" />
                        <textarea className="neo-input" rows="2" value={step.description} onChange={(e) => updateRoadmap(index, 'description', e.target.value)} placeholder="Step Description"></textarea>
                      </div>
                      <button type="button" className="icon-btn" onClick={() => removeRoadmapStep(index)} disabled={executionRoadmap.length === 1} style={{ color: 'red', marginTop: '8px' }}><MinusCircle size={20}/></button>
                    </div>
                  ))}
                  <button type="button" onClick={addRoadmapStep} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}><PlusCircle size={16}/> Add Step</button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '24px', marginTop: 'auto', flexShrink: 0, borderTop: 'var(--border-thin) solid var(--border-light)', backgroundColor: 'var(--bg-card)' }}>
                <button type="button" className="neo-button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="neo-button primary">{editingId ? 'Save Changes' : 'Publish Service'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

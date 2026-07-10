import React, { useState, useEffect } from 'react';
import { Save, Mail, Phone, MapPin, Linkedin, Twitter, Instagram, Facebook, Key, UserPlus, Trash2, Eye, EyeOff } from 'lucide-react';
import { API_URL } from '../../config/api';

export default function Settings() {
  const [formData, setFormData] = useState({
    contact_email: '',
    contact_phone: '',
    address: '',
    linkedin: '',
    twitter: '',
    instagram: '',
    facebook: '',
    youtube: '',
    github: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [adminUsers, setAdminUsers] = useState([]);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', role: 'Editor', password: 'password123' });

  useEffect(() => {
    fetchSettings();
    fetchAdmins();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${API_URL}/settings`);
      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/admins`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAdminUsers(data);
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/settings`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          contact_email: formData.contact_email,
          contact_phone: formData.contact_phone,
          address: formData.address,
          linkedin: formData.linkedin,
          twitter: formData.twitter,
          instagram: formData.instagram,
          facebook: formData.facebook,
          youtube: formData.youtube,
          github: formData.github
        })
      });
      if (response.ok) {
        alert('Settings saved successfully!');
      } else {
        alert('Failed to save settings');
      }
    } catch (error) {
      alert('Error saving settings');
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/admins/me/password`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });
      
      if (response.ok) {
        alert('Password updated successfully!');
        setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
      } else {
        const err = await response.text();
        alert('Failed to update password: ' + err);
      }
    } catch (error) {
      alert('Error updating password');
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if (!newAdmin.name || !newAdmin.email) return;
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/admins`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newAdmin)
      });
      
      if (response.ok) {
        fetchAdmins();
        setNewAdmin({ name: '', email: '', role: 'Editor', password: 'password123' });
        alert('Admin added successfully! Default password is "password123"');
      } else {
        const err = await response.text();
        alert('Failed to add admin: ' + err);
      }
    } catch (error) {
      alert('Error adding admin');
    }
  };

  const handleRemoveAdmin = async (id) => {
    if (!window.confirm("Are you sure you want to remove this admin?")) return;
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/admins/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchAdmins();
      } else {
        const err = await response.text();
        alert('Failed to remove admin: ' + err);
      }
    } catch (error) {
      alert('Error removing admin');
    }
  };

  return (
    <div className="page-content">
      <header className="page-header">
        <h1>Global Settings</h1>
        <p>Configure your main website information, social links, and admin access.</p>
      </header>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '800px' }}>
        
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Contact Information Section */}
          <div className="neo-card">
            <h2 style={{ marginBottom: '24px', borderBottom: '2px solid var(--border-light)', paddingBottom: '12px' }}>Contact Information</h2>
            <p style={{ color: 'var(--muted)', marginBottom: '24px', fontSize: '0.9rem' }}>
              This information will be displayed on the footer and contact page of the main website.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Support Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', zIndex: 10 }} />
                  <input type="email" name="contact_email" value={formData.contact_email || ''} onChange={handleChange} className="neo-input" style={{ paddingLeft: '40px' }} required />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Official Phone</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', zIndex: 10 }} />
                  <input type="text" name="contact_phone" value={formData.contact_phone || ''} onChange={handleChange} className="neo-input" style={{ paddingLeft: '40px' }} required />
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Office Address</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '16px', color: 'var(--muted)', zIndex: 10 }} />
                <textarea name="address" value={formData.address} onChange={handleChange} className="neo-input" rows="3" style={{ paddingLeft: '40px' }} required></textarea>
              </div>
            </div>
          </div>

          {/* Social Media Links Section */}
          <div className="neo-card">
            <h2 style={{ marginBottom: '24px', borderBottom: '2px solid var(--border-light)', paddingBottom: '12px' }}>Social Media Links</h2>
            <p style={{ color: 'var(--muted)', marginBottom: '24px', fontSize: '0.9rem' }}>
              Update the URLs for your social media profiles. Leave a field blank to hide that icon on the website.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>LinkedIn</label>
                <div style={{ position: 'relative' }}>
                  <Linkedin size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#0a66c2', zIndex: 10 }} />
                  <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} className="neo-input" style={{ paddingLeft: '40px' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Instagram</label>
                <div style={{ position: 'relative' }}>
                  <Instagram size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#e1306c', zIndex: 10 }} />
                  <input type="url" name="instagram" value={formData.instagram} onChange={handleChange} className="neo-input" style={{ paddingLeft: '40px' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Facebook</label>
                <div style={{ position: 'relative' }}>
                  <Facebook size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#1877f2', zIndex: 10 }} />
                  <input type="url" name="facebook" value={formData.facebook} onChange={handleChange} className="neo-input" style={{ paddingLeft: '40px' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Twitter / X</label>
                <div style={{ position: 'relative' }}>
                  <Twitter size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#1da1f2', zIndex: 10 }} />
                  <input type="url" name="twitter" value={formData.twitter} onChange={handleChange} className="neo-input" style={{ paddingLeft: '40px' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>YouTube</label>
                <div style={{ position: 'relative' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                  <input type="url" name="youtube" value={formData.youtube || ''} onChange={handleChange} className="neo-input" style={{ paddingLeft: '40px' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>GitHub</label>
                <div style={{ position: 'relative' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.24c3-.3 6-1.5 6-6.6a5.4 5.4 0 0 0-1.5-3.8 5.4 5.4 0 0 0-.1-3.8s-1.2-.4-3.9 1.4a13.3 13.3 0 0 0-7 0C6.2 1.2 5 1.6 5 1.6a5.4 5.4 0 0 0-.1 3.8A5.4 5.4 0 0 0 3 9.2c0 5.1 3 6.3 6 6.6a4.8 4.8 0 0 0-1 3.24v4"></path><path d="M3 19c3.2-1.2 5-1.2 5-1.2"></path></svg>
                  <input type="url" name="github" value={formData.github || ''} onChange={handleChange} className="neo-input" style={{ paddingLeft: '40px' }} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button type="submit" className="neo-button primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', padding: '12px 24px' }}>
              <Save size={20} /> Save All Settings
            </button>
          </div>
        </form>

        {/* Change Password Section */}
        <form onSubmit={handlePasswordSave} className="neo-card">
          <h2 style={{ marginBottom: '24px', borderBottom: '2px solid var(--border-light)', paddingBottom: '12px' }}>Change Password</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '24px', fontSize: '0.9rem' }}>
            Update the password for your current admin account.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', maxWidth: '400px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Current Password</label>
              <div style={{ position: 'relative' }}>
                <Key size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', zIndex: 10 }} />
                <input type={showCurrentPassword ? "text" : "password"} name="currentPassword" value={formData.currentPassword} onChange={handleChange} className="neo-input" style={{ paddingLeft: '40px', paddingRight: '40px' }} required />
                <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="icon-btn" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}>
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>New Password</label>
              <div style={{ position: 'relative' }}>
                <Key size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', zIndex: 10 }} />
                <input type={showNewPassword ? "text" : "password"} name="newPassword" value={formData.newPassword} onChange={handleChange} className="neo-input" style={{ paddingLeft: '40px', paddingRight: '40px' }} required />
                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="icon-btn" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}>
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Confirm New Password</label>
              <div style={{ position: 'relative' }}>
                <Key size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', zIndex: 10 }} />
                <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="neo-input" style={{ paddingLeft: '40px', paddingRight: '40px' }} required />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="icon-btn" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}>
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>
          <div style={{ marginTop: '24px' }}>
            <button type="submit" className="neo-button primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Key size={18} /> Update Password
            </button>
          </div>
        </form>

        {/* Manage Admin Users Section */}
        <div className="neo-card" style={{ marginTop: '16px' }}>
          <h2 style={{ marginBottom: '24px', borderBottom: '2px solid var(--border-light)', paddingBottom: '12px' }}>Manage Admin Users</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '24px', fontSize: '0.9rem' }}>
            Add or remove users who have access to this admin panel.
          </p>

          <div className="neo-table-container" style={{ marginBottom: '32px' }}>
            <table className="neo-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {adminUsers.map(user => (
                  <tr key={user.id}>
                    <td><strong>{user.name}</strong></td>
                    <td>{user.email}</td>
                    <td>
                      <span style={{ 
                        backgroundColor: user.role === 'Super Admin' ? 'var(--black)' : 'var(--bg-secondary)', 
                        color: user.role === 'Super Admin' ? 'var(--white)' : 'var(--body)', 
                        padding: '4px 12px', 
                        borderRadius: '12px', 
                        fontSize: '0.8rem', 
                        fontWeight: 'bold' 
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      {user.role !== 'Super Admin' && (
                        <button className="icon-btn" style={{ color: 'red' }} onClick={() => handleRemoveAdmin(user.id)} title="Remove Admin">
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <form onSubmit={handleAddAdmin} style={{ backgroundColor: 'var(--bg-secondary)', padding: '24px', borderRadius: 'var(--radius-md)', border: 'var(--border-thin) solid var(--border-light)' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Add New Admin</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '16px', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}>Name</label>
                <input type="text" className="neo-input" value={newAdmin.name} onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})} placeholder="e.g. John Doe" required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}>Email Address</label>
                <input type="email" className="neo-input" value={newAdmin.email} onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})} placeholder="john@naiyo24.com" required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}>Role</label>
                <select className="neo-input" value={newAdmin.role} onChange={(e) => setNewAdmin({...newAdmin, role: e.target.value})}>
                  <option value="Editor">Editor</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>
              <button type="submit" className="neo-button" style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '48px' }}>
                <UserPlus size={18} /> Add User
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

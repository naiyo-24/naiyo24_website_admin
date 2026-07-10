import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, MessageSquare, Briefcase, FileText, Settings, Layers, Star, Mail, Menu, LogOut } from 'lucide-react'
import logoImage from '../../../assets/naiyo_black_nobg.png'

export default function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen }) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigate = useNavigate();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const handleNavClick = () => {
    if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  return (
    <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`} style={{ width: isCollapsed ? '80px' : '280px', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column' }}>
      <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px' }}>
        {!isCollapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={logoImage} alt="Naiyo24 Logo" className="sidebar-logo" style={{ maxWidth: '80px' }} />
            <div style={{ fontFamily: '"Jaldi", sans-serif', lineHeight: 1.1 }}>
              <div style={{ fontSize: '1.4rem', fontWeight: '700' }}>Naiyo24</div>
              <div style={{ fontSize: '0.9rem', fontWeight: '400' }}>Private Limited</div>
            </div>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className="icon-btn" 
          style={{ margin: isCollapsed ? '0 auto' : '0' }}
        >
          <Menu size={24} color="var(--black)" />
        </button>
      </div>
      <nav className="sidebar-nav" style={{ padding: isCollapsed ? '24px 8px' : '24px 16px', flex: 1, overflowY: 'auto' }}>
        <Link to="/" className={`nav-item ${isActive('/')}`} onClick={handleNavClick}>
          <LayoutDashboard size={20} />
          {!isCollapsed && <span>Dashboard</span>}
        </Link>
        
        <div className="nav-section">{!isCollapsed ? 'Content (Push)' : '...'}</div>
        <Link to="/projects" className={`nav-item ${isActive('/projects')}`} onClick={handleNavClick}>
          <Layers size={20} />
          {!isCollapsed && <span>Projects</span>}
        </Link>
        <Link to="/services" className={`nav-item ${isActive('/services')}`} onClick={handleNavClick}>
          <Briefcase size={20} />
          {!isCollapsed && <span>Services</span>}
        </Link>
        <Link to="/testimonials" className={`nav-item ${isActive('/testimonials')}`} onClick={handleNavClick}>
          <Star size={20} />
          {!isCollapsed && <span>Testimonials</span>}
        </Link>
        <Link to="/careers" className={`nav-item ${isActive('/careers')}`} onClick={handleNavClick}>
          <Users size={20} />
          {!isCollapsed && <span>Careers</span>}
        </Link>
        <Link to="/legal" className={`nav-item ${isActive('/legal')}`} onClick={handleNavClick}>
          <FileText size={20} />
          {!isCollapsed && <span>Legal Docs</span>}
        </Link>

        <div className="nav-section">{!isCollapsed ? 'Data (Get)' : '...'}</div>
        <Link to="/queries" className={`nav-item ${isActive('/queries')}`} onClick={handleNavClick}>
          <MessageSquare size={20} />
          {!isCollapsed && <span>Queries</span>}
        </Link>
        <Link to="/applications" className={`nav-item ${isActive('/applications')}`} onClick={handleNavClick}>
          <Briefcase size={20} />
          {!isCollapsed && <span>Applications</span>}
        </Link>
        <Link to="/newsletter" className={`nav-item ${isActive('/newsletter')}`} onClick={handleNavClick}>
          <Mail size={20} />
          {!isCollapsed && <span>Newsletter</span>}
        </Link>

        <div className="nav-section">{!isCollapsed ? 'System' : '...'}</div>
        <Link to="/settings" className={`nav-item ${isActive('/settings')}`} onClick={handleNavClick}>
          <Settings size={20} />
          {!isCollapsed && <span>Settings</span>}
        </Link>
      </nav>
      
      <div style={{ padding: isCollapsed ? '16px 8px' : '16px', borderTop: '2px solid var(--border-light)' }}>
        <button 
          onClick={handleLogout}
          className="nav-item" 
          style={{ width: '100%', background: 'transparent', border: 'none', color: 'red', marginTop: 0 }}
        >
          <LogOut size={20} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}

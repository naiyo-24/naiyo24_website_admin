import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import Sidebar from '../../components/Sidebar/Sidebar'
import logoImage from '../../../assets/naiyo24_logo.jpeg'

export default function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="admin-layout">
      {/* Mobile Header */}
      <div className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={logoImage} alt="Naiyo24 Logo" style={{ height: '32px' }} />
          <span style={{ fontFamily: '"Jaldi", sans-serif', fontWeight: '700', fontSize: '1.2rem', color: 'var(--heading)' }}>Naiyo24</span>
        </div>
        <button className="icon-btn" onClick={() => setIsMobileMenuOpen(true)}>
          <Menu size={24} color="var(--black)" />
        </button>
      </div>

      <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

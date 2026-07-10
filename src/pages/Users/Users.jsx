import React from 'react'

export default function Users() {
  return (
    <div className="page-content">
      <header className="page-header">
        <h1>User Management</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
          View and manage registered users and their roles.
        </p>
      </header>
      
      <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>No users data available.</p>
      </div>
    </div>
  )
}

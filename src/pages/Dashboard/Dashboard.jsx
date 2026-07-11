import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    queries: 0,
    subscribers: 0,
    applications: 0,
    projects: 0,
    services: 0,
    testimonials: 0,
    careers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [
        queriesRes,
        subsRes,
        appsRes,
        projectsRes,
        servicesRes,
        testimonialsRes,
        careersRes
      ] = await Promise.all([
        fetch(`${API_URL}/query`),
        fetch(`${API_URL}/newsletter`),
        fetch(`${API_URL}/apply`),
        fetch(`${API_URL}/projects`),
        fetch(`${API_URL}/services`),
        fetch(`${API_URL}/testimonials`),
        fetch(`${API_URL}/jobs/`)
      ]);

      const queries = queriesRes.ok ? await queriesRes.json() : [];
      const subs = subsRes.ok ? await subsRes.json() : [];
      const apps = appsRes.ok ? await appsRes.json() : [];
      const projects = projectsRes.ok ? await projectsRes.json() : [];
      const services = servicesRes.ok ? await servicesRes.json() : [];
      const testimonials = testimonialsRes.ok ? await testimonialsRes.json() : [];
      const careers = careersRes.ok ? await careersRes.json() : [];

      setStats({
        queries: queries.length,
        subscribers: subs.length,
        applications: apps.length,
        projects: projects.length,
        services: services.length,
        testimonials: testimonials.length,
        careers: careers.length
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <header className="page-header">
        <h1>Dashboard Overview</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
          Welcome back to the Naiyo24 Admin Panel.
        </p>
      </header>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Queries</h3>
          <p className="stat-value">{loading ? '...' : stats.queries}</p>
        </div>
        <div className="stat-card">
          <h3>Subscribers</h3>
          <p className="stat-value">{loading ? '...' : stats.subscribers}</p>
        </div>
        <div className="stat-card">
          <h3>Career Applications</h3>
          <p className="stat-value">{loading ? '...' : stats.applications}</p>
        </div>
        <div className="stat-card">
          <h3>Projects</h3>
          <p className="stat-value">{loading ? '...' : stats.projects}</p>
        </div>
        <div className="stat-card">
          <h3>Services</h3>
          <p className="stat-value">{loading ? '...' : stats.services}</p>
        </div>
        <div className="stat-card">
          <h3>Testimonials</h3>
          <p className="stat-value">{loading ? '...' : stats.testimonials}</p>
        </div>
        <div className="stat-card">
          <h3>Careers (Jobs)</h3>
          <p className="stat-value">{loading ? '...' : stats.careers}</p>
        </div>
      </div>
    </div>
  );
}


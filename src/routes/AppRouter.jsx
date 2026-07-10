import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout/AdminLayout'
import Dashboard from '../pages/Dashboard/Dashboard'
import Projects from '../pages/Projects/Projects'
import Services from '../pages/Services/Services'
import Testimonials from '../pages/Testimonials/Testimonials'
import Careers from '../pages/Careers/Careers'
import LegalDocs from '../pages/LegalDocs/LegalDocs'
import Queries from '../pages/Queries/Queries'
import Applications from '../pages/Applications/Applications'
import Newsletter from '../pages/Newsletter/Newsletter'
import Settings from '../pages/Settings/Settings'
import Login from '../pages/Login/Login'

const ProtectedRoute = () => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<Projects />} />
            <Route path="services" element={<Services />} />
            <Route path="testimonials" element={<Testimonials />} />
            <Route path="careers" element={<Careers />} />
            <Route path="legal" element={<LegalDocs />} />
          
          <Route path="queries" element={<Queries />} />
          <Route path="applications" element={<Applications />} />
          <Route path="newsletter" element={<Newsletter />} />
          
          <Route path="settings" element={<Settings />} />
        </Route>
        </Route>
        {/* Catch all to redirect to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

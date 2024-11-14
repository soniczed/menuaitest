import React from 'react';
import { Routes, Route } from 'react-router-dom';
import useEmbedScript from '../hooks/useEmbedScript';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import Overview from '../components/dashboard/Overview';
import MenuAISection from '../components/dashboard/MenuAISection';
import AdminSection from '../components/dashboard/AdminSection';

export default function DashboardPage() {
  const { isLoaded, error, isDevelopment } = useEmbedScript({
    embedId: import.meta.env.VITE_EMBED_ID || 'default',
    baseApiUrl: import.meta.env.VITE_BASE_API_URL || 'https://mock-embed-api.example.com'
  });

  return (
    <div data-using-widget="true">
      {/* Development Mode Indicator */}
      {isDevelopment && (
        <div className="fixed top-4 left-4 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm z-50">
          Development Mode
        </div>
      )}

      {/* Error Display */}
      {error && !isDevelopment && (
        <div className="fixed top-4 left-4 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm z-50">
          Widget Error: {error.message}
        </div>
      )}

      <DashboardLayout>
        <Routes>
          <Route index element={<Overview />} />
          <Route path="menu-ai" element={<MenuAISection />} />
          <Route path="admin" element={<AdminSection />} />
        </Routes>
      </DashboardLayout>
    </div>
  );
}
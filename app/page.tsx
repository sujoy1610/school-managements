'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building2, PlusCircle, Eye } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function Home() {
  const [stats, setStats] = useState({
    totalSchools: 0,
    loading: true,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/schools');
      if (response.ok) {
        const schools = await response.json();
        setStats({
          totalSchools: schools.length,
          loading: false,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({ totalSchools: 0, loading: false });
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar/>
      {/* Hero Section */}
      <div className="text-center py-20 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="flex justify-center mb-6">
          <Building2 className="w-16 h-16 text-blue-600" />
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6">
          School Management <span className="text-blue-600">System</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Manage school information efficiently with our modern, user-friendly platform.
          Add new schools, browse existing ones, and keep everything organized in one place.
        </p>

        {/* Quick Stats */}
        <div className="inline-block bg-white rounded-2xl shadow-xl px-10 py-6">
          <div className="text-4xl font-extrabold text-blue-600">
            {stats.loading ? '...' : stats.totalSchools}
          </div>
          <div className="text-gray-500 font-medium">Schools Registered</div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 px-6 mb-20">
        {/* Add School Card */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 p-8 flex flex-col justify-between">
          <div>
            <PlusCircle className="w-12 h-12 text-green-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Add New School</h2>
            <p className="text-gray-600 mb-6">
              Register new schools with complete information including images, contact details, and location.
            </p>
            <ul className="text-gray-600 space-y-2 mb-6 text-sm">
              <li>✔ Upload school images</li>
              <li>✔ Form validation & error handling</li>
              <li>✔ Complete contact information</li>
              <li>✔ Address & location details</li>
            </ul>
          </div>
          <Link
            href="/addSchool"
            className="inline-block text-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium"
          >
            Add School →
          </Link>
        </div>

        {/* View Schools Card */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 p-8 flex flex-col justify-between">
          <div>
            <Eye className="w-12 h-12 text-blue-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-3">View All Schools</h2>
            <p className="text-gray-600 mb-6">
              Browse all registered schools in a clean, responsive gallery format.
            </p>
            <ul className="text-gray-600 space-y-2 mb-6 text-sm">
              <li>✔ Modern card-based gallery</li>
              <li>✔ Mobile responsive design</li>
              <li>✔ Detailed school information</li>
              <li>✔ Contact & location data</li>
            </ul>
          </div>
          <Link
            href="/showSchools"
            className="inline-block text-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            View Schools →
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="text-center pb-20 px-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/addSchool"
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition font-medium"
          >
            ➕ Add First School
          </Link>
          <Link
            href="/showSchools"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            👀 Browse Schools
          </Link>
        </div>
      </div>
    </div>
  );
}

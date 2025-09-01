'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { Search, RefreshCcw, Plus } from 'lucide-react';

interface School {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  contact: string;
  email_id: string;
  image?: string;
  created_at?: string;
}

function SchoolCard({ school }: { school: School }) {
  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-md border border-gray-200 hover:shadow-xl hover:scale-[1.02] transition-transform duration-200 p-6">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {school.image ? (
            <Image
              src={
                school.image.startsWith('/')
                  ? school.image
                  : `/schoolImages/${school.image}`
              }
              alt={`${school.name} logo`}
              width={80}
              height={80}
              className="rounded-xl object-cover border border-gray-300"
            />
          ) : (
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center border border-gray-300">
              <span className="text-blue-700 text-2xl font-bold">
                {school.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
            {school.name}
          </h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p>
              <span className="font-medium">Address:</span>{' '}
              {school.address}, {school.city}, {school.state}
            </p>
            <p>
              <span className="font-medium">Phone:</span> {school.contact}
            </p>
            <p>
              <span className="font-medium">Email:</span>{' '}
              <span className="text-blue-600 break-words">{school.email_id}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-white/60 backdrop-blur-md rounded-2xl shadow-md border border-gray-200 animate-pulse p-6"
        >
          <div className="flex items-start space-x-4">
            <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
            <div className="flex-1">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ShowSchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const schoolsPerPage = 20;
  const router = useRouter();

  const uniqueStates = Array.from(new Set(schools.map((s) => s.state))).sort();

  useEffect(() => {
    fetchSchools();
  }, []);

  useEffect(() => {
    filterSchools();
    setCurrentPage(1); // reset to first page when filters change
  }, [schools, searchTerm, stateFilter]);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/schools');
      if (!res.ok) throw new Error('Failed to fetch schools');
      const data = await res.json();
      setSchools(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filterSchools = () => {
    let filtered = schools;

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (stateFilter) {
      filtered = filtered.filter((s) => s.state === stateFilter);
    }

    setFilteredSchools(filtered);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredSchools.length / schoolsPerPage);
  const indexOfLast = currentPage * schoolsPerPage;
  const indexOfFirst = indexOfLast - schoolsPerPage;
  const currentSchools = filteredSchools.slice(indexOfFirst, indexOfLast);

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Schools Directory
          </h1>
          <p className="text-gray-600">
            Discover and manage schools in our network
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, city, state, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          >
            <option value="">All States</option>
            {uniqueStates.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Toolbar */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600 text-sm">
            Showing {filteredSchools.length} of {schools.length}{' '}
            school{schools.length !== 1 ? 's' : ''}
          </p>
          <div className="flex gap-3">
            <button
              onClick={fetchSchools}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl transition"
            >
              <RefreshCcw size={16} /> Refresh
            </button>
            <button
              onClick={() => router.push('/addSchool')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition"
            >
              <Plus size={16} /> Add New School
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSkeleton />
        ) : filteredSchools.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm || stateFilter
                ? 'No schools found'
                : 'No schools available'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || stateFilter
                ? 'Try adjusting your search criteria.'
                : 'Get started by adding your first school.'}
            </p>
            {(searchTerm || stateFilter) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStateFilter('');
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentSchools.map((s) => (
                <SchoolCard key={s.id} school={s} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === i + 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, ChevronLeft, ChevronRight, Plus, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import CreateIncidentModal from './CreateIncidentModal';

const IncidentList = () => {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedSeverities, setSelectedSeverities] = useState<string[]>([]);
  const [status, setStatus] = useState('');
  const [service, setService] = useState('');
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ field: 'createdAt', direction: 'desc' });
  
  // This effect monitors all four filter states
  // 1. Reset to page 0 when any filter changes
  useEffect(() => {
    setPage(0);
  }, [selectedSeverities, status, service, search]);

  // 2. Fetch data whenever the page OR filters change
  useEffect(() => {
    // Set loading immediately so the user sees a spinner/message
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      fetchIncidents();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [page, selectedSeverities, status, service, search,sortConfig]);

  // Function to handle header clicks
const requestSort = (field: string) => {
    let direction = 'asc';
    if (sortConfig.field === field && sortConfig.direction === 'asc') {
        direction = 'desc';
    }
    setSortConfig({ field, direction });
};
  const fetchIncidents = async () => {
    try {
      const res = await axios.get('/api/incidents', {
        params: {
          page,
          size: 10,
          sort: `${sortConfig.field},${sortConfig.direction}`,
          search: search || null,
          status: status || null,
          service: service || null,
          // Backend handles "SEV1,SEV2" or null
          severity: selectedSeverities.length > 0 ? selectedSeverities.join(',') : null,
        }
      });
      setIncidents(res.data.content || res.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Fetch failed", err);
    }
    finally{
      setLoading(false);
    }
  };
  // Helper for Severity styling
  const getSevClass = (sev: string) => {
    const map: Record<string, string> = {
      SEV1: 'bg-red-50 text-red-700 border-red-100',
      SEV2: 'bg-orange-50 text-orange-700 border-orange-100',
      SEV3: 'bg-blue-50 text-blue-700 border-blue-100',
      SEV4: 'bg-gray-50 text-gray-500 border-gray-200'
    };
    return map[sev] || map.SEV4;
  };

  const handleSeverityToggle = (sev: string) => {
    setSelectedSeverities(prev =>
      prev.includes(sev)
        ? prev.filter(s => s !== sev)
        : [...prev, sev]
    );
  };
  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
        {/* Header Section */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div>
            {/* <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Zeotap</span> */}
            <h1 className="text-2xl font-bold tracking-tight mt-1">Incident Tracker</h1>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#374151] hover:bg-gray-900 text-white px-5 py-2 rounded-sm text-xs font-bold uppercase tracking-widest transition-all shadow-sm flex items-center gap-2"
          >
            <Plus size={16} /> New Incident
          </button>
        </div>

        {/* Filters Section */}
        <div className="flex items-center gap-8 p-4 px-6 bg-gray-50/50 border-b border-gray-100 text-sm">
          <div className="flex items-center gap-3">
            {/* <span className="text-[10px] font-black text-gray-400 uppercase">Service</span> */}
            <select value={service}
              onChange={(e) => setService(e.target.value)} className="bg-transparent border-none text-sm font-medium focus:ring-0 py-0">
              <option value="">Service</option>
              <option>Auth</option>
              <option>Payments</option>
              <option>Backend</option>
              <option>Frontend</option>
              <option>Database</option>
            </select>
          </div>
          <div className="h-4 w-px bg-gray-200" />
          <div className="flex items-center gap-4">
            {['SEV1', 'SEV2', 'SEV3', 'SEV4'].map((sev) => (
              <label key={sev} className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox"
                    checked={selectedSeverities.includes(sev)}
                    onChange={() => handleSeverityToggle(sev)}
                    className="peer  w-4 h-4 border border-gray-300 rounded-sm checked:bg-gray-800 checked:border-gray-800 transition-all"
                  />
                  {/* Custom Checkmark Icon */}
                  <svg className="absolute w-3 h-3 text-white hidden peer-checked:block pointer-events-none"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-gray-500 group-hover:text-gray-900 transition-colors">
                  {sev}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6 p-4 px-6 bg-gray-50/50 border-b border-gray-100 text-sm">
          {/* <span className="text-sm font-bold text-gray-500 uppercase tracking-wider w-16">Status</span> */}
          <div className="flex items-center gap-3">
            {/* <span className="text-[10px] font-black text-gray-400 uppercase">Service</span> */}
            <select value={status}
              onChange={(e) => setStatus(e.target.value)} className="bg-transparent border-none text-sm font-medium focus:ring-0 py-0">
              <option value="">Status</option>
              <option>OPEN</option>
              <option>MITIGATED</option>
              <option>CLOSED</option>
            </select>
          </div>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-1.5 w-full border border-gray-300 rounded text-sm focus:ring-1 focus:ring-gray-400 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={fetchIncidents}
            className="bg-[#4b5563] text-white px-8 py-1.5 rounded-sm text-[11px] font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors shadow-sm ml-auto"
          >
            Filter
          </button>
        </div>
        {/* Data Table */}
        <table className="w-full text-left">
          <thead className="bg-gray-50/30">
            <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <th 
                onClick={() => requestSort('title')} 
                className="px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-1">
                  Title
                  {sortConfig.field === 'title' ? (
                    sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronsUpDown className="w-3 h-3 text-gray-300" />
                  )}
                </div>
              </th>
              <th className="px-6 py-4">Severity</th>
              <th className="px-6 py-4">Status</th>
              <th 
                onClick={() => requestSort('createdAt')} 
                className="px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-1">
                  Created At
                  {sortConfig.field === 'createdAt' ? (
                    sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronsUpDown className="w-3 h-3 text-gray-300" />
                  )}
                </div>
              </th>
              <th className="px-6 py-4 text-right">Owner</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {incidents.map((inc: any) => (
              <tr
                key={inc.id}
                onClick={() => navigate(`/incidents/${inc.id}`)}
                className="group hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <td className="px-6 py-4 text-sm font-semibold group-hover:text-blue-600 transition-colors">{inc.title}</td>
                <td className="px-6 py-4">
                  <span className={`sev-pill ${getSevClass(inc.severity)}`}>{inc.severity}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase">{inc.status}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">{inc.createdAt
                  ? new Date(inc.createdAt).toLocaleDateString()
                  : 'N/A'}</td>
                <td className="px-6 py-4 text-right text-sm text-gray-500 font-serif italic">{inc.owner || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Footer */}
        <div className="p-4 px-6 border-t border-gray-100 flex justify-between items-center bg-gray-50/20">
          <span className="text-xs text-gray-400 font-medium">
            Page {page + 1} of {totalPages}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage(prev => Math.max(0, prev - 1))}
              disabled={page === 0}
              className="p-1 border rounded hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage(prev => prev + 1)}
              disabled={page + 1 >= totalPages}
              className="p-1 border rounded hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
      {/* Change these names to match what you have at the top of your file */}
      <CreateIncidentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRefresh={fetchIncidents}
      />
    </div>
  );
};

export default IncidentList;

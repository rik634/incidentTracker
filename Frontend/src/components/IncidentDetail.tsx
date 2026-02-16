import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Save } from 'lucide-react';
import type { Incident } from '../types';

const IncidentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`/api/incidents/${id}`);
        setIncident(res.data);
      } catch (err) {
        console.error("Error fetching detail", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await axios.put(`/api/incidents/${id}`, incident);
      alert("Incident updated successfully!");
      navigate('/');
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading...</div>;
  if (!incident) return <div className="p-10 text-center text-gray-500">Incident not found.</div>;

  return (
    <div className="flex justify-center items-center min-vh-100 py-10">
      {/* Width set to max-w-md to match Create Incident box */}
      <div className="bg-white w-full max-w-md rounded shadow-2xl border border-gray-200 overflow-hidden animate-in zoom-in duration-150">
        
        {/* Header - Matching Branding */}
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
          <h1 className="text-lg font-bold text-gray-800 tracking-tight">Incident Tracker</h1>
        </div>
        
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-md font-bold text-gray-700 tracking-tight">{incident.title}</h2>
        </div>

        {/* Compact Form Body */}
        <div className="p-5 space-y-4">
          
          <div className="flex items-center">
            <label className="w-28 text-[11px] font-bold text-gray-600 uppercase">Service:</label>
            <p className="text-sm text-gray-800 font-medium">{incident.service}</p>
          </div>

          <div className="flex items-center">
            <label className="w-28 text-[11px] font-bold text-gray-600 uppercase">Severity:</label>
            <select 
              value={incident.severity}
              className="border border-gray-300 rounded px-2 py-1 text-sm bg-white outline-none focus:border-gray-500"
              onChange={(e) => setIncident({...incident, severity: e.target.value as any})}
            >
              <option value="SEV1">SEV1</option>
              <option value="SEV2">SEV2</option>
              <option value="SEV3">SEV3</option>
              <option value="SEV4">SEV4</option>
            </select>
          </div>

          <div className="flex items-center">
            <label className="w-28 text-[11px] font-bold text-gray-600 uppercase">Status:</label>
            <select 
              value={incident.status}
              className="border border-gray-300 rounded px-2 py-1 text-sm bg-white outline-none focus:border-gray-500"
              onChange={(e) => setIncident({...incident, status: e.target.value as any})}
            >
              <option value="OPEN">Open</option>
              <option value="MITIGATED">Mitigated</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

          <div className="flex items-center">
            <label className="w-28 text-[11px] font-bold text-gray-600 uppercase">Assigned To:</label>
            <input 
              type="text"
              value={incident.owner || ''}
              className="flex-1 border border-gray-300 rounded px-3 py-1 text-sm outline-none"
              onChange={(e) => setIncident({...incident, owner: e.target.value})}
              placeholder="dev@team"
            />
          </div>

          <div className="flex items-center">
            <label className="w-28 text-[11px] font-bold text-gray-600 uppercase">Occurred At:</label>
            <p className="text-xs text-gray-500 italic">
              {incident.createdAt ? new Date(incident.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              }) : 'Pending...'}
            </p>
          </div>

          <div className="space-y-1.5 pt-1">
            <label className="block text-[11px] font-bold text-gray-600 uppercase">Summary</label>
            <textarea 
              className="w-full border border-gray-300 rounded p-2.5 h-20 text-sm text-gray-700 outline-none resize-none"
              value={incident.summary || ''}
              onChange={(e) => setIncident({...incident, summary: e.target.value})}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button 
              onClick={handleUpdate}
              className="flex-1 bg-gray-800 text-white py-2 rounded text-[11px] font-bold uppercase tracking-widest hover:bg-black transition-colors"
            >
              Save Changes
            </button>
            <button 
              onClick={() => navigate('/')}
              className="flex-1 bg-gray-100 text-gray-500 py-2 rounded text-[11px] font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentDetail;
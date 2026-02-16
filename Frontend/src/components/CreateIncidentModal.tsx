import React, { useState } from 'react';
import axios from 'axios';

const CreateIncidentModal = ({ isOpen, onClose, onRefresh }: { isOpen: boolean; onClose: () => void; onRefresh: () => void }) => {
  const [formData, setFormData] = useState({
    title: '',
    service: '',
    severity: 'SEV1',
    status: '',
    owner: '',
    summary: ''
  });

  if (!isOpen) return null;

  const validateEmail = (email: string | null | undefined): boolean => {
    
    if (!email || email.trim() === "") return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.toLowerCase()); 
};
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(formData.owner)) {
      alert("Please enter a valid email address or leave it blank.");
      return;
    }
    try {
      await axios.post('/api/incidents', formData);
      alert("Incident created successfully!");
      onRefresh();
      onClose();
      setFormData({
        title: '',
        service: '',
        severity: 'SEV1',
        status: '',
        owner: '',
        summary: ''
      });
    } catch (err) {
      console.error("Failed to create incident", err);
      alert("Error: Could not create incident. Please check your connection.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded shadow-xl border border-gray-200 overflow-hidden animate-in zoom-in duration-150">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-800">Create New Incident</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Title</label>
            <input
              required
              className="w-full border border-gray-300 rounded px-3 py-1.5 outline-none text-sm focus:border-gray-500 transition-colors"
              placeholder="Issue Title..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Service</label>
              <select
                required
                className="w-full border border-gray-300 rounded px-2 py-1.5 bg-white text-sm outline-none cursor-pointer"
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              >
                <option value="">Select...</option>
                <option>Auth</option>
                <option>Payments</option>
                <option>Backend</option>
                <option>Frontend</option>
                <option>Database</option>
              </select>
            </div>

          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Severity</label>
            <div className="flex justify-between py-1 bg-gray-50 rounded px-3 border border-gray-100">
              {['SEV1', 'SEV2', 'SEV3', 'SEV4'].map(s => (
                <label key={s} className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-600 cursor-pointer hover:text-gray-900">
                  <input
                    type="radio"
                    name="sev"
                    checked={formData.severity === s}
                    onChange={() => setFormData({ ...formData, severity: s })}
                    className="accent-gray-800 w-3.5 h-3.5"
                  /> {s}
                </label>
              ))}
            </div>
          </div>


          <div className="flex items-center gap-4">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[80px]">
              Assigned To:
            </label>
            <input
              type="email"
              className="flex-1 border border-gray-300 rounded px-3 py-1.5 outline-none text-sm placeholder:text-gray-300"
              placeholder="Optional"
              value={formData.owner}
              onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Summary</label>
            <textarea
              className="w-full border border-gray-300 rounded p-2.5 h-16 text-sm outline-none resize-none"
              placeholder="Brief description..."
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 bg-gray-800 text-white py-2 rounded text-[11px] font-bold uppercase tracking-widest hover:bg-black transition-colors">
              Create
            </button>
            <button type="button" onClick={onClose} className="flex-1 bg-gray-100 text-gray-500 py-2 rounded text-[11px] font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateIncidentModal;
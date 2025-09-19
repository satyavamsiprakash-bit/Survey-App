
import React from 'react';
import { Attendee } from '../types';
import AttendeeList from './AttendeeList';

interface AdminDashboardProps {
  attendees: Attendee[];
  onLogout: () => void;
  onRemoveAttendee: (id: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ attendees, onLogout, onRemoveAttendee }) => {

  const handleExport = () => {
    if (attendees.length === 0) {
        alert("No attendees to export.");
        return;
    }

    const headers = [
        'ID', 'Full Name', 'Email', 'Phone', 'Profession', 
        'Business Challenges', 'Street', 'City', 'State', 'ZIP'
    ];

    const escapeCsvCell = (cellData: string) => {
        if (!cellData) return '""';
        const stringData = String(cellData);
        if (stringData.includes(',') || stringData.includes('"') || stringData.includes('\n')) {
            return `"${stringData.replace(/"/g, '""')}"`;
        }
        return stringData;
    };

    const csvRows = attendees.map(attendee => {
        const row = [
            attendee.id,
            attendee.fullName,
            attendee.email,
            attendee.phone,
            attendee.profession,
            attendee.businessChallenges,
            attendee.address.street,
            attendee.address.city,
            attendee.address.state,
            attendee.address.zip
        ];
        return row.map(escapeCsvCell).join(',');
    });

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'summit-attendees.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h2 className="text-3xl font-bold text-white">Registered Attendees ({attendees.length})</h2>
        <div className="flex items-center gap-4">
          <a
            href="#/"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all duration-300"
            aria-label="Back to registration form"
          >
            &larr; Back to Form
          </a>
          <button
            onClick={onLogout}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-red-500 transition-all duration-300"
            aria-label="Logout"
          >
            Logout
          </button>
          <button
            onClick={handleExport}
            disabled={attendees.length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-green-500 transition-all duration-300 disabled:bg-slate-500 disabled:cursor-not-allowed"
            aria-label="Export to Excel"
          >
            Export to Excel
          </button>
        </div>
      </div>
      <AttendeeList attendees={attendees} onRemove={onRemoveAttendee} />
    </>
  );
};

export default AdminDashboard;
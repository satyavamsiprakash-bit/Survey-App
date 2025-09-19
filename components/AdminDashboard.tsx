
import React from 'react';
import { Attendee } from '../types';
import AttendeeList from './AttendeeList';

interface AdminDashboardProps {
  attendees: Attendee[];
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ attendees, onLogout }) => {
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
        </div>
      </div>
      <AttendeeList attendees={attendees} />
    </>
  );
};

export default AdminDashboard;

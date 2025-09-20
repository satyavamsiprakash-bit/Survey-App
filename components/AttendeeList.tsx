import React from 'react';
import { Attendee } from '../types';
import Card from './ui/Card';
import Spinner from './ui/Spinner';

interface AttendeeListProps {
  attendees: Attendee[];
  onRemove: (id: string) => void;
  isLoading?: boolean;
}

const AttendeeList: React.FC<AttendeeListProps> = ({ attendees, onRemove, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center justify-center p-8 h-64 text-indigo-600">
          <Spinner />
          <span className="ml-3 text-lg font-medium text-slate-700">Loading attendees...</span>
        </div>
      </Card>
    );
  }
  
  if (attendees.length === 0) {
    return (
      <Card>
        <div className="p-8 text-center text-slate-500">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No Attendees Yet</h2>
          <p>The attendee list is currently empty.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-x-auto">
        <div className="relative">
            <table className="w-full text-sm text-left text-slate-600">
                <thead className="text-xs text-slate-500 uppercase bg-slate-100/80 sticky top-0">
                    <tr>
                        <th scope="col" className="px-6 py-3">Full Name</th>
                        <th scope="col" className="px-6 py-3">Email</th>
                        <th scope="col" className="px-6 py-3">Phone</th>
                        <th scope="col" className="px-6 py-3">Profession</th>
                        <th scope="col" className="px-6 py-3">Address</th>
                        <th scope="col" className="px-6 py-3">Business Challenges</th>
                        <th scope="col" className="px-6 py-3 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {attendees.map((attendee) => (
                        <tr key={attendee.id} className="border-b border-slate-200 hover:bg-slate-100/50 transition-colors duration-200">
                            <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{attendee.fullName}</td>
                            <td className="px-6 py-4 font-mono">{attendee.email}</td>
                            <td className="px-6 py-4 font-mono">{attendee.phone}</td>
                            <td className="px-6 py-4">{attendee.profession}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{`${attendee.address.street}, ${attendee.address.city}, ${attendee.address.state} ${attendee.address.zip}`}</td>
                            <td className="px-6 py-4 max-w-sm whitespace-normal">{attendee.businessChallenges}</td>
                            <td className="px-6 py-4 text-center">
                                <button
                                    onClick={() => {
                                        if (window.confirm(`Are you sure you want to remove ${attendee.fullName}?`)) {
                                            onRemove(attendee.id);
                                        }
                                    }}
                                    className="font-medium text-red-500 hover:text-red-400 transition-colors duration-200"
                                    aria-label={`Remove ${attendee.fullName}`}
                                >
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </Card>
  );
};

export default AttendeeList;

import React, { useState } from 'react';
import RegistrationForm from './components/RegistrationForm';
import AttendeeList from './components/AttendeeList';
import Header from './components/ui/Header';
import { Attendee } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';

type View = 'form' | 'list';

const App: React.FC = () => {
  const [view, setView] = useState<View>('form');
  const [attendees, setAttendees] = useLocalStorage<Attendee[]>('attendees', []);

  const addAttendee = (attendee: Attendee) => {
    setAttendees([...attendees, attendee]);
    // We no longer switch the view automatically after submission
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {view === 'form' ? (
            <div className="max-w-4xl mx-auto">
              <RegistrationForm onFormSubmit={addAttendee} />
            </div>
          ) : (
             <>
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-3xl font-bold text-white">Registered Attendees ({attendees.length})</h2>
                 <button 
                    onClick={() => setView('form')} 
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all duration-300"
                    aria-label="Back to registration form"
                  >
                    &larr; Back to Form
                 </button>
              </div>
              <AttendeeList attendees={attendees} />
            </>
          )}
        </div>
      </main>
      <footer className="text-center py-4 text-slate-500 text-sm">
        <p>Community Summit 2024 &copy; All rights reserved.</p>
        {view === 'form' && (
            <button onClick={() => setView('list')} className="mt-2 text-indigo-400 hover:text-indigo-300 transition-colors text-xs font-medium">
                Admin View
            </button>
        )}
      </footer>
    </div>
  );
};

export default App;
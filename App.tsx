
import React, { useState, useEffect } from 'react';
import RegistrationForm from './components/RegistrationForm';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import Header from './components/ui/Header';
import { Attendee } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { getAttendees, deleteAttendee } from './services/attendeeService';

const App: React.FC = () => {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [route, setRoute] = useState(window.location.hash);
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage<boolean>('isAdminAuthenticated', false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (route === '#admin' && isAuthenticated) {
      setIsLoading(true);
      getAttendees()
        .then(setAttendees)
        .catch(err => {
          console.error("Failed to fetch attendees:", err);
          alert("Could not load attendee data. Please try refreshing the page.");
        })
        .finally(() => setIsLoading(false));
    }
  }, [route, isAuthenticated]);


  const addAttendee = (attendee: Attendee) => {
    // Called after a new registration is successfully submitted to the DB.
    // We only need to update the local state if the admin is currently viewing the list.
    if (isAuthenticated) {
      setAttendees(prev => [...prev, attendee]);
    }
  };

  const removeAttendee = (id: string) => {
    const originalAttendees = [...attendees];
    setAttendees(attendees.filter(attendee => attendee.id !== id)); // Optimistic update

    deleteAttendee(id).catch(error => {
      console.error("Failed to delete attendee:", error);
      setAttendees(originalAttendees); // Revert on failure
      alert("Failed to remove attendee. Please try again.");
    });
  };

  const renderContent = () => {
    if (route === '#admin') {
      if (isAuthenticated) {
        return <AdminDashboard attendees={attendees} onLogout={() => setIsAuthenticated(false)} onRemoveAttendee={removeAttendee} isLoading={isLoading} />;
      } else {
        return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
      }
    }

    return (
      <div className="max-w-4xl mx-auto">
        <RegistrationForm onFormSubmit={addAttendee} />
      </div>
    );
  };

  return (
    <div className="min-h-screen font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
      <footer className="text-center py-4 text-slate-500 text-sm">
        <p>DS Digital solutions Connect 2024 &copy; All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
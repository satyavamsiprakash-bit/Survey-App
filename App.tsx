
import React, { useState, useEffect } from 'react';
import RegistrationForm from './components/RegistrationForm';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import Header from './components/ui/Header';
import { Attendee } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';

const App: React.FC = () => {
  const [attendees, setAttendees] = useLocalStorage<Attendee[]>('attendees', []);
  const [route, setRoute] = useState(window.location.hash);
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage<boolean>('isAdminAuthenticated', false);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const addAttendee = (attendee: Attendee) => {
    setAttendees([...attendees, attendee]);
  };

  const removeAttendee = (id: string) => {
    setAttendees(attendees.filter(attendee => attendee.id !== id));
  };

  const renderContent = () => {
    if (route === '#admin') {
      if (isAuthenticated) {
        return <AdminDashboard attendees={attendees} onLogout={() => setIsAuthenticated(false)} onRemoveAttendee={removeAttendee} />;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
      <footer className="text-center py-4 text-slate-500 text-sm">
        <p>Community Summit 2024 &copy; All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
import React, { useState, useEffect } from 'react';
import { Attendee } from '../types';
import { getSummitSuggestions } from '../services/geminiService';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import Button from './ui/Button';
import Spinner from './ui/Spinner';
import Card from './ui/Card';

interface RegistrationFormProps {
  onFormSubmit: (attendee: Attendee) => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onFormSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    profession: '',
    businessChallenges: '',
    street: '',
    city: '',
    state: '',
    zip: '',
  });
  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{ message: string; suggestions?: string; } | null>(null);

  useEffect(() => {
    if (!submissionResult) return;

    const timer = setTimeout(() => {
        setFormData({
            fullName: '', email: '', phone: '', profession: '', businessChallenges: '',
            street: '', city: '', state: '', zip: '',
        });
        setSubmissionResult(null);
    }, 15000); // Reset after 15 seconds

    return () => clearTimeout(timer);
  }, [submissionResult]);


  const validate = (): boolean => {
    const newErrors: Partial<typeof formData> = {};
    if (!formData.fullName) newErrors.fullName = 'Full name is required.';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'A valid email is required.';
    if (!formData.phone || !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = 'A valid 10-digit phone number is required.';
    if (!formData.profession) newErrors.profession = 'Profession is required.';
    if (!formData.businessChallenges || formData.businessChallenges.length < 10) newErrors.businessChallenges = 'Please describe your challenges in at least 10 characters.';
    if (!formData.street) newErrors.street = 'Street address is required.';
    if (!formData.city) newErrors.city = 'City is required.';
    if (!formData.state) newErrors.state = 'State is required.';
    if (!formData.zip) newErrors.zip = 'ZIP code is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setSubmissionResult(null);

    const newAttendee: Attendee = {
      id: new Date().toISOString(),
      ...formData,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
      },
    };

    const suggestions = await getSummitSuggestions(formData.profession, formData.businessChallenges);

    onFormSubmit(newAttendee);

    setSubmissionResult({
      message: `Thank you, ${formData.fullName}! Your registration is confirmed. In a real-world application, a confirmation message would be sent to ${formData.phone}.`,
      suggestions: suggestions,
    });

    setIsLoading(false);
  };

  if (submissionResult) {
    return (
      <Card>
        <div className="text-center p-8">
          <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h3 className="text-2xl font-bold mt-4 text-white">Registration Successful!</h3>
          <p className="text-slate-300 mt-2">{submissionResult.message}</p>
          {submissionResult.suggestions && (
             <div className="mt-6 text-left bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <h4 className="font-semibold text-indigo-400 mb-2">Personalized Suggestions for You:</h4>
                <p className="text-slate-300 whitespace-pre-wrap">{submissionResult.suggestions}</p>
             </div>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} noValidate className="p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Join the Summit</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} error={errors.fullName} />
          <Input name="profession" placeholder="Your Profession" value={formData.profession} onChange={handleChange} error={errors.profession} />
          <Input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} error={errors.email} />
          <Input name="phone" type="tel" placeholder="Phone Number (e.g., 1234567890)" value={formData.phone} onChange={handleChange} error={errors.phone} />
        </div>

        <Textarea name="businessChallenges" placeholder="What are your current business challenges?" value={formData.businessChallenges} onChange={handleChange} error={errors.businessChallenges} />

        <div className="pt-4 border-t border-slate-700">
            <h3 className="text-xl font-semibold text-slate-300 mb-4">Mailing Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Input name="street" placeholder="Street Address" value={formData.street} onChange={handleChange} error={errors.street} className="md:col-span-2" />
                 <Input name="city" placeholder="City" value={formData.city} onChange={handleChange} error={errors.city} />
                 <Input name="state" placeholder="State / Province" value={formData.state} onChange={handleChange} error={errors.state} />
                 <Input name="zip" placeholder="ZIP / Postal Code" value={formData.zip} onChange={handleChange} error={errors.zip} />
            </div>
        </div>
        
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? <Spinner /> : 'Register and Get Suggestions'}
        </Button>
      </form>
    </Card>
  );
};

export default RegistrationForm;
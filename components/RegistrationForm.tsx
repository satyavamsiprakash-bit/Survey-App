import React, { useState } from 'react';
import { Attendee } from '../types';
import { getSummitSuggestions } from '../services/geminiService';
import { addAttendee } from '../services/attendeeService';
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
  const [submissionResult, setSubmissionResult] = useState<{ message: string; suggestions?: string; error?: boolean } | null>(null);

  const validate = (): boolean => {
    const newErrors: Partial<typeof formData> = {};
    if (!formData.fullName) newErrors.fullName = 'Full name is required.';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email address.';
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
      id: new Date().toISOString() + '-' + Math.random().toString(36).substring(2, 9),
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      profession: formData.profession,
      businessChallenges: formData.businessChallenges,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
      },
    };

    try {
      const suggestions = await getSummitSuggestions(formData.profession, formData.businessChallenges);
      const savedAttendee = await addAttendee(newAttendee);
      onFormSubmit(savedAttendee);

      setSubmissionResult({
        message: `Your registration is confirmed. We've prepared some personalized session suggestions for you below.`,
        suggestions: suggestions,
      });
    } catch (error) {
      console.error("Registration failed:", error);
      setSubmissionResult({
        message: "We're sorry, but there was an error processing your registration. Please try again later.",
        error: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (submissionResult) {
    const Icon = submissionResult.error
      ? (
        <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        )
      : (
        <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        );

    return (
      <Card>
        <div className="text-center p-8">
          {Icon}
          <h3 className="text-2xl font-bold mt-4 text-slate-900">
            {submissionResult.error ? 'Registration Failed' : 'Thank you for sharing the details.'}
          </h3>
          <p className="text-slate-600 mt-2 max-w-2xl mx-auto">{submissionResult.message}</p>
          
          {!submissionResult.error && (
            <>
              <div className="my-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg shadow-lg">
                <p className="text-slate-700 text-lg">
                    For further details, please contact Krishna Reddy at <a href="tel:9916482647" className="text-indigo-600 font-bold hover:underline">9916482647</a>.
                </p>
              </div>

              {submissionResult.suggestions && (
                 <div className="mt-6 text-left bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h4 className="font-semibold text-indigo-600 mb-2">Personalized Suggestions for You:</h4>
                    <p className="text-slate-700 whitespace-pre-wrap">{submissionResult.suggestions}</p>
                 </div>
              )}
            </>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} noValidate className="p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-6">Share Your Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} error={errors.fullName} />
          <Input name="profession" placeholder="Your Profession" value={formData.profession} onChange={handleChange} error={errors.profession} />
          <Input name="email" type="email" placeholder="Email Address (Optional)" value={formData.email} onChange={handleChange} error={errors.email} />
          <Input name="phone" type="tel" placeholder="Phone Number (e.g., 1234567890)" value={formData.phone} onChange={handleChange} error={errors.phone} />
        </div>

        <Textarea name="businessChallenges" placeholder="What are your current business challenges?" value={formData.businessChallenges} onChange={handleChange} error={errors.businessChallenges} />

        <div className="pt-4 border-t border-slate-200">
            <h3 className="text-xl font-semibold text-slate-700 mb-4">Mailing Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Input name="street" placeholder="Street Address" value={formData.street} onChange={handleChange} error={errors.street} className="md:col-span-2" />
                 <Input name="city" placeholder="City" value={formData.city} onChange={handleChange} error={errors.city} />
                 <Input name="state" placeholder="State / Province" value={formData.state} onChange={handleChange} error={errors.state} />
                 <Input name="zip" placeholder="ZIP / Postal Code" value={formData.zip} onChange={handleChange} error={errors.zip} />
            </div>
        </div>
        
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? <Spinner /> : 'Submit'}
        </Button>
      </form>
    </Card>
  );
};

export default RegistrationForm;
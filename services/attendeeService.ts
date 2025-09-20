import { Attendee } from '../types';

const API_BASE_URL = '/api/attendees';

export const getAttendees = async (): Promise<Attendee[]> => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch attendees: ${response.statusText}`);
  }
  return response.json();
};

export const addAttendee = async (attendee: Attendee): Promise<Attendee> => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(attendee),
  });
  if (!response.ok) {
    throw new Error(`Failed to add attendee: ${response.statusText}`);
  }
  return response.json();
};

export const deleteAttendee = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}?id=${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Failed to delete attendee: ${response.statusText}`);
  }
};

import { kv } from '@vercel/kv';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { Attendee } from '../types';

const ATTENDEES_KEY = 'attendees';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const attendees = await kv.hgetall<Record<string, Attendee>>(ATTENDEES_KEY);
      res.status(200).json(Object.values(attendees || {}));
    } else if (req.method === 'POST') {
      const newAttendee: Attendee = req.body;
      if (!newAttendee || !newAttendee.id || !newAttendee.fullName || !newAttendee.phone) {
        return res.status(400).json({ error: 'Missing required attendee fields.' });
      }
      await kv.hset(ATTENDEES_KEY, { [newAttendee.id]: newAttendee });
      res.status(201).json(newAttendee);
    } else if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'A valid attendee ID is required for deletion.' });
      }
      await kv.hdel(ATTENDEES_KEY, id);
      res.status(200).json({ message: 'Attendee deleted successfully' });
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error in /api/attendees:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
}

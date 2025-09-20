import { kv } from '@vercel/kv';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { Attendee } from '../types';

const ATTENDEE_PREFIX = 'attendee:';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const attendeeKeys: string[] = [];
      for await (const key of kv.scanIterator({ match: `${ATTENDEE_PREFIX}*` })) {
        attendeeKeys.push(key);
      }
      
      if (attendeeKeys.length === 0) {
        return res.status(200).json([]);
      }
      
      // FIX: Corrected the generic type for `mget` to `Attendee[]`. The `@vercel/kv`
      // `mget` function expects an array type as its generic argument. Using
      // `<Attendee>` caused a type error, which is now resolved.
      const attendeesData = await kv.mget<Attendee[]>(...attendeeKeys);
      const attendees = attendeesData.filter((attendee): attendee is Attendee => attendee !== null);

      res.status(200).json(attendees);
    } else if (req.method === 'POST') {
      let newAttendee: Attendee;

      // FIX: Add robust body parsing. While Vercel usually auto-parses JSON,
      // this ensures that the API can handle stringified bodies, preventing submission errors.
      try {
        newAttendee = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      } catch (e) {
        return res.status(400).json({ error: 'Invalid JSON in request body.' });
      }

      if (!newAttendee || !newAttendee.id || !newAttendee.fullName || !newAttendee.phone) {
        return res.status(400).json({ error: 'Missing required attendee fields.' });
      }
      
      await kv.set(`${ATTENDEE_PREFIX}${newAttendee.id}`, newAttendee);
      res.status(201).json(newAttendee);
    } else if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'A valid attendee ID is required for deletion.' });
      }
      await kv.del(`${ATTENDEE_PREFIX}${id}`);
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
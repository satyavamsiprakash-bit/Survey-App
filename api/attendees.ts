import { kv } from '@vercel/kv';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { Attendee } from '../types';

const ATTENDEE_PREFIX = 'attendee:';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      // FIX: Replaced kv.hgetall with kv.scanIterator and kv.mget to fetch all attendees.
      // This change resolves the TypeScript error indicating 'hgetall' does not exist on type 'VercelKV'.
      const attendeeKeys: string[] = [];
      for await (const key of kv.scanIterator({ match: `${ATTENDEE_PREFIX}*` })) {
        attendeeKeys.push(key);
      }
      
      if (attendeeKeys.length === 0) {
        return res.status(200).json([]);
      }

      const attendeesData = await kv.mget<Attendee[]>(...attendeeKeys);
      // FIX: Used automatic deserialization from kv.mget and filtered nulls.
      // This resolves the 'unknown' type error during JSON parsing.
      const attendees = attendeesData.filter((attendee): attendee is Attendee => attendee !== null);

      res.status(200).json(attendees);
    } else if (req.method === 'POST') {
      const newAttendee: Attendee = req.body;
      if (!newAttendee || !newAttendee.id || !newAttendee.fullName || !newAttendee.phone) {
        return res.status(400).json({ error: 'Missing required attendee fields.' });
      }
      
      // FIX: Replaced kv.hset with kv.set to store each attendee under a unique key.
      // This resolves the 'hset' not found error.
      // @vercel/kv automatically handles JSON serialization.
      await kv.set(`${ATTENDEE_PREFIX}${newAttendee.id}`, newAttendee);
      res.status(201).json(newAttendee);
    } else if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'A valid attendee ID is required for deletion.' });
      }
      // FIX: Replaced kv.hdel with kv.del to remove an attendee by its specific key.
      // This resolves the 'hdel' not found error.
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

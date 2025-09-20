import { kv } from '@vercel/kv';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { Attendee } from '../types';

const ATTENDEE_PREFIX = 'attendee:';

/**
 * A runtime type guard to validate that an object conforms to the Attendee interface.
 * This prevents incomplete or malformed data from being processed or stored.
 */
function isValidAttendee(data: any): data is Attendee {
    if (!data || typeof data !== 'object') {
        return false;
    }

    const hasPersonalInfo = 
        typeof data.id === 'string' && !!data.id &&
        typeof data.fullName === 'string' && !!data.fullName &&
        typeof data.phone === 'string' && !!data.phone &&
        typeof data.profession === 'string' && !!data.profession &&
        typeof data.businessChallenges === 'string' && !!data.businessChallenges;

    if (!hasPersonalInfo) {
        return false;
    }

    const hasAddress = 
        data.address && typeof data.address === 'object' &&
        typeof data.address.street === 'string' && !!data.address.street &&
        typeof data.address.city === 'string' && !!data.address.city &&
        typeof data.address.state === 'string' && !!data.address.state &&
        typeof data.address.zip === 'string' && !!data.address.zip;
    
    return hasAddress;
}


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
      
      // Use mget without generics for robustness. The SDK will parse JSON automatically.
      const attendeesData = await kv.mget(...attendeeKeys);
      
      // Filter out any null or invalid records to prevent crashes.
      const validAttendees = attendeesData.filter(isValidAttendee);

      res.status(200).json(validAttendees);

    } else if (req.method === 'POST') {
      const newAttendeeData = req.body;

      // Use the robust type guard to validate the incoming data.
      if (!isValidAttendee(newAttendeeData)) {
        return res.status(400).json({ error: 'Missing or invalid attendee data provided.' });
      }
      
      await kv.set(`${ATTENDEE_PREFIX}${newAttendeeData.id}`, newAttendeeData);
      res.status(201).json(newAttendeeData);

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
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error in /api/attendees:', errorMessage, error);
    res.status(500).json({ error: 'An internal server error occurred.', details: errorMessage });
  }
}

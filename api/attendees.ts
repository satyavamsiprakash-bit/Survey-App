import { kv } from '@vercel/kv';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { Attendee } from '../types';

const ATTENDEE_PREFIX = 'attendee:';

/**
 * A robust runtime type guard to validate that an object conforms to the Attendee interface.
 * This prevents incomplete or malformed data from being processed, stored, or read.
 */
function isValidAttendee(data: unknown): data is Attendee {
    if (!data || typeof data !== 'object' || data === null) {
        return false;
    }

    const attendee = data as Record<string, any>;

    const hasPersonalInfo = 
        typeof attendee.id === 'string' && attendee.id.length > 0 &&
        typeof attendee.fullName === 'string' && attendee.fullName.length > 0 &&
        typeof attendee.email === 'string' && // Email can be empty, but must be a string
        typeof attendee.phone === 'string' && attendee.phone.length > 0 &&
        typeof attendee.profession === 'string' && attendee.profession.length > 0 &&
        typeof attendee.businessChallenges === 'string' && attendee.businessChallenges.length > 0;

    if (!hasPersonalInfo) {
        return false;
    }

    const address = attendee.address;
    const hasAddress = 
        address && typeof address === 'object' && address !== null &&
        typeof address.street === 'string' && address.street.length > 0 &&
        typeof address.city === 'string' && address.city.length > 0 &&
        typeof address.state === 'string' && address.state.length > 0 &&
        typeof address.zip === 'string' && address.zip.length > 0;
    
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
      
      // The SDK automatically parses JSON, but malformed data can result in nulls.
      const attendeesData = await kv.mget<(Attendee | null)[]>(...attendeeKeys);
      
      // Filter out any null or invalid records to prevent the client from crashing.
      const validAttendees = attendeesData.filter(isValidAttendee);

      return res.status(200).json(validAttendees);

    } else if (req.method === 'POST') {
      let newAttendeeData: unknown;
      
      // Vercel's body parser should handle this, but we'll be defensive.
      if (typeof req.body === 'string' && req.body.length > 0) {
          try {
              newAttendeeData = JSON.parse(req.body);
          } catch (error) {
              console.error('Failed to parse request body string:', error);
              return res.status(400).json({ error: 'Invalid JSON format in request body.' });
          }
      } else if (typeof req.body === 'object' && req.body !== null) {
          newAttendeeData = req.body;
      } else {
        return res.status(400).json({ error: 'Request body is missing or not an object.' });
      }

      // Use the robust type guard to validate the incoming data.
      if (!isValidAttendee(newAttendeeData)) {
        console.error('Validation failed for new attendee data:', newAttendeeData);
        return res.status(400).json({ error: 'Missing or invalid attendee data provided.' });
      }
      
      await kv.set(`${ATTENDEE_PREFIX}${newAttendeeData.id}`, newAttendeeData);
      return res.status(201).json(newAttendeeData);

    } else if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'A valid attendee ID is required for deletion.' });
      }
      await kv.del(`${ATTENDEE_PREFIX}${id}`);
      return res.status(200).json({ message: 'Attendee deleted successfully' });

    } else {
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('CRITICAL ERROR in /api/attendees:', error);
    return res.status(500).json({ error: 'An internal server error occurred.', details: errorMessage });
  }
}

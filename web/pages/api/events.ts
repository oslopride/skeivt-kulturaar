import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import sanity, { urlFor } from '../../sanity';
import { PublicSanityEvent } from '../../types/sanity';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

// ghetto semi-cache, better than nothing
let cache: Array<APIEvent> = [];

type APIEvent = Omit<PublicSanityEvent, 'image' | 'eventDates'> & {
  image: { full: string | null; thumbnail: string | null };
  eventStart: string;
  eventEnd: string;
};
async function handler(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, cors);
  if (cache.length === 0) {
    const fields =
      'address,ageLimit,county,digitalEventUrl,eventDates,eventDescription,eventFilters,eventLink,eventName,eventTypes,image,postalCode,ticketPrice';
    const query = `*[_type == 'eventRequest' && approved == true]{${fields}}`;
    const sanityEvents: Array<PublicSanityEvent> = await sanity.fetch(query);

    const events: Array<APIEvent> = [];
    for (const event of sanityEvents) {
      // for each date of an event, create a new event
      for (const { eventEnd, eventStart } of event.eventDates || []) {
        const { image, eventDates, ...oldEvent } = event;
        const thumbnail = image ? urlFor(image).width(400).url().toString() : null;
        const full = image ? urlFor(image).url().toString() : null;
        const images = { thumbnail, full };
        const newEvent: APIEvent = {
          ...oldEvent,
          image: images,
          eventStart,
          eventEnd,
        };
        events.push(newEvent);
      }
    }
    cache = events;
    res.json(events);
  } else {
    console.log('using cache');
    res.json(cache);
  }
}

export default handler;

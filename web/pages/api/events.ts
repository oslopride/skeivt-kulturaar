import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import sanity, { urlFor } from '../../sanity';
import { PublicSanityEvent } from '../../types/sanity';
// Initializing the cors middleware
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

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, cors);

  const fields =
    'address,ageLimit,county,digitalEventUrl,eventDates,eventDescription,eventFilters,eventLink,eventName,eventTypes,image,postalCode,ticketPrice';
  const query = `*[_type == 'eventRequest' && approved == true]{${fields}}`;
  const events: Array<PublicSanityEvent> = await sanity.fetch(query);
  const eventsWithImageUrls = events.map((event) => {
    const { image, ...rest } = event;
    const thumbnail = image ? urlFor(image).width(400).url().toString() : null;
    const full = image ? urlFor(image).url().toString() : null;
    const images = { thumbnail, full };
    return { ...rest, image: images };
  });

  // Rest of the API logic
  res.json(eventsWithImageUrls);
}

export default handler;

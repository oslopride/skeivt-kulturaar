// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiResponse } from 'next';
import { createReadStream } from 'fs';
import { v4 as uuidv4 } from 'uuid';

import middleware from '../../middleware/middleware';
import nextConnect from 'next-connect';
import sanity from '../../sanity';
import { SanityEvent } from '../../types/sanity';

const handler = nextConnect();
handler.use(middleware);

handler.post(async (req: any, res: NextApiResponse) => {
  console.log('Body:', req.body);
  console.log('Image:', req.files['image']);

  if (req.body['password'][0] !== '' || req.body['username'][0] !== '' || req.body['withdraw_amount'][0] !== '') {
    res.status(403).end();
  }

  try {
    const sanityEvent: SanityEvent = {
      eventName: req.body['name'][0],
      eventDescription: req.body['event-info'][0],
      eventTypes: req.body['eventTypes[]'],
      eventFilters: req.body['eventFilters[]'],
      address: req.body['address'] ? req.body['address'][0] : '',
      postalCode: req.body['postalNumber'] ? req.body['postalNumber'][0] : '',
      county: req.body['county'] ? req.body['county'][0] : '',
      ageLimit:
        req.body['age-limit-age'] && req.body['age-limit-age'][0] !== '' && !isNaN(req.body['age-limit-age'][0])
          ? parseInt(req.body['age-limit-age'][0])
          : 0,
      ticketPrice:
        req.body['ticket-price'] && req.body['ticket-price'][0] !== '' && !isNaN(req.body['ticket-price'][0])
          ? parseInt(req.body['ticket-price'][0])
          : 0,
      eventOrganizer: req.body['organizer-name'][0],
      contactName: req.body['contact-name'][0],
      pronoun: req.body['pronoun'][0],
      tlfNr: req.body['phone-number'][0],
      contactEmail: req.body['contact-email'][0],
      additionalInfo: req.body['contact-info'][0],
      eventDates: [
        {
          _key: uuidv4(),
          eventStart:
            req.body['start-date'][0] && req.body['start-time'][0]
              ? new Date(req.body['start-date'][0] + ' ' + req.body['start-time'][0]).toISOString()
              : '',
          eventEnd:
            req.body['end-date'][0] && req.body['end-time'][0]
              ? new Date(req.body['end-date'][0] + ' ' + req.body['end-time'][0]).toISOString()
              : '',
        },
      ],
    };

    if (req.body['ticket-purchase-link'][0] !== '') {
      sanityEvent['ticketUrl'] = req.body['ticket-purchase-link'][0];
    }

    if (req.body['event-link'][0] !== '') {
      sanityEvent['eventLink'] = req.body['event-link'][0];
    }

    if (req.body['digital-event-link'] && req.body['event-link'][0] !== '') {
      sanityEvent['digitalEventUrl'] = req.body['digital-event-link'][0];
    }

    const eventDocument = await sanity.create({
      _type: 'eventRequest',
      ...sanityEvent,
    });

    console.log('Response:', eventDocument);
    const documentId = eventDocument['_id'];
    if (req.files.image && req.files.image[0] && req.files['image'][0].size > 0 && documentId) {
      const fileStream = createReadStream(req.files.image[0].path);
      const imgAsset = await sanity.assets.upload('image', fileStream as any, {
        contentType: req.files.image[0].headers['content-type'],
        filename: req.files.image[0].originalFilename,
      });

      console.log('The image was uploaded!', imgAsset);
      await sanity
        .patch(documentId)
        .set({
          image: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: imgAsset._id,
            },
          },
        })
        .commit();
    }
  } catch (err) {
    console.log('Error:', err);
    res.status(500).send({ error: 'failed to fetch data' });
  }
  res.status(201).end();
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;

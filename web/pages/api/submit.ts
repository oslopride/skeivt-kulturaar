// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { readFileSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';

import middleware from '../../middleware/middleware';
import nextConnect from 'next-connect';
import sanity from '../../sanity';
import { SanityEvent } from '../../types/sanity';

const handler = nextConnect({
  onError: (err, req, res: NextApiResponse, next) => {
    console.error(err.stack);
    res.status(500).end('Something broke!');
  },
});
handler.use(middleware);

handler.post(async (req: any, res: NextApiResponse) => {
  console.log('Body:', req.body);
  console.log('Image:', req.files['image']);

  if (req.body['password'] !== '' || req.body['username'] !== '' || req.body['withdraw_amount'] !== '') {
    res.status(403).end();
  }

  try {
    const sanityEvent: SanityEvent = {
      eventName: req.body['name'],
      eventDescription: req.body['event-info'],
      eventTypes: req.body['eventTypes'],
      eventFilters: req.body['eventFilters'],
      address: req.body['address'] ? req.body['address'] : '',
      postalCode: req.body['postalNumber'] ? req.body['postalNumber'] : '',
      county: req.body['county'] ? req.body['county'] : '',
      ageLimit:
        req.body['age-limit-age'] && req.body['age-limit-age'] !== '' && !isNaN(req.body['age-limit-age'])
          ? parseInt(req.body['age-limit-age'])
          : 0,
      ticketPrice:
        req.body['ticket-price'] && req.body['ticket-price'] !== '' && !isNaN(req.body['ticket-price'])
          ? parseInt(req.body['ticket-price'])
          : 0,
      eventOrganizer: req.body['organizer-name'],
      contactName: req.body['contact-name'],
      pronoun: req.body['pronoun'],
      tlfNr: req.body['phone-number'],
      contactEmail: req.body['contact-email'],
      additionalInfo: req.body['contact-info'],
      eventDates: [
        {
          _key: uuidv4(),
          eventStart:
            req.body['start-date'] && req.body['start-time']
              ? new Date(req.body['start-date'] + ' ' + req.body['start-time']).toISOString()
              : '',
          eventEnd:
            req.body['end-date'] && req.body['end-time']
              ? new Date(req.body['end-date'] + ' ' + req.body['end-time']).toISOString()
              : '',
        },
      ],
    };

    if (req.body['ticket-purchase-link'] !== '') {
      sanityEvent['ticketUrl'] = req.body['ticket-purchase-link'];
    }

    if (req.body['event-link'] !== '') {
      sanityEvent['eventLink'] = req.body['event-link'];
    }

    if (req.body['digital-event-link'] && req.body['event-link'] !== '') {
      sanityEvent['digitalEventUrl'] = req.body['digital-event-link'];
    }

    if (req.files.image && req.files.image && req.files['image'].size > 0) {
      const file = readFileSync(req.files.image.filepath);
      const imgAsset = await sanity.assets
        .upload('image', file, {
          filename: req.files.image.originalFilename,
        })
        .catch((err) => {
          console.log('Error:', err);
        });

      if (imgAsset) {
        sanityEvent['image'] = {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imgAsset._id,
          },
        };
      }
    }

    await sanity.create({
      _type: 'eventRequest',
      ...sanityEvent,
    });

    res.status(201).end();
  } catch (err) {
    console.log('Error:', err);
    res.status(500).send({ error: 'failed to fetch data' });
  }
});

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default handler;

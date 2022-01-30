// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiResponse } from 'next';
import { createReadStream } from 'fs';
import { v4 as uuidv4 } from 'uuid';

import middleware from '../../middleware/middleware';
import nextConnect from 'next-connect';
import sanity from '../../sanity';

const handler = nextConnect();
handler.use(middleware);

type SanityEvent = {
  eventName: string;
  eventDescription: string;
  eventLink?: string;
  eventTypes: string[];
  eventFilters: string[];
  address: string;
  postalCode: string;
  county: string;
  digitalEventUrl?: string;
  ageLimit: number;
  ticketPrice: number;
  ticketUrl?: string;
  contactName: string;
  pronoun: string;
  tlfNr: string;
  contactEmail: string;
  additionalInfo: string;
  eventDates: { _key: string; eventStart: string; eventEnd: string }[];
};

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
      eventTypes: [''],
      eventFilters: [''],
      address: req.body['address'][0],
      postalCode: req.body['postalNumber'][0],
      county: req.body['county'][0],
      ageLimit:
        req.body['age-limit-age'] && req.body['age-limit-age'][0] !== '' && !isNaN(req.body['age-limit-age'][0])
          ? parseInt(req.body['age-limit-age'][0])
          : 0,
      ticketPrice:
        req.body['ticket-price'] && req.body['ticket-price'][0] !== '' && !isNaN(req.body['ticket-price'][0])
          ? parseInt(req.body['ticket-price'][0])
          : 0,
      contactName: req.body['organizer-name'][0],
      pronoun: req.body['pronoun'][0],
      tlfNr: req.body['phone-number'][0],
      contactEmail: req.body['contact-email'][0],
      additionalInfo: req.body['contact-info'][0],
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

    if (req.body['ticket-purchase-link'][0] !== '') {
      sanityEvent['ticketUrl'] = req.body['ticket-purchase-link'][0];
    }

    if (req.body['event-link'][0]) {
      sanityEvent['eventLink'] = req.body['event-link'][0];
    }

    if (req.body['digital-event-link'][0]) {
      sanityEvent['digitalEventUrl'] = req.body['digital-event-link'][0];
    }

    sanity
      .create({
        _type: 'eventRequest',
        ...sanityEvent,
      })
      .then((res) => {
        console.log('Response:', res);
        const documentId = res['_id'];
        if (req.files.image?.[0] && req.files['image'][0].size > 0 && documentId) {
          const fileStream = createReadStream(req.files.image[0].path);
          sanity.assets
            .upload('image', fileStream as any, {
              contentType: req.files.image[0].headers['content-type'],
              filename: req.files.image[0].originalFilename,
            })
            .then((imgAsset) => {
              console.log('The image was uploaded!', imgAsset);
              return sanity
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
            });
        }
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
  },
};

export default handler;

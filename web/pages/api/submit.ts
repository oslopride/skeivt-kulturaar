// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
<<<<<<< HEAD
import type { NextApiResponse } from 'next';
import { createReadStream } from 'fs'

import middleware from '../../middleware/middleware';
import nextConnect from 'next-connect';
import sanity from '../../sanity';
=======
import type { NextApiResponse } from "next";
import sanityClient from "@sanity/client";
import middleware from "../../middleware/middleware";
import nextConnect from "next-connect";
import { DATASET, PROJECT_ID } from "../../sanity";
>>>>>>> add initial Sanity submit query for events

const handler = nextConnect();
handler.use(middleware);
const sanity = sanityClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  token: process.env.EDITOR_SANITY_ACCESS_TOKEN,
  apiVersion: "2021-12-19",
});

type SanityEvent = {
  eventName: string;
  eventDescription: string;
  eventLink: string;
  eventTypes: string[];
  eventFilters: string[];
  address: string;
  postalCode: string;
  county: string;
  digitalEventUrl: string;
  ageLimit: number;
  ticketPrice: number;
  ticketUrl: string;
  contactName: string;
  pronoun: string;
  tlfNr: string;
  contactEmail: string;
  additionalInfo: string;
};

handler.post(async (req: any, res: NextApiResponse) => {
  console.log(req.body);
  console.log(req.files["image"]);

  if (
    req.body["password"][0] !== "" ||
    req.body["username"][0] !== "" ||
    req.body["withdraw_amount"][0] !== ""
  ) {
    res.status(403).end();
  }

  try {
    const sanityEvent: SanityEvent = {
      eventName: req.body["name"][0],
      eventDescription: req.body["event-info"][0],
      eventLink: req.body["event-link"][0],
      eventTypes: [""],
      eventFilters: [""],
      address: req.body["address"][0],
      postalCode: req.body["postalNumber"][0],
      county: "",
      digitalEventUrl: "",
      ageLimit:
        req.body["age-limit-age"] &&
        req.body["age-limit-age"][0] !== "" &&
        !isNaN(req.body["age-limit-age"][0])
          ? parseInt(req.body["age-limit-age"][0])
          : 0,
      ticketPrice:
        req.body["ticket-price"] &&
        req.body["ticket-price"][0] !== "" &&
        !isNaN(req.body["ticket-price"][0])
          ? parseInt(req.body["ticket-price"][0])
          : 0,
      contactName: req.body["organizer-name"][0],
      ticketUrl: req.body["ticket-purchase-link"][0],
      pronoun: req.body["pronoun"][0],
      tlfNr: req.body["phone-number"][0],
      contactEmail: req.body["contact-email"][0],
      additionalInfo: req.body["contact-info"][0],
    };
    console.log("Event info:", sanityEvent);
    if (req.files["image"][0].size > 0) {
      console.log("Hello friend");
    }
    res.status(200).end();
    // parse form, redirect on success
    if (req.files.image?.[0]) {
      const fileStream = createReadStream(req.files.image[0].path);
      const asset = await sanity.assets.upload("image", fileStream as any, { contentType: req.files.image[0].headers['content-type'], filename: req.files.image[0].originalFilename })
      console.log(asset);
    }
    res.redirect(307, '/thanks');
  } catch (err) {
    console.log(err)
    res.status(500).send({ error: 'failed to fetch data' });
    // sanity
    //   .create({
    //     _type: 'eventRequest',
    //     eventName: 'First test event',
    //     eventDescription: '',
    //     eventDates: ['2017-02-12T09:15:00Z'],
    //     eventEmail: '',
    //   })
    //   .then((res) => {
    //     console.log('Response:', res);
    //   });
    //res.redirect(307, "/thanks");
  } 
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;

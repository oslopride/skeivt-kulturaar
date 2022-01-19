// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiResponse } from 'next';
import { createReadStream } from 'fs'

import middleware from '../../middleware/middleware';
import nextConnect from 'next-connect';
import sanity from '../../sanity';

const handler = nextConnect();
handler.use(middleware);

handler.post(async (req: any, res: NextApiResponse) => {
  console.log(req.body);
  console.log(req.files.image[0])

  try {
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
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;

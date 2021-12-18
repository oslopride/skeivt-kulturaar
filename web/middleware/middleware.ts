import nextConnect from 'next-connect';
import multiparty from 'multiparty';

const middleware = nextConnect();

middleware.use(async (req: any, res, next) => {
  const form = new multiparty.Form();

  form.parse(req, function (err, fields, files) {
    req.body = fields;
    req.files = files;
    next();
  });
});

export default middleware;

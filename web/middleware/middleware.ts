import nextConnect from 'next-connect';
import formidable from 'formidable';

const middleware = nextConnect();
const form = formidable({ multiples: true });

middleware.use(async (req: any, res, next) => {
  const contentType = req.headers['content-type'];

  if (contentType && contentType.indexOf('multipart/form-data') !== -1) {
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error(err);
      }

      if (!err) {
        req.body = fields;
        req.files = files;
      }

      next();
    });
  } else {
    console.log('Nope, no form data');
    next();
  }
});

export default middleware;

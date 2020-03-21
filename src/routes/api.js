const mime = require('mime');
const multer = require('multer');
const DataUri = require('datauri');

const { Router } = require('express');

const u = require('../lib/util');
const shell = require('../lib/shell');

const storage = multer.memoryStorage();
const fileUpload = multer({ storage }).single('image');

const apiRouter = module.exports = new Router();

apiRouter.get('/image/resolution', async (req, res) => {
  const resolution = await shell.getResolution();

  res.json(resolution);
});

apiRouter.post('/image', async (req, res) => {
  let { body: { image } } = req;

  if (!image) {
    image = await new Promise((resolve) => {
      fileUpload(req, res, (err) => {
        if (err) {
          u.err('File upload error');
          console.log(err);
          return resolve(null);
        }

        const { buffer, mimetype } = req.file;
        const extension = `.${mime.getExtension(mimetype)}`;

        if (extension !== '.png') {
          u.err('Only .png is supported');
          return resolve(null);
        }

        const dataUri = new DataUri();
        dataUri.format(extension, buffer);
        resolve(dataUri.content);
      });
    });
  }

  if (!image) return res.sendStatus(400);

  res.sendStatus(204);
  shell.saveImage(image).catch(console.log);
});

apiRouter.delete('/image', (req, res) => {
  shell.eraseImage().catch(console.log);
  res.sendStatus(204);
});

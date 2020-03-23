const mime = require('mime');
const multer = require('multer');
const imageDataURI = require('image-data-uri');

const { Router } = require('express');

const u = require('../lib/util');
const shell = require('../lib/shell');

const storage = multer.memoryStorage();
const fileUpload = multer({ storage }).single('image');

const apiRouter = module.exports = new Router();

apiRouter.get('/settings', async (req, res) => {
  const settings = await shell.getSettings();

  res.json(settings);
});

apiRouter.put('/settings', async (req, res) => {
  const { body: newSettings } = req;

  if (!Object.keys(newSettings).length) {
    return res.sendStatus(400);
  }

  const settings = await shell.setSettings(newSettings);

  res.json(settings);
});

apiRouter.delete('/settings/:setting', async (req, res) => {
  const { params: { setting } } = req;

  const settings = await shell.deleteSetting(setting);

  res.json(settings);
});

apiRouter.post('/image', async (req, res) => {
  let { body: { image } } = req;

  if (!image) {
    image = await new Promise((resolve) => {
      fileUpload(req, res, async (err) => {
        if (err || !req.file) {
          u.err('File upload error');
          console.log(err || 'no file uploaded');

          return resolve(null);
        }

        const { buffer, mimetype } = req.file;
        const extension = mime.getExtension(mimetype).toUpperCase();
        const dataUri = await imageDataURI.encode(buffer, extension);

        resolve(dataUri);
      });
    });
  }

  if (!image) return res.sendStatus(400);

  ({ dataBase64: image } = imageDataURI.decode(image));

  res.sendStatus(204);
  shell.saveImage(image).catch(console.log);
});

apiRouter.delete('/image', (req, res) => {
  res.sendStatus(204);
  shell.eraseImage().catch(console.log);
});

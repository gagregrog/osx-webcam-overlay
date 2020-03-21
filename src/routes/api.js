// const multer = require('multer');
const { Router } = require('express');

const shell = require('../lib/shell');

// const storage = multer.memoryStorage();
// const fileUpload = multer({ storage }).single('image');

const apiRouter = module.exports = new Router();

apiRouter.get('/resolution', async (req, res) => {
  const resolution = await shell.getResolution();

  res.json(resolution);
});

apiRouter.post('/image', async (req, res) => {
  const { body: { image } } = req;

  // if (!image) {
  //   image = await new Promise((resolve) => {
  //     fileUpload(req, res, (err) => {
  //       if (err) {
  //         console.log(err);
  //         return resolve(null);
  //       }

  //       const { buffer, originalname, mimetype } = req.file;
  //       // TODO: handle image uploads
  //     })
  //   })
  // }

  res.json({ message: 'Success' });
  shell.saveImage(image).catch(console.log);
});

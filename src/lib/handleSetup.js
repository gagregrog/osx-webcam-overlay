const u = require('./util');
const c = require('./constants');
const shell = require('./shell');

const handleCopyPlugin = async () => {
  u.log('Installing OSX Webcam Overlay into CamTwist\'s effects directory...');
  await shell.ensureEffectsPath();
  await shell.copyPlugin();
};

const handleCopySavedSetup = async () => {
  u.log('Creating a CamTwist Saved Setup for this plugin...');
  await shell.ensureSavedSetupPath();
  await shell.copySavedSetup();
};

const handleAutoLoadPlugin = async () => {
  u.log('Enabling autoload for this plugin...');
  const { code, stderr } = shell.autoLoadPlugin();

  if (code) {
    u.err(stderr);
    u.warn('Something went wrong setting up autoload.');
    u.log('You can set this up manually in CamTwist.');
  }
};

const handleVideoSize = async () => {
  u.log('Enabling custom video size in CamTwist...');
  let videoSize = null;

  if (shell.hasHDVideo()) {
    u.log('Setting video resolution to 1280x720.');
    videoSize = c.resHD;
  } else {
    u.log('Setting video resolution to 640x480.');
    videoSize = c.resSD;
  }

  await shell.setVideoMode(videoSize);
};

const handleCreateImagePath = async () => {
  u.log('Creating image repository...');

  await shell.ensureImageDir();
  await shell.eraseImage();
};

const handleCheckInstall = async () => {
  u.log('Confirming installation...');

  return shell.installIsOk();
};

const handleSetup = async () => {
  if (!(await shell.installCompleted())) {
    await shell.exitCamTwistIfOpen('Exiting CamTwist before installing plugin...');
    await handleCopyPlugin();
    await handleCopySavedSetup();
    await handleAutoLoadPlugin();
    await handleVideoSize();
    await handleCreateImagePath();
    const installOk = await handleCheckInstall();

    if (installOk) {
      u.log('OSX Webcam Overlay has been installed successfully!');
    } else {
      u.err(`Sorry, but an error occurred. ${c.effectName} was not installed properly.`);
    }
  }
};

module.exports = handleSetup;

const prompts = require('prompts');

const u = require('./util');
const c = require('./constants');
const shell = require('./shell');

const handleInstallPrompt = async () => {
  u.warn('In order to use OSX Webcam Overlay, you must first install CamTwist.');

  const { doNotInstall } = await prompts({
    type: 'toggle',
    name: 'doNotInstall',
    message: 'Would you like to install CamTwist 3.4.3?',
    inactive: 'Yes',
    active: 'No',
  });

  const proceed = (doNotInstall === false);

  if (!proceed) {
    u.warn('Sorry, but you must install CamTwist if you would like to use this project.');
    u.log('Please see http://camtwiststudio.com/ for more info.');
    process.exit();
  }
};

const handleDownloadDmg = () => {
  u.log(`Attempting to download ${c.dmgName}...`);
  const downloadOk = shell.downloadCamTwist();
  if (!downloadOk) {
    u.err('There was an error downloading CamTwist.');
    u.log('Try downloading and installing CamTwist yourself, and then re-run this cli.');
    process.exit();
  }

  u.log(`CamTwist successfully downloaded to ${c.camTwistDmgPath}`);
};

const handleOpenDmg = async () => {
  u.log(`Opening ${c.dmgName}...`);
  shell.openCamTwistDmg();

  const firstAttemptTime = Date.now();
  while ((Date.now() - firstAttemptTime) < 10000) {
    // eslint-disable-next-line
    if (await shell.camTwistIsMounted()) {
      return true;
    }

    // eslint-disable-next-line
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  u.err(`Could not open ${c.dmgName}.`);
  u.log('Please try to install CamTwist manually and then re-run this cli.');
  process.exit();
};

const handleStartInstall = () => {
  u.log('Initiating CamTwist installation.\n\nPlease return to this CLI once you\'ve completed the installation.');
  shell.startCamTwistInstall();
};

const handleInstallCompleted = async () => {
  let isCompleted = false;

  while (isCompleted === false) {
    // eslint-disable-next-line
    ({ isCompleted } = await prompts({
      type: 'toggle',
      name: 'isCompleted',
      message: 'Have you finished installing CamTwist?',
      inactive: 'No',
      active: 'Yes',
    }));

    if (isCompleted === false) {
      u.warn('Please finish the installation or press ctrl-c to exit.');
    }
  }

  if (!isCompleted) {
    u.warn('Sorry, but you must install CamTwist if you would like to use this project.');
    u.log('Please see http://camtwiststudio.com/ for more info.');
    process.exit();
  }

  const isInstalled = await shell.camTwistIsInstalled();

  if (!isInstalled) {
    u.err('Hmm. CamTwist does not seem to be installed properly.');
    u.info(`Please ensure that CamTwist is installed in ${c.camTwistAppPath} and then try again.`);
    process.exit();
  }
};

const handleInstallCamTwist = async () => {
  await handleInstallPrompt();
  handleDownloadDmg(); // downloads synchronously
  await handleOpenDmg();
  handleStartInstall();
  await handleInstallCompleted();
};

const handleOpenCamTwist = async () => {
  u.log('Opening CamTwist...');
  shell.openCamTwist();

  const firstAttemptTime = Date.now();
  while ((Date.now() - firstAttemptTime) < 10000) {
    // eslint-disable-next-line
    if (await shell.camTwistIsRunning()) {
      return true;
    }

    // eslint-disable-next-line
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  u.err('Could not open CamTwist.app.');
  u.log(`Please ensure CamTwist is installed and located at ${c.camTwistAppPath}.`);
  process.exit();
};

const handleCamTwist = async () => {
  const hasCamTwist = await shell.camTwistIsInstalled();

  if (!hasCamTwist) {
    await handleInstallCamTwist();
  }

  await handleOpenCamTwist();
  shell.registerCleanup();
};

module.exports = handleCamTwist;

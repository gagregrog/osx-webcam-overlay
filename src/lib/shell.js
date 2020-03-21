const ps = require('ps-node');
const fs = require('fs-extra');
const shelljs = require('shelljs');
const ON_DEATH = require('death');

const u = require('./util');
const c = require('./constants');

const shell = module.exports = {};

let EXITING = false;

const handleDefault = (keyVal, action = 'write') => shelljs.exec(`defaults ${action} ${c.defaultsCom} ${keyVal}`, { silent: true });

// CamTwist helpers
shell.camTwistIsInstalled = () => fs.pathExists(c.camTwistAppPath);

shell.camTwistIsMounted = () => fs.pathExists(c.pkgPath);

shell.downloadCamTwist = () => {
  const { code } = shelljs.exec(`curl -o ${c.camTwistDmgPath} ${c.camTwistUrl}`);

  return code === 0;
};

shell.openCamTwistDmg = () => {
  shelljs.exec(`open ${c.camTwistDmgPath}`);
};

shell.openCamTwist = () => {
  shelljs.exec(`open ${c.camTwistAppPath}`);
};

shell.startCamTwistInstall = () => {
  shelljs.exec(`open ${c.pkgPath}`);
};

shell.getCamTwistProcess = async () => new Promise((resolve, reject) => {
  ps.lookup({
    command: `${c.camTwistAppPath}/Contents/MacOS/CamTwist`,
  }, (err, results) => (err ? reject(err) : resolve(results[0])));
});

shell.camTwistIsRunning = async () => {
  const twist = await shell.getCamTwistProcess();

  return !!twist;
};

shell.exitCamTwistIfOpen = async (message = 'Exiting CamTwist...') => {
  const camTwistProcess = await shell.getCamTwistProcess();
  if (camTwistProcess) {
    const { pid } = camTwistProcess;
    await new Promise((resolve, reject) => {
      u.log(message);
      ps.kill(pid, err => (err ? reject(err) : resolve(true)));
    });
  }
};

// Image helpers
shell.saveImage = async (base64EncodedImage) => {
  const image = base64EncodedImage.replace(/^data:image\/png;base64,/, '');
  return fs.writeFile(c.imagePath, image, 'base64');
};
shell.eraseImage = async () => shell.saveImage(c.emptyImage);
shell.ensureImageDir = async () => fs.ensureDir(c.imageDir.slice(1, -1));
shell.imagePathExists = async () => fs.pathExists(c.imagePath);

shell.copy = (from, to) => shelljs.exec(`cp ${from} ${to}`);

// Plugin helpers
shell.resolutionIsSet = async () => fs.pathExists(c.resolutionPath);
shell.savedSetupIsSet = async () => fs.pathExists(c.camTwistConfigDestinationPath);
shell.pluginIsSet = async () => fs.pathExists(c.pluginDestinationPath);
shell.ensureEffectsPath = async () => fs.ensureDir(c.camTwistEffectsDir.slice(1, -1));
shell.ensureSavedSetupPath = async () => fs.ensureDir(c.camTwistSavedSetupsDir.slice(1, -1));
shell.copyPlugin = () => shell.copy(c.pluginSourcePath, c.pluginDestinationPath);
shell.copySavedSetup = async () => shell.copy(c.camTwistConfigSourcePath, c.camTwistConfigDestinationPath);
shell.pluginIsLoaded = async () => !shelljs.exec('defaults read com.allocinit.CamTwist autoload 2> /dev/null | grep osx-webcam-overlays > /dev/null').code;
shell.customVideoSizeIsSet = async () => handleDefault('usingCustomVideoSize', 'read').stdout.includes('1');
shell.customVideoResolutionIsSet = async () => ([c.resSD, c.resHD]
  .includes(`"${handleDefault('videoSize', 'read').stdout.replace('\n', '')}"`)
);

shell.autoLoadPlugin = async () => handleDefault(`autoload ${c.effectName}`);
shell.hasHDVideo = () => !shelljs.exec('system_profiler SPCameraDataType 2> /dev/null | grep "FaceTime HD" > /dev/null', { silent: true }).code;
shell.setVideoMode = async (videoSize) => {
  const [width, height] = videoSize.slice(2, -2).replace(' ', '').split(',').map(Number);
  const resolution = { width, height };
  handleDefault(`videoSize ${videoSize}`);

  return fs.writeJson(c.resolutionPath, resolution, { spaces: 2 });
};

// Install checks
shell.markInstalled = async () => fs.writeJSON(c.markInstalledPath, true);
shell.installCompleted = async () => fs.pathExists(c.markInstalledPath);
shell.installIsOk = async () => {
  try {
    Promise.all([
      shell.camTwistIsInstalled(),
      shell.resolutionIsSet(),
      shell.savedSetupIsSet(),
      shell.pluginIsSet(),
      shell.pluginIsLoaded(),
      shell.customVideoSizeIsSet(),
      shell.customVideoResolutionIsSet(),
      shell.imagePathExists(),
    ]);

    await shell.markInstalled();

    return true;
  } catch (e) {
    console.log(e);

    return false;
  }
};

// Cleanup
shell.registerCleanup = () => {
  ON_DEATH(async () => {
    if (EXITING) {
      return;
    }

    EXITING = true;
    u.log('Thanks for using OSX Webcam Overlay!');
    u.log('For more information, please go to https://github.com/RobertMcReed/osx-webcam-overlay#readme');
    await shell.exitCamTwistIfOpen();
    await shell.eraseImage();
    process.exit(0);
  });
};

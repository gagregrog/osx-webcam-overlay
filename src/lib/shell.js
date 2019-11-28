const ps = require('ps-node');
const fs = require('fs-extra');
const shelljs = require('shelljs');
const ON_DEATH = require('death');

const u = require('./util');
const c = require('./constants');

const shell = module.exports = {};

let EXITING = false;

shell.fileExists = (lsPath, name) => shelljs.exec(`ls ${lsPath} | grep -i "${name}"`, { silent: true }).stdout === `${name}\n`;

shell.camTwistIsInstalled = () => fs.pathExists('/Applications/CamTwist');

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

shell.exitCamTwistIfOpen = async () => {
  const camTwistProcess = await shell.getCamTwistProcess();
  if (camTwistProcess) {
    const { pid } = camTwistProcess;
    await new Promise((resolve, reject) => {
      u.log('Exiting CamTwist...');
      ps.kill(pid, err => (err ? reject(err) : resolve(true)));
    });
  }
};

shell.registerCleanup = () => {
  ON_DEATH(async () => {
    if (EXITING) {
      return;
    }

    EXITING = true;
    await shell.exitCamTwistIfOpen();
    process.exit(0);
  });
};

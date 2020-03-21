const path = require('path');
const shell = require('shelljs');

const c = module.exports = {};

c.prod = process.env.NODE_ENV === 'production';
c.home = shell.exec('echo $HOME', { silent: true }).stdout.replace('\n', '');
c.publicDir = path.resolve(`${__dirname}/../public`);
c.pluginSrcDir = path.resolve(`${__dirname}/../plugin`);
c.emptyImagePath = `${path.resolve(`${__dirname}/../img`)}/image.png`;
c.emptyImage = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2NkAAIAAAoAAggA9GkAAAAASUVORK5CYII=';

c.volumeName = 'CamTwist_3.4.3';
c.dmgName = `${c.volumeName}.dmg`;
c.camTwistDmgPath = `${c.home}/Downloads/${c.dmgName}`;
c.camTwistAppPath = '/Applications/CamTwist/CamTwist.app';
c.pkgPath = `/Volumes/${c.volumeName}/CamTwist.pkg`;
c.camTwistUrl = `http://camtwiststudio.com/beta/${c.dmgName}`;
c.applicationSupport = `${c.home}/Library/Application Support`;
c.camTwistDataDir = `"${c.applicationSupport}/CamTwist`;
c.camTwistEffectsDir = `${c.camTwistDataDir}/Effects"`;
c.camTwistSavedSetupsDir = `${c.camTwistDataDir}/Saved Setups"`;
c.effectName = 'webcam-overlay';
c.pluginName = `${c.effectName}.qtz`;
c.xmlConfig = 'WebcamOverlay.xml';
c.pluginDestinationPath = `${c.camTwistEffectsDir.slice(0, -1)}/${c.pluginName}"`;
c.pluginSourcePath = `${c.pluginSrcDir}/${c.pluginName}`;
c.camTwistConfigSourcePath = `${c.pluginSrcDir}/${c.xmlConfig}`;
c.camTwistConfigDestinationPath = `${c.camTwistSavedSetupsDir.slice(0, -1)}/${c.xmlConfig}"`;
c.resolutionPath = `${c.pluginSrcDir}/resolution.json`;
c.markInstalledPath = `${c.pluginSrcDir}/installed.json`;
c.defaultsCom = 'com.allocinit.CamTwist';
c.resHD = '"{1280, 720}"';
c.resSD = '"{640, 480}"';

c.orgName = `org.rumorlabs.${c.effectName}`;
c.imageDir = `"${c.applicationSupport}/${c.orgName}`;
c.imagePath = `${c.imageDir}/image.png`;

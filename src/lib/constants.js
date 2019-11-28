const path = require('path');

const c = module.exports = {};

c.prod = process.env.NODE_ENV === 'production';
c.publicDir = path.resolve(`${__dirname}/../public`);
c.volumeName = 'CamTwist_3.4.3';
c.dmgName = `${c.volumeName}.dmg`;
c.camTwistDmgPath = `~/Downloads/${c.dmgName}`;
c.camTwistAppPath = '/Applications/CamTwist/CamTwist.app';
c.pkgPath = `/Volumes/${c.volumeName}/CamTwist.pkg`;
c.camTwistUrl = `http://camtwiststudio.com/beta/${c.dmgName}`;

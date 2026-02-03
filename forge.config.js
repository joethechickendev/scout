const path = require('path');
const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,
    icon: path.join(__dirname, 'images', 'icon'),
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        icon: path.join(__dirname, 'images', 'icon.ico'),
        name: 'FRC Scouting Installer'
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: [],
      config: {
        icon: path.join(__dirname, 'images', 'icon.png'),
        name: 'FRC Scouting Installer'
      }
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        icon: path.join(__dirname, 'images', 'icon.png'),
        name: 'FRC Scouting Installer'
      },
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        icon: path.join(__dirname, 'images', 'icon.icns'),
        name: 'FRC Scouting Installer'
      },
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    // Modèle du maker pour une build `.msi`, donc adaptée à Windows.
    {
      name: '@electron-forge/maker-wix',
      config: {
        language: 1033,
        name: "Taxonomina",
        description: "Taxonomina",
        manufacturer: 'Noah Boos AKA Rift',
        version: "1.0.0",
        shortcutFolderName: "Taxonomina",
        ui: {
          chooseDirectory: true
        },
        shortcuts: {
          desktop: true,
          startMenu: true
        }
      }
    },
    // {
    //   name: '@electron-forge/maker-deb',
    //   config: {
    //       options: {
    //           maintainer: 'Noah Boos AKA Rift',
    //           genericName: 'Taxonomina',
    //           description: 'Taxonomina',
    //           categories: ['Utility', 'Education'],
    //           icon: "./assets/icon.ico",
    //       }
    //   }
    // },
    // {
    //   name: '@electron-forge/maker-rpm',
    //   config: {
    //       options: {
    //           maintainer: 'Noah Boos AKA Rift',
    //           summary: 'Taxonomina',
    //           description: 'Taxonomina',
    //           icon: "./assets/icon.ico",
    //       }
    //   }
    // }
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

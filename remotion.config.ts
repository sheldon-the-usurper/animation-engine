import { Config } from '@remotion/cli/config';

// Basic render settings
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setCodec('h264');

// Stability flags for Fedora/Headless environments using available 4.0 methods
Config.setChromiumOpenGlRenderer('angle');
Config.setChromiumHeadlessMode(true); 
Config.setChromiumDisableWebSecurity(true);
Config.setChromiumIgnoreCertificateErrors(true);
Config.setBrowserExecutable('/usr/bin/google-chrome');

// Increase timeout for complex bundles
Config.setDelayRenderTimeoutInMilliseconds(120000);

Config.overrideFfmpegCommand(({ args }) => {
  return args;
});

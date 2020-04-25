const ts_preset = require('ts-jest/jest-preset');
const puppeteer_preset = require('jest-puppeteer/jest-preset');

module.exports = {
  preset: Object.assign(ts_preset, puppeteer_preset),
  testRegex: './*\\.test\\.ts$',
};

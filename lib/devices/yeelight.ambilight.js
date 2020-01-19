'use strict';

const { Yeelight, Ambilight } = require('./yeelight');

module.exports = class YeelightAmbilight extends Yeelight.with(Ambilight) {
};

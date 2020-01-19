'use strict';

const { Children } = require('abstract-things');
const { WallSwitch } = require('abstract-things/electrical');
const { Actions } = require('abstract-things/controllers');

const SubDevice = require('./subdevice');
const LightChannel = require('./light-channel');

/**
 * Dual-channel light switch.
 */
module.exports = class CtrlNeutral2 extends WallSwitch.with(SubDevice, Children, Actions) {

	static get type() {
		return 'miio:power-switch';
	}

	constructor(parent, info) {
		super(parent, info);

		this.miioModel = 'lumi.ctrl_neutral2';

		this.defineProperty('channel_0', {
			name: 'powerChannel0',
			mapper: v => v === 'on'
		});
		this.defineProperty('channel_1', {
			name: 'powerChannel1',
			mapper: v => v === 'on'
		});

		this.addChild(new LightChannel(this, 0));
		this.addChild(new LightChannel(this, 1));

		this.updateActions([
			'ch0-on',
			'ch0-off',
			'ch1-on',
			'ch1-off',
		]);
	}

	changePowerChannel(channel, power) {
		return this.call('toggle_ctrl_neutral', [ 'neutral_' + channel, power ? 'on' : 'off' ]);
	}

	propertyUpdated(key, value) {
		super.propertyUpdated(key, value);

		switch(key) {
			case 'powerChannel0':
				this.child('0').updatePower(value);
				break;
			case 'powerChannel1':
				this.child('1').updatePower(value);
				break;
		}
	}

	_report(data) {
		super._report(data);

		if(typeof data['voltage'] === 'undefined') {
			if(typeof data['channel_0'] !== 'undefined') {
				const action = 'ch0-' + data['channel_0'];
				this.debug('Action performed:', action);
				this.emitAction(action);
			}

			if(typeof data['channel_1'] !== 'undefined') {
				const action = 'ch1-' + data['channel_1'];
				this.debug('Action performed:', action);
				this.emitAction(action);
			}

			if(typeof data['dual_channel'] !== 'undefined') {
				const action = data['dual_channel'];

				this.debug('Action performed:', action);
				this.emitAction(action);
			}
		}
	}
};


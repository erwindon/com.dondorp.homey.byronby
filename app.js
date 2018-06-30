// Homey App for Byron BY series doorbells

// Author: Erwin Dondorp
// E-Mail: byronby@dondorp.com

// PUSH BUTTONs
// ============
// BY30 8 codes, tested
// BY32 8 codes?
// BY33 8 codes
// BY34 8 codes?
// BY35 8 codes?
// BY37 6 codes?
// BY37Z 6 codes?

// DOOR CHIMEs
// ===========
// BY101    4 melodies B
// BY102    4 melodies B
// BY103    4 melodies B
// BY112    4 melodies B
// BY201    6 melodies C
// BY201F   6 melodies C
// BY202    6 melodies C
// BY202F   6 melodies C
// BY206E   8 melodies unspecified
// BY206FE  8 melodies unspecified
// BY212    6 melodies C
// BY213    6 melodies C
// BY216    8 melodies unspecified ???
// BY216E   8 melodies unspecified
// BY216FE  8 melodies unspecified
// BY236E   8 melodies unspecified
// BY236FE  8 melodies unspecified
// BY301    8 melodies A
// BY302    8 melodies A
// BY313    8 melodies A
// BY329    8 melodies A
// BY349    8 melodies A
// BY401B   4 melodies unspecified
// BY401W   4 melodies unspecified tested
// BY403    4 melodies B
// BY501E   8 melodies
// BY502E   8 melodies Unspecified
// BY502ZE  8 melodies
// BY503ZE  8 melodies
// BY504E   8 melodies
// BY511E   8 melodies
// BY514E   8 melodies
// BY532E   8 melodies
// BY535E   8 melodies
// BY601E   8 melodies
// BY611E   8 melodies Unspecified
//
// 8 melodies A
// ============
// 0 = Tubular 3-notes
// 1 = Big Ben
// 2 = Tubular 2-notes
// 3 = Solo
// 4 = Tubular Scare
// 5 = Clarinet
// 6 = Saxophone
// 7 = Morning Dew
//
// 4 melodies B
// ==========
// 0 = Ding Dong (repeat)
// 1 = Westminster
// 2 = Alarm
// 3 = Ding Dong Ding
// (4-7) play as (0-3)
//
// 6 melodies C
// ============
// 0 = Tubular 3-notes
// 1 = Big Ben
// 2 = Tubular 2-notes
// 3 = Solo
// 4 = Tubular Scare
// 5 = Clarinet

'use strict';

const Homey = require('homey');

// remember when the bells last sounded
// so that we don't trigger too often
// and so that we can help with pairing
const Global = require('../drivers/global.js');
Global.allLastRings = {};

// The internal IDs are different from the melody numbers
// This translation table converts from ID to melody-number
// Only 8 out of 16 IDs are used
var melodyNrs = {
	0: 4,
	1: 3,
	2: 2,
	3: 1,
	4: 4,
	5: 3,
	6: 2,
	7: 1,
	};

var melodyIds = {
	1: 3,
	2: 2,
	3: 1,
	4: 0,
	5: 3,
	6: 2,
	7: 1,
	8: 0,
}

let buttonPressedTriggerGeneric = new Homey.FlowCardTrigger('receive_signal_generic');
buttonPressedTriggerGeneric.register();

let buttonPressedTriggerPaired = new Homey.FlowCardTrigger('receive_signal_paired');
buttonPressedTriggerPaired.register();

// create & register a signal using the id from your app.json
let byronBySignal = new Homey.Signal433('ByronBySignal');
byronBySignal.register()
	.then(() => {
		console.log("byronBySignal.register.then");

		// Analysis for melodyBits:
		// payload: 0,0,0,0,1,0,1,1,0,1,0,1,1,0,0,0 Ding Dong Ding
		// payload: 0,0,0,0,1,0,1,1,0,1,0,1,1,0,0,1 Alarm
		// payload: 0,0,0,0,1,0,1,1,0,1,0,1,1,0,1,0 Westminster
		// payload: 0,0,0,0,1,0,1,1,0,1,0,1,1,0,1,1 Ding Dong (repeat)
		// payload: 0,0,0,0,1,0,1,1,0,1,0,1,1,1,0,0 Ding Dong Ding
		// payload: 0,0,0,0,1,0,1,1,0,1,0,1,1,1,0,1 Alarm
		// payload: 0,0,0,0,1,0,1,1,0,1,0,1,1,1,1,0 Westminster
		// payload: 0,0,0,0,1,0,1,1,0,1,0,1,1,1,1,1 Ding Dong (repeat)
		// 8 other possible melodies in last 3 bits
		// BY401W only uses the last 2 bits

		// Other deviceIds
		// button seems to generate the same codes also after battery change
		// we'll just assume that the device-id is in the first 13 bits

		byronBySignal.on('payload', function(payload, first) {
			console.log('received: signal:[' + payload + '], first:' + first);

			// take the relevant groups of bits
			var buttonBits = payload.slice(0, 13);
			var melodyBits = payload.slice(13, 16);

			// get the values from the bit-patterns
			var buttonId =
				buttonBits[0] * 4096 +
				buttonBits[1] * 2048 +
				buttonBits[2] * 1024 +
				buttonBits[3] * 512 +
				buttonBits[4] * 256 +
				buttonBits[5] * 128 +
				buttonBits[6] * 64 +
				buttonBits[7] * 32 +
				buttonBits[8] * 16 +
				buttonBits[9] * 8 +
				buttonBits[10] * 4 +
				buttonBits[11] * 2 +
				buttonBits[12] * 1;
			var melodyId =
				melodyBits[0] * 4 +
				melodyBits[1] * 2 +
				melodyBits[2] * 1;

			var melodyNr = melodyNrs[melodyId];

			// Controller seems to return multiple events with "first=true"
			// Therefore we use our own mechanism
			// Administation is per buttonId
			// Allow quick changes of melodyId
			var now = Date.now();
			var lastRing = Global.allLastRings[buttonId];
			if(lastRing === undefined)
				lastRing = {"dateTime":0, "melodyId":-1};
			var millis = now - lastRing.dateTime;
			if(millis < 3000 && melodyId == lastRing.melodyId)
			{
				// Accept only one ring within 3 seconds
				// console.log('IGNORED button: [' + buttonBits + ']=' + buttonId + ', melody: [' + melodyBits + ']=' + melodyId + "(" + melodyNr + "), first: " + first);
				return;
			}

			Global.allLastRings[buttonId] = {"dateTime":now, "melodyId":melodyId};

			console.log('buttonId: [' + buttonBits + ']=' + buttonId + ', melodyId: [' + melodyBits + ']=' + melodyId + ', melodyNr: ' + melodyNr);

			var tokensGeneric = {
				'buttonId': buttonId,
				'melodyId': melodyId,
				'melodyNr': melodyNr
				};
			var stateGeneric = {
				};
			buttonPressedTriggerGeneric
				.trigger(tokensGeneric, stateGeneric)
				.catch(this.error)
				.then(this.log);

			var tokensPaired = {
				'buttonId': buttonId,
				'melodyId': melodyId,
				'melodyNr': melodyNr
				};
			var statePaired = {
				};
			buttonPressedTriggerPaired
				.trigger(tokensPaired, statePaired)
				.catch(this.error)
				.then(this.log);
		})
})
.catch(this.error);

let ringBellActionNrAGeneric = new Homey.FlowCardAction('send_ring_melodynrA_generic');
ringBellActionNrAGeneric.register();

let ringBellActionNrAPaired = new Homey.FlowCardAction('send_ring_melodynrA_paired');
ringBellActionNrAPaired.register();

let ringBellActionNrBGeneric = new Homey.FlowCardAction('send_ring_melodynrB_generic');
ringBellActionNrBGeneric.register();

let ringBellActionNrBPaired = new Homey.FlowCardAction('send_ring_melodynrB_paired');
ringBellActionNrBPaired.register();

let ringBellActionNrCGeneric = new Homey.FlowCardAction('send_ring_melodynrC_generic');
ringBellActionNrCGeneric.register();

let ringBellActionNrCPaired = new Homey.FlowCardAction('send_ring_melodynrC_paired');
ringBellActionNrCPaired.register();

let ringBellActionIdGeneric = new Homey.FlowCardAction('send_ring_melodyid_generic');
ringBellActionIdGeneric.register();

let ringBellActionIdPaired = new Homey.FlowCardAction('send_ring_melodyid_paired');
ringBellActionIdPaired.register();

function getBits(buttonId, melodyId)
{
	// +8192 to force fixed length of 14 bits
	// then use bits 1..13 (but not bit 0)
	var buttonIdBits = (buttonId + 8192).toString(2);
	var melodyIdBits = (melodyId + 8).toString(2);
	return [
			parseInt(buttonIdBits[1]),
			parseInt(buttonIdBits[2]),
			parseInt(buttonIdBits[3]),
			parseInt(buttonIdBits[4]),
			parseInt(buttonIdBits[5]),
			parseInt(buttonIdBits[6]),
			parseInt(buttonIdBits[7]),
			parseInt(buttonIdBits[8]),
			parseInt(buttonIdBits[9]),
			parseInt(buttonIdBits[10]),
			parseInt(buttonIdBits[11]),
			parseInt(buttonIdBits[12]),
			parseInt(buttonIdBits[13]),
			parseInt(melodyIdBits[1]),
			parseInt(melodyIdBits[2]),
			parseInt(melodyIdBits[3]),
			];
}

class ByronByDoorbell extends Homey.App {

	logit(err, result) {
		console.log("err: " + err + ", result: " + result);
	}

	onInit() {
		this.log("ByronByDoorbell.onInit");

		ringBellActionNrAGeneric.registerRunListener((args, state) => {
			var buttonId = args['buttonId']
			var melodyNr = args['melodyNr']
			this.log('RING-A-GENERIC: buttonId:' + buttonId + ', melodyNr:' + melodyNr);
			var melodyId = melodyIds[melodyNr];
			var bits = getBits(buttonId, melodyId);
			byronBySignal.tx(bits, this.logit);
			return true;
		});

		ringBellActionNrBGeneric.registerRunListener((args, state) => {
			var buttonId = args['buttonId']
			var melodyNr = args['melodyNr']
			this.log('RING-B-GENERIC: buttonId:' + buttonId + ', melodyNr:' + melodyNr);
			var melodyId = melodyIds[melodyNr];
			var bits = getBits(buttonId, melodyId);
			byronBySignal.tx(bits, this.logit);
			return true;
		});

		ringBellActionNrCGeneric.registerRunListener((args, state) => {
			var buttonId = args['buttonId']
			var melodyNr = args['melodyNr']
			this.log('RING-C-GENERIC: buttonId:' + buttonId + ', melodyNr:' + melodyNr);
			var melodyId = melodyIds[melodyNr];
			var bits = getBits(buttonId, melodyId);
			byronBySignal.tx(bits, this.logit);
			return true;
		});

		ringBellActionIdGeneric.registerRunListener((args, state) => {
			var buttonId = args['buttonId']
			var melodyId = args['melodyId']
			this.log('RING-ID-GENERIC: buttonId:' + buttonId + ', melodyId:' + melodyId);
			var bits = getBits(buttonId, melodyId);
			this.log("bits:", bits);
			byronBySignal.tx(bits, this.logit);
			return true;
		});


		ringBellActionNrAPaired.registerRunListener((args, state) => {
			var buttonId = parseInt(args['bell_nrA_paired'].getData()["buttonId"]);
			var melodyNr = args['melodyNr']
			this.log('RING-A-PAIRED: buttonId:' + buttonId + ', melodyNr:' + melodyNr);
			var melodyId = melodyIds[melodyNr];
			var bits = getBits(buttonId, melodyId);
			byronBySignal.tx(bits, this.logit);
			return true;
		});

		ringBellActionNrBPaired.registerRunListener((args, state) => {
			var buttonId = parseInt(args['bell_nrB_paired'].getData()["buttonId"]);
			var melodyNr = args['melodyNr']
			this.log('RING-B-PAIRED: buttonId:' + buttonId + ', melodyNr:' + melodyNr);
			var melodyId = melodyIds[melodyNr];
			var bits = getBits(buttonId, melodyId);
			byronBySignal.tx(bits, this.logit);
			return true;
		});

		ringBellActionNrCPaired.registerRunListener((args, state) => {
			var buttonId = parseInt(args['bell_nrC_paired'].getData()["buttonId"]);
			var melodyNr = args['melodyNr']
			this.log('RING-C-PAIRED: buttonId:' + buttonId + ', melodyNr:' + melodyNr);
			var melodyId = melodyIds[melodyNr];
			var bits = getBits(buttonId, melodyId);
			byronBySignal.tx(bits, this.logit);
			return true;
		});

		ringBellActionIdPaired.registerRunListener((args, state) => {
			var buttonId = parseInt(args['bell_id_paired'].getData()["buttonId"]);
			var melodyId = args['melodyId']
			this.log('RING-ID-PAIRED: buttonId:' + buttonId + ', melodyId:' + melodyId);
			var bits = getBits(buttonId, melodyId);
			this.log("bits:", bits);
			byronBySignal.tx(bits, this.logit);
			return true;
		});

		this.log('ByronByDoorbell is running...');
	}
}

module.exports = ByronByDoorbell;

// vim:ts=4

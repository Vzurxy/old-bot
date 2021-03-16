const Command = require('./shared/Command');
const { letterTrans } = require('custom-translate');
const dictionary = require('./upside-down/upside-down.json');

module.exports = class UpsideDownCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'upside-down',
			aliases: ['u-down'],
			group: 'edit-text',
			memberName: 'upside-down',
			description: 'Flips text upside-down.',
			args: [
				{
					key: 'text',
					prompt: 'What text would you like to flip upside-down?',
					type: 'string'
				}
			]
		});
	}

	run(msg, { text }) {
		return msg.say(letterTrans(text, dictionary).split('').reverse().join(''));
	}
};

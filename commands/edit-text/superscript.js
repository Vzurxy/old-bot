const Command = require('./shared/Command');
const { letterTrans } = require('custom-translate');
const dictionary = require('./superscript/superscript.json');

module.exports = class SuperscriptCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'superscript',
			aliases: ['tiny-text', 'small-text'],
			group: 'edit-text',
			memberName: 'superscript',
			description: 'Converts text to tiny text.',
			args: [
				{
					key: 'text',
					prompt: 'What text would you like to convert to tiny text?',
					type: 'string'
				}
			]
		});
	}

	run(msg, { text }) {
		return msg.say(letterTrans(text, dictionary));
	}
};

const Command = require('./shared/Command');
const { letterTrans } = require('custom-translate');
const dictionary = require('./dvorak/dvorak.json');

module.exports = class DvorakCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dvorak',
			group: 'edit-text',
			memberName: 'dvorak',
			description: 'Converts text to Dvorak encoding.',
			args: [
				{
					key: 'text',
					prompt: 'What text would you like to convert to Dvorak encoding?',
					type: 'string',
					validate: text => {
						if (letterTrans(text, dictionary).length < 2000) return true;
						return 'Invalid text, your text is too long.';
					}
				}
			]
		});
	}

	run(msg, { text }) {
		return msg.say(letterTrans(text, dictionary));
	}
};

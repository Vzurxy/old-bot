const Command = require('./shared/Command');

module.exports = class BaseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'basecmd',
			aliases: [],
			group: 'util',
			memberName: 'basecmd',
            description: 'Base command',
            ownerOnly: true
		});
	}

	run(message) {
		return message.say('(☞ﾟヮﾟ)☞ gay ☜(ﾟヮﾟ☜)')
	}
};
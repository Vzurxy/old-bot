const Command = require('./shared/Command');
const { stripIndents } = require('common-tags');
const { formatNumber } = require('./shared/Util');

module.exports = class PingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ping',
			aliases: ['pong', 'ping-pong'],
			group: 'util-public',
			memberName: 'ping',
			description: 'Checks the bot\'s ping to the Discord server.',
			guarded: true
		});
	}

	async run(msg) {
		const message = await msg.say('Pinging...');
		const ping = Math.round(message.createdTimestamp - msg.createdTimestamp);
		return message.edit(stripIndents`
			🏓 P${'o'.repeat(Math.min(Math.round(ping / 100), 1500))}ng! \`${formatNumber(ping)}ms\`
			Heartbeat: \`${formatNumber(Math.round(this.client.ws.ping))}ms\`
		`);
	}
};

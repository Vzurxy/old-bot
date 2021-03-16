const Derieri = require('derieri');
const { MessageEmbed } = require('discord.js');
const Command = require('./shared/Command');

const deri = new Derieri.Client({
	islearning: true
});

module.exports = class Ping extends Command {
	constructor(client) {
		super(client, {
			name: 'cleverbot',
			aliases: [],
			group: 'util',
			memberName: 'cleverbot',
			description: 'Query a cleverbot.',
			throttling: {
				usages: 1,
				duration: 8
			},
			args: [
				{
					key: 'msg',
					prompt: 'Please give a message to query!',
					type: 'string'
				}
			]
		});
	}

	run(message, { msg }) {
		const lastMsg = this.client.user.lastMessage;
		if (lastMsg && lastMsg.embeds.length > 0) {
			deri.reply(msg, [lastMsg.embeds[0].description]).then(response => {
				const embed = new MessageEmbed()
					.setColor('#0x202225')
					.setTitle('Cleverbot')
					.setDescription(`${response}`)
					.setTimestamp();

				message.say(embed);
			});
		} else {
			deri.reply(msg).then(response => {
				const embed = new MessageEmbed()
					.setColor('#0x202225')
					.setTitle('Cleverbot')
					.setDescription(`${response}`)
					.setTimestamp();

				message.say(embed);
			});
		}
	}
};

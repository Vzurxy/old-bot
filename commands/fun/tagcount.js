/* eslint-disable class-methods-use-this */

const { MessageEmbed } = require('discord.js');
const db = require('./shared/tags');
const Command = require('./shared/Command');

module.exports = class TagCount extends Command {
	constructor(client) {
		super(client, {
			name: 'tagcount',
			aliases: ['counttag'],
			group: 'fun',
			memberName: 'tagcount',
			description: 'Gives tag count.',
			throttling: {
				usages: 2,
				duration: 10
			}
		});
	}

	async run(message) {
		await db.find({ guild: message.guild.id }, (err, data) => {
			if (err) throw err;
			if (data) {
				const embed = new MessageEmbed()
					.setColor('#0x202225')
					.setTitle('Bot')
					.setDescription(`There are currently ${data.length} tags.`)
					.setTimestamp();

				message.say(embed);
			}
		});
	}
};

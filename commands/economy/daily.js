/* eslint-disable class-methods-use-this */

const { stripIndents } = require('common-tags');
const { MessageEmbed } = require('discord.js');
const ms = require('parse-ms');
const Command = require('./shared/Command');
const Economy = require('./shared/Economy');
const { randomRange } = require('./shared/util');

module.exports = class BaseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'daily',
			aliases: [],
			group: 'economy',
			memberName: 'daily',
			description: "Get's your daily bobux. Resets every 3 hours."
		});
	}

	async run(message) {
		const user = message.author;
		const data = Economy.fetchMember(user.id);

		if (!data) {
			const newData = await Economy.createMember(user.id);
			const money = randomRange(2000, 3000);
			newData.daily = Date.now();

			await Economy.addMoney(user.id, money);

			return message.reply(
				new MessageEmbed()
					.setColor('RANDOM')
					.setTitle('daily')
					.setDescription(`you got ⏣ **${money}** nice`)
					.setTimestamp()
			);
		}

		if (10800000 - (Date.now() - data.dailySlowmode) > 0) {
			const time = ms(10800000 - (Date.now() - data.dailySlowmode));

			return message.reply(
				new MessageEmbed()
					.setColor('RANDOM')
					.setTitle('daily')
					.setDescription(
						stripIndents`
						you already claimed today noob claim in:\n
						\`${time.hours}h\`, \`${time.minutes}m\`, and \`${time.seconds}s\``
					)
					.setTimestamp()
			);
		}

		const money = randomRange(2000, 3000);
		await Economy.addMoney(user.id, money);

		await Economy.updateOne(
			{ user: user.id },
			{
				dailySlowmode: Date.now()
			}
		);

		return message.say(
			new MessageEmbed()
				.setColor('RANDOM')
				.setTitle('daily')
				.setDescription(
					stripIndents`
                    you got ⏣ **${money}** nice
                `
				)
				.setTimestamp()
		);
	}
};

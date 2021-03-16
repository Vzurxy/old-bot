/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */

const { MessageEmbed } = require('discord.js');
const Economy = require('./shared/economy');
const Command = require('./shared/Command');
const EconomyStructure = require('./shared/Economy');
const { randomRange } = require('./shared/util');

module.exports = class BaseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'gamble',
			aliases: [],
			group: 'economy',
			memberName: 'gamble',
			description: "Gamble's your money. 2x if win, 2.5x if lose.",
			args: [
				{
					key: 'amount',
					type: 'integer',
					prompt: 'How much would you like to gamble?',
					validate: val => val < 0
				}
			]
		});
	}

	async run(message, { amount }) {
		const user = message.author;
		const win = Math.random() > 0.4;

		const data = await EconomyStructure.fetchMember(user.id);

		if (!data) {
			await EconomyStructure.createMember(user.id);

			return message.say(
				new MessageEmbed()
					.setColor('RANDOM')
					.setTitle('balance')
					.setDescription(`You have nothing to gamble!`)
					.setTimestamp()
			);
		}

		if (amount === 'all' || amount === 'max') {
			amount = data.money;
		} else {
			amount = Number(amount.replace(/,|_/g, ''));
		}

		if (data.money < amount) {
			return message.reply("you don't have enough 🤡");
		}

		if (win) {
			const money = randomRange(amount * 1.5, amount * 2);

			await Economy.updateOne(
				{ user: user.id },
				{
					money: data.money + money
				}
			);

			return message.reply(
				new MessageEmbed()
					.setColor('RANDOM')
					.setTitle('gamble')
					.setDescription(`you got ⏣ **${money}** nice`)
					.setTimestamp()
			);
		}

		const money = this.clamp(
			randomRange(amount * 2, amount * 2.5),
			0,
			amount
		);

		await Economy.updateOne(
			{ user: user.id },
			{
				money: data.money - money
			}
		);

		return message.reply(
			new MessageEmbed()
				.setColor('RANDOM')
				.setTitle('gamble')
				.setDescription(`you lost ⏣ **${money}** be grateful`)
				.setTimestamp()
		);
	}

	clamp(num, min, max) {
		return Math.min(Math.max(num, min), max);
	}
};

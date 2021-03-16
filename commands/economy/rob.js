/* eslint-disable class-methods-use-this */

const { stripIndents } = require('common-tags');
const { MessageEmbed } = require('discord.js');
const abbreviate = require('number-abbreviate');
const Command = require('./shared/Command');
const Economy = require('./shared/Economy');

module.exports = class BaseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'rob',
			aliases: [],
			throttling: { usages: 1, duration: 30 },
			group: 'economy',
			memberName: 'rob',
			description: "Rob's someone.",
			args: [
				{
					key: 'user',
					prompt: 'please specify a user (@, id, name)',
					type: 'user'
				}
			]
		});
	}

	async run(message, { user }) {
		const result = await Economy.robUser(message.author.id, user.id);

		if (typeof result === 'string') {
			let failMessage;

			switch (result) {
				case 'SAME_USER':
					failMessage =
						"you can't rob yourself what are you even doing 😩";
					break;
				case 'NOT_ENOUGH_ROBBER':
					failMessage = 'please have atleast 1000 ⏣';
					break;
				case 'NOT_ENOUGH_VICTIM':
					failMessage = "the victim isn't worth enough ( < ⏣ 500)";
					break;
				default:
					break;
			}

			return message.reply(failMessage);
		}

		if (result.success) {
			return message.say(
				new MessageEmbed()
					.setColor('RANDOM')
					.setTitle('rob')
					.setDescription(
						stripIndents`
                    you successfully robbed <@${user.id}> of ⏣ ${abbreviate(
							result.moneyStolen
						)}.
                    you now have ⏣ ${abbreviate(
						result.robberData.money + result.moneyStolen
					)}, and they have ⏣ ${abbreviate(
							result.victimData.money - result.moneyStolen
						)}.
                `
					)
					.setFooter('✅')
			);
		}

		return message.say(
			new MessageEmbed()
				.setColor('RANDOM')
				.setTitle('rob')
				.setDescription(
					stripIndents`
                    you failed to rob <@${user.id}>.
                    you lost ⏣ ${abbreviate(result.moneyLost)}.
                    you now have ⏣ ${abbreviate(
						result.robberData.money - result.moneyLost
					)}.
                `
				)
				.setFooter('❌')
		);
	}
};

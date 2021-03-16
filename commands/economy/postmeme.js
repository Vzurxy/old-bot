/* eslint-disable no-lonely-if, class-methods-use-this, max-len, complexity */

const Memes = ['normie', 'edgy', 'reposted', 'intellectual', 'wholesome'];
const { stripIndents } = require('common-tags');
const { MessageEmbed } = require('discord.js');
const Economy = require('./shared/economy');
const Command = require('./shared/Command');
const EconomyStructure = require('./shared/Economy');
const Emojis = require('./postmeme/Emojis');
const { randomRange } = require('./shared/util');

let MemeDescription = '';

Memes.forEach(Meme => {
	MemeDescription += `\`${Meme.substr(0, 1)}\` ${Emojis.red} **${Meme}** \n`;
});

MemeDescription = MemeDescription.replace(/undefined/g, '');

module.exports = class BaseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'postmeme',
			aliases: ['pm'],
			group: 'economy',
			memberName: 'postmeme',
			description: "Post's a meme."
		});
	}

	async run(message) {
		const user = message.author;

		message.reply(
			new MessageEmbed()
				.setColor('RANDOM')
				.setTitle(`meme`)
				.setDescription(
					stripIndents`
                What type of meme?
                ${MemeDescription}
			`
				)
				.setFooter('🤡')
		);

		const filter = res => {
			let value = res.content.toLowerCase();

			Memes.forEach(meme => {
				if (meme.substr(0, 1) === value) {
					value = meme;
				}
			});

			return (
				Memes.includes(value) &&
				(user ? res.author.id === user.id : true)
			);
		};

		const verify = await message.channel.awaitMessages(filter, {
			max: 1,
			time: 30000
		});

		if (!verify.size) return;

		let choice = verify.first().content.toLowerCase();

		Memes.forEach(meme => {
			if (meme.substr(0, 1) === choice) {
				choice = meme;
			}
		});

		const range = randomRange(1, randomRange(30, 50));
		let moneyRange = 0;

		switch (choice) {
			case 'normie':
				if (range <= 30) {
					// Success
					if (range <= 2) {
						// 1 & 2
						moneyRange = randomRange(175, 250);
						message.say(
							`Your normie meme was GODLY and received a load of upvotes. ⏣ **${moneyRange}** received. 📈👌🤡👍📈`
						);
					} else if (range >= 3 && range <= 6) {
						// Between 3 and 6
						moneyRange = randomRange(100, 150);
						message.say(
							`Your normie meme was **great** and received a lots of upvotes. ⏣ **${moneyRange}** received. 👌🤡👍📈`
						);
					} else if (range >= 7 && range <= 15) {
						// Between 7 and 15
						moneyRange = randomRange(75, 100);
						message.say(
							`Your normie meme was **decent** and received some ok responses. ⏣ **${moneyRange}** received. 👌🤡`
						);
					} else if (range >= 16 && range <= 25) {
						// Between 16 and 25
						moneyRange = randomRange(80, 125);
						message.say(
							`Your normie meme was **above average** and received some good responses. ⏣ **${moneyRange}** received. 🤡👍`
						);
					} else if (range >= 26 && range <= 30) {
						moneyRange = randomRange(175, 200);
						message.say(
							`Your normie meme was **very great** and received some great responses. ⏣ **${moneyRange}** received. 👌🤡👍`
						);
					}
				} else {
					let description;
					if (range >= 31 && range <= 35) {
						description =
							'Your normie meme was **horrible** and received a lots of downvotes. 😢📉';
					} else if (range >= 36 && range <= 40) {
						description =
							'Your normie meme was **bad** and received some bad responses. 😢';
					} else if (range >= 41 && range <= 45) {
						description =
							'Your normie meme was **dogshit** and received some shit responses. 👎😢';
					} else if (range >= 46 && range <= 50) {
						description =
							'Your normie meme was **stupid** and received some stagnant responses. 😔';
					}

					message.say(description);
				}
				break;
			case 'edgy':
				if (range <= 30) {
					// Success
					if (range <= 2) {
						// 1 & 2
						moneyRange = randomRange(175, 250);
						message.say(
							`Your edgy meme was **the EDGY** and received a load of upvotes. ⏣ **${moneyRange}** received. 📈👌🤡👍📈`
						);
					} else if (range >= 3 && range <= 6) {
						// Between 3 and 6
						moneyRange = randomRange(150, 160);
						message.say(
							`Your edgy meme was **great** and received a lots of upvotes. ⏣ **${moneyRange}** received. 👌🤡👍📈`
						);
					} else if (range >= 7 && range <= 15) {
						// Between 7 and 15
						moneyRange = randomRange(80, 120);
						message.say(
							`Your edgy meme was **decent** and received some ok responses. ⏣ **${moneyRange}** received. 👌🤡`
						);
					} else if (range >= 16 && range <= 25) {
						// Between 16 and 25
						moneyRange = randomRange(90, 140);
						message.say(
							`Your edgy meme was **above average** and received some good responses. ⏣ **${moneyRange}** received. 🤡👍`
						);
					} else if (range >= 26 && range <= 30) {
						moneyRange = randomRange(150, 175);
						message.say(
							`Your edgy meme was **very great** and received some great responses. ⏣ **${moneyRange}** received. 👌🤡👍`
						);
					}
				} else {
					if (range >= 31 && range <= 35) {
						// Between 3 and 6
						message.say(
							'Your edgy meme was **cringe** and received a lots of downvotes. 😢📉'
						);
					} else if (range >= 36 && range <= 40) {
						// Between 7 and 15
						message.say(
							'Your edgy meme was featured in r/cringetopia and received some bad responses. 😢'
						);
					} else if (range >= 41 && range <= 45) {
						// Between 16 and 25
						message.say(
							'Your edgy meme was ignored and received some shit responses. 👎😢'
						);
					} else if (range >= 46 && range <= 50) {
						message.say(
							'Your edgy meme was reported for being bad and received some stagnant responses. 😔'
						);
					}
				}
				break;
			case 'reposted':
				if (range <= 30) {
					// Success
					if (range <= 2) {
						// 1 & 2
						moneyRange = randomRange(175, 260);
						message.say(
							`Your reposted meme was GODLY and gained more upvotes than the original. ⏣ **${moneyRange}** received. 📈👌🤡👍📈`
						);
					} else if (range >= 3 && range <= 6) {
						// Between 3 and 6
						moneyRange = randomRange(125, 175);
						message.say(
							`Your reposted meme was **great** and received a lots of upvotes. ⏣ **${moneyRange}** received. 👌🤡👍📈`
						);
					} else if (range >= 7 && range <= 15) {
						// Between 7 and 15
						moneyRange = randomRange(90, 125);
						message.say(
							`Your reposted meme was **decent** and received some ok responses. ⏣ **${moneyRange}** received. 👌🤡`
						);
					} else if (range >= 16 && range <= 25) {
						// Between 16 and 25
						moneyRange = randomRange(100, 150);
						message.say(
							`Your reposted meme was **above average** and received some good responses. ⏣ **${moneyRange}** received. 🤡👍`
						);
					} else if (range >= 26 && range <= 30) {
						moneyRange = randomRange(150, 200);
						message.say(
							`Your reposted meme was **very great** and received some great responses. ⏣ **${moneyRange}** received. 👌🤡👍`
						);
					}
				} else {
					if (range >= 31 && range <= 35) {
						// Between 3 and 6
						message.say(
							'Your reposted meme was **caught** and received a lots of downvotes. 😢📉'
						);
					} else if (range >= 36 && range <= 40) {
						// Between 7 and 15
						message.say(
							'Your reposted meme was **deleted** and received some bad responses. 😢'
						);
					} else if (range >= 41 && range <= 45) {
						// Between 16 and 25
						message.say(
							'Your reposted meme was **overused** and received some shit responses. 👎😢'
						);
					} else if (range >= 46 && range <= 50) {
						message.say(
							'Your reposted meme was **ignored** and received some stagnant responses. 😔'
						);
					}
				}
				break;
			case 'intellectual':
				if (range <= 30) {
					// Success
					if (range <= 2) {
						// 1 & 2
						moneyRange = randomRange(175, 250);
						message.say(
							`Your intellectual meme was **SUPER INTELLECTUAL** and received a load of upvotes. ⏣ **${moneyRange}** received. 📈👌🤡👍📈`
						);
					} else if (range >= 3 && range <= 6) {
						// Between 3 and 6
						moneyRange = randomRange(150, 200);
						message.say(
							`Your intellectual meme was **great** and received a lots of upvotes. ⏣ **${moneyRange}** received. 👌🤡👍📈`
						);
					} else if (range >= 7 && range <= 15) {
						// Between 7 and 15
						moneyRange = randomRange(90, 125);
						message.say(
							`Your intellectual meme was **decent** and received some ok responses. ⏣ **${moneyRange}** received. 👌🤡`
						);
					} else if (range >= 16 && range <= 25) {
						// Between 16 and 25
						moneyRange = randomRange(100, 150);
						message.say(
							`Your intellectual meme was **above average** and received some good responses. ⏣ **${moneyRange}** received. 🤡👍`
						);
					} else if (range >= 26 && range <= 30) {
						moneyRange = randomRange(175, 210);
						message.say(
							`Your intellectual meme was **very great** and received some great responses. ⏣ **${moneyRange}** received. 👌🤡👍`
						);
					}
				} else {
					if (range >= 31 && range <= 35) {
						// Between 3 and 6
						message.say(
							'Your intellectual meme was **retarded** and received a lots of downvotes. 😢📉'
						);
					} else if (range >= 36 && range <= 40) {
						// Between 7 and 15
						message.say(
							'Your intellectual meme was **bad** and received some bad responses. 😢'
						);
					} else if (range >= 41 && range <= 45) {
						// Between 16 and 25
						message.say(
							'Your intellectual meme was **dumb** and received some shit responses. 👎😢'
						);
					} else if (range >= 46 && range <= 50) {
						message.say(
							'Your intellectual meme was **stupid** and received some stagnant responses. 😔'
						);
					}
				}
				break;
			case 'wholesome':
				if (range <= 30) {
					// Success
					if (range <= 2) {
						// 1 & 2
						moneyRange = randomRange(175, 250);
						message.say(
							`Your wholesome meme was **SUPER WHOLESOME** and received a load of upvotes. ⏣ **${moneyRange}** received. 📈👌🤡👍📈`
						);
					} else if (range >= 3 && range <= 6) {
						// Between 3 and 6
						moneyRange = randomRange(120, 140);
						message.say(
							`Your wholesome meme was **cute** and received a lots of upvotes. ⏣ **${moneyRange}** received. 👌🤡👍📈`
						);
					} else if (range >= 7 && range <= 15) {
						// Between 7 and 15
						moneyRange = randomRange(80, 100);
						message.say(
							`Your wholesome meme was **decent** and received some ok responses. ⏣ **${moneyRange}** received. 👌🤡`
						);
					} else if (range >= 16 && range <= 25) {
						// Between 16 and 25
						moneyRange = randomRange(90, 150);
						message.say(
							`Your wholesome meme was **kawaii** and received some good responses. ⏣ **${moneyRange}** received. 🤡👍`
						);
					} else if (range >= 26 && range <= 30) {
						moneyRange = randomRange(100, 135);
						message.say(
							`Your wholesome meme was **good** and received some great responses. ⏣ **${moneyRange}** received. 👌🤡👍`
						);
					}
				} else {
					if (range <= 31 && range <= 35) {
						// Between 3 and 6
						message.say(
							'Your wholesome meme was **NON WHOLESOME** and received a lots of downvotes. 😢📉'
						);
					} else if (range >= 36 && range <= 40) {
						// Between 7 and 15
						message.say(
							'Your wholesome meme was **ignored** and received some bad responses. 😢'
						);
					} else if (range >= 41 && range <= 45) {
						// Between 16 and 25
						message.say(
							'Your wholesome meme was **NSFL** and received some shit responses. 👎😢'
						);
					} else if (range >= 46 && range <= 50) {
						message.say(
							'Your wholesome meme was **bad** and received some stagnant responses. 😔'
						);
					}
				}
				break;
			default:
				break;
		}

		const existingData = await EconomyStructure.fetchMember(user.id);
		if (!existingData) {
			const data = await Economy.createMember(user.id);
			data.money += moneyRange;

			await data.save();
		} else {
			await Economy.addMoney(user.id, moneyRange);
		}
	}
};

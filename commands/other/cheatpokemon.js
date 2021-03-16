/* eslint-disable consistent-return, no-await-in-loop */

const Command = require('./shared/Command');
const { stripIndents } = require('common-tags');
const Pokemon = require('./cheatpokemon/pokemonhash.json');
const axios = require('axios');

function shuffleObject(obj) {
	let newObj = {};
	let keys = Object.keys(obj);
	keys.sort(() => Math.random() - 0.5);
	keys.forEach(key => {
		newObj[key] = obj[key];
	});
	return newObj;
}

module.exports = class CheatPokemon extends Command {
	constructor(client) {
		super(client, {
			name: 'cheatpokemon',
			aliases: ['cp'],
			group: 'other',
			memberName: 'cheatpokemon',
			description: 'Cheats for pokemon game.',
			guildOnly: true
		});
	}

	async run(message) {
		message.say('Fetching pokemon!');
		const old = Date.now();
		await message.channel.messages
			.fetch({ limit: 2 })
			.then(async result => {
				await result.forEach(async msg => {
					if (!msg.embeds.length) return;
					const url = msg.embeds[0].thumbnail.url;
					let got = false;

					for (const data of Object.entries(shuffleObject(Pokemon))) {
						const success = await (async () => {
							const name = data[0];
							const id = data[1];
							const updated = await axios
								.get(url)
								.then(response => response.data.length);

							if (updated === id) {
								got = true;
								return message.say(stripIndents`
									,catch ${name}

									Took \`${(Date.now() - old) / 1000}\` seconds.
								`);
							} else {
								return false;
							}
						})();

						if (success) break;
					}
					if (!got) return message.say('No pokemon content found...');
				});
			});
	}
};

/*
		Message.channel.messages.fetch({ limit: 2 }).then(result => {
			result.forEach(msg => {
				if (!msg.embeds.length) return;
				const url = msg.embeds[0].thumbnail.url.split('/');
				const pokemon = url[url.length - 1]
					.split('.')
					.slice(0, -1)
					.join('.');

				msg.delete();

				return message.author.send(stripIndents`
					,catch ${pokemon}
				`);
			});
		});

		return message.say('No pokemon content found...');
*/

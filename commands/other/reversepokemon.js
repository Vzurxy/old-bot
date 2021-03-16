/* eslint-disable consistent-return, no-await-in-loop, camelcase */

const Command = require('./shared/Command');
const { stripIndents } = require('common-tags');
const SauceParser = require('saucenao-parser');
const Pokemon = require('./reversepokemon/pokemons.json');
const Sauce = new SauceParser({
	api_key: 'b8e1d3d73bb8504f43cc7f88e66f159f65855ef0'
});

Sauce.setOptions({
	numres: 5
});

module.exports = class CheatPokemon extends Command {
	constructor(client) {
		super(client, {
			name: 'reversepokemon',
			aliases: ['rp'],
			group: 'other',
			memberName: 'reversepokemon',
			description: 'Cheats for pokemon game.',
			guildOnly: true
		});
	}

	async run(message) {
		message.say(
			'Fetching pokemon! Keep in mind, that it is **not 100% accurate**.'
		);
		const old = Date.now();
		await message.channel.messages
			.fetch({ limit: 2 })
			.then(async result => {
				await result.forEach(async msg => {
					if (!msg.embeds.length) return;
					const url = msg.embeds[0].thumbnail.url;
					let got = false;
					let otherResults = [];
					await Sauce.getSauce(url).then(response => {
						for (result of response.results) {
							if (result.data) {
								const title = result.data.title.toLowerCase();
								otherResults.push(title);
								if (!title) continue;
								for (const pokemon of Pokemon) {
									if (title.search(pokemon) !== -1) {
										message.say(stripIndents`
											**,catch ${pokemon.charAt(0).toLowerCase() + pokemon.slice(1)}**
	
											Took \`${(Date.now() - old) / 1000}\` seconds.

											Other results: ${otherResults.join(', ')}
										`);

										got = true;
									}
								}
							}
						}
					});
					if (!got) {
						return message.say(stripIndents`
							No pokemon content found...
							Other results: ${otherResults.join(', ')}
						`);
					}
					otherResults = [];
				});
			});
	}
};

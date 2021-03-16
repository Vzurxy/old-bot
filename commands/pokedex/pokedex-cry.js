const Command = require('./shared/Command');
const { reactIfAble } = require('./shared/Util');

module.exports = class PokedexCryCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pokedex-cry',
			aliases: ['pokemon-cry', 'pokémon-cry', 'pokédex-cry', 'pkmn-cry'],
			group: 'pokedex',
			memberName: 'pokedex-cry',
			description: 'Plays a Pokémon\'s cry.',
			userPermissions: ['CONNECT', 'SPEAK'],
			throttling: {
				usages: 1,
				duration: 10
			},
			guildOnly: true,
			credit: [
				{
					name: 'Pokémon',
					url: 'https://www.pokemon.com/us/',
					reason: 'Original Game'
				},
				{
					name: 'PokéAPI',
					url: 'https://pokeapi.co/',
					reason: 'API'
				},
				{
					name: 'The Sounds Resource',
					url: 'https://www.sounds-resource.com/',
					reason: 'Cry Sound Effects (Gen 1-7)',
					reasonURL: 'https://www.sounds-resource.com/3ds/pokemonultrasunultramoon/'
				},
				{
					name: 'The Sounds Resource',
					url: 'https://www.sounds-resource.com/',
					reason: 'Cry Sound Effects (Gen 8)',
					reasonURL: 'https://www.sounds-resource.com/nintendo_switch/pokemonswordshield/'
				},
				{
					name: 'Pokémon Showdown',
					url: 'https://play.pokemonshowdown.com/',
					reason: 'Cry Sound Effects (Meltan and Melmetal)',
					reasonURL: 'https://play.pokemonshowdown.com/audio/cries/'
				}
			],
			args: [
				{
					key: 'pokemon',
					prompt: 'What Pokémon would you like to play the cry of?',
					type: 'pokemon'
				}
			]
		});
	}

	async run(msg, { pokemon }) {
		const connection = this.client.voice.connections.get(msg.guild.id);
		if (!connection) {
			const usage = this.client.registry.commands.get('join').usage();
			return msg.reply(`I am not in a voice channel. Use ${usage} to fix that!`);
		}
		try {
			connection.play(pokemon.cry);
			await reactIfAble(msg, this.client.user, '🔉');
			return null;
		} catch (err) {
			await reactIfAble(msg, this.client.user, '⚠️');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};

/* eslint-disable no-process-env, no-empty */
require('dotenv').config();

const { formatNumber, reactIfAble } = require('./shared/util');
const { Manager } = require('erela.js');
const { OWNERS } = process.env;
const { stripIndents } = require('common-tags');
const path = require('path');
const mongoose = require('mongoose');
const Client = require('./index/Client');
const Chalk = require('chalk');
const { default: didYouMean, ReturnTypeEnums } = require('didyoumean2');

mongoose.connect(process.env.MONGO, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	autoIndex: false
});

const client = new Client({
	commandPrefix: ';',
	owner: OWNERS.split(','),
	invite: 'https://vaxio.me/bruh',
	disableMentions: 'everyone',
	partials: ['GUILD_MEMBER'],
	disabledEvents: [
		'TYPING_START',
		'RELATIONSHIP_ADD',
		'RELATIONSHIP_REMOVE',
		'CHANNEL_PINS_UPDATE'
	],
	ws: {
		properties: {
			$browser: 'Discord iOS'
		}
	}
});

client.registry
	.registerDefaultTypes()
	.registerTypesIn(path.join(__dirname, 'types'))
	.registerGroups([
		['util', 'Util'],
		['util-public', 'Utility Public'],
		['other', 'Other'],
		['guild', 'Guild'],
		['fun', 'Fun'],
		['info', 'Discord Information'],
		['code', 'Coding Tools'],
		['moderation', 'Moderation'],
		['games-sp', 'Singleplayer Games'],
		['games-mp', 'Multiplayer Games'],
		['voice', 'Play Audio'],
		['music', 'Music'],
		['phone', 'Phone'],
		['economy', 'Economy'],
		['roblox', 'Roblox'],
		['edit-image', 'Image'],
		['auto', 'Auto'],
		['edit-text', 'Text'],
		['random-seed', 'Random'],
		['analyze', 'Analyze'],
		['remind', 'Reminders'],
		['pokedex', 'Pokedex'],
		['util-voice', 'Util Voice']
	])
	.registerDefaultGroups()
	.registerDefaultCommands({
		help: false,
		ping: false,
		prefix: false,
		commandState: false,
		unknownCommand: false
	})
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.on('ready', async () => {
	client.logger.info(
		`[READY] Logged in as ${client.user.tag}! ID: ${client.user.id}`
	);

	// Push client-related activities
	client.activities.push(
		{
			text: () => `${formatNumber(client.guilds.cache.size)} servers`,
			type: 'WATCHING'
		},
		{
			text: () =>
				`with ${formatNumber(client.registry.commands.size)} commands`,
			type: 'PLAYING'
		},
		{
			text: () => `${formatNumber(client.channels.cache.size)} channels`,
			type: 'WATCHING'
		}
	);

	// Interval to change activity every minute
	client.setInterval(() => {
		const activity =
			client.activities[
				Math.floor(Math.random() * client.activities.length)
			];
		const text =
			typeof activity.text === 'function'
				? activity.text()
				: activity.text;
		client.user.setActivity(text, {
			type: activity.type
		});
	}, 60000);

	try {
		const results = client.importBlacklist();
		if (!results) client.logger.error('[BLACKLIST] blacklist.json is not formatted correctly.');
	} catch (err) {
		client.logger.error(`[BLACKLIST] Could not parse blacklist.json:\n${err.stack}`);
	}
	
		// Make sure bot is not in any blacklisted guilds
	for (const id of client.blacklist.guild) {
		try {
			const guild = await client.guilds.fetch(id, false);
			await guild.leave();
			client.logger.info(`[BLACKLIST] Left blacklisted guild ${id}.`);
		} catch {
			client.logger.info(`[BLACKLIST] Failed to leave blacklisted guild ${id}.`);
		}
	}

	// Make sure bot is not in any guilds owned by a blacklisted user
	let guildsLeft = 0;
	for (const guild of client.guilds.cache.values()) {
		if (client.blacklist.user.includes(guild.ownerID)) {
			try {
				await guild.leave();
				guildsLeft++;
			} catch {
				client.logger.info(`[BLACKLIST] Failed to leave blacklisted guild ${guild.id}.`);
			}
		}
	}
	client.logger.info(`[BLACKLIST] Left ${guildsLeft} guilds owned by blacklisted users.`);
});

client.on('guildCreate', async guild => {
	if (
		client.blacklist.guild.includes(guild.id) ||
		client.blacklist.user.includes(guild.ownerID)
	) {
		try {
			await guild.leave();
		} catch {}
	}
});

client.on('error', err => client.logger.error(err.stack))

client.on('warn', warn => client.logger.warn(warn))

client.on('commandError', (command, err) =>
	client.logger.error(`[COMMAND:${command.name}]\n${err.stack}`)
)

client.on('commandRun', (cmd, promise, msg, args) => {
	client.logger.info(stripIndents` [COMMAND]
		${Chalk.red(msg.author.tag)} ${Chalk.red(`(${msg.author.id})`)}
        ${Chalk.yellow(
			msg.guild
				? `${msg.guild.name} (${msg.guild.id}) [#${msg.channel.name}]`
				: 'dm'
		)}
        ${Chalk.green(cmd.groupID)}:${Chalk.green(cmd.memberName)}
        ${Chalk.blue(
			Object.values(args).length
				? `⏩ ${Object.values(args)}`
				: 'none'
		)}
			${Chalk.magenta(cmd.description)}
    `);

	if (cmd.uses === undefined) return;
	cmd.uses++;
	if (cmd.lastRun === undefined) return;
	cmd.lastRun = new Date();
})

client.on('voiceStateUpdate', (oldState, newState) => {
	if (newState.id !== client.user.id || oldState.id !== client.user.id) return;
	if (newState.channel) return;
	const dispatcher = client.dispatchers.get(oldState.guild.id);
	if (!dispatcher) return;
	dispatcher.end();
	client.dispatchers.delete(oldState.guild.id);
});

// eslint-disable-next-line complexity
client.on('message', async msg => {
		//	Client.channels.cache.get("279359683532161035").createInvite().then(invite => {
		//		console.log(invite);
		//	});
		let splitSpace = msg.content.split(' ');
		if (
			splitSpace[0].toLowerCase().replace(/[^A-z]+/g, '') === 'im' &&
			Math.random() < 0.25 &&
			!msg.author.bot
		) {
			splitSpace.shift();
			return msg.reply(`Hey **${splitSpace.join(' ')}**, I'm Sadge.`);
		}

		let containsMatch = false;
		let errored = false;
		const newMessage = msg.content.replace(/\\?\[([0-z])+\]/g, match => {
			match = match.replace(/\[|\]/g, '');
			if (match.includes('\\')) return `[${match}]`.replace('\\', '');

			const Emoji = msg.guild.emojis.cache.find(
				emoji =>
					emoji && emoji.name.toLowerCase() === match.toLowerCase()
			);

			console.log(Emoji);

			if (!Emoji) {
				const emojisInArray = msg.guild.emojis.cache.array();
				const newArr = [];

				for (const emoji of emojisInArray.values()) {
					newArr.push(emoji.name);
				}

				const results = didYouMean(match, newArr, {
					returnType: ReturnTypeEnums.ALL_SORTED_MATCHES
				});

				if (results.length === 1) {
					const targetEmoji = results[0];
					const actualEmoji = msg.guild.emojis.cache.find(
						emoji => emoji.name === targetEmoji
					);

					containsMatch = true;
					return actualEmoji;
				}

				errored = true;

				return msg.reply(stripIndents`
					Unknown custom emoji \`${match}\`. Look at the guild emojis to view the custom emoji list.

					${
						results.length
							? `Did You Mean: ${results
									.slice(0, 5)
									.map(res => `\`${res}\``)
									.join(', ')}`
							: ''
					}
				`);
			}

			containsMatch = true;
			return Emoji;
		});

		if (newMessage && !msg.author.bot && containsMatch && !errored) {
			return msg.say(newMessage);
		}

		const hasText = Boolean(msg.content);
		const hasImage = msg.attachments.size !== 0;
		const hasEmbed = msg.embeds.length !== 0;
		if (msg.author.bot || (!hasText && !hasImage && !hasEmbed)) return;
		const origin = client.phone.find(
			call => call.origin.id === msg.channel.id
		);
		const recipient = client.phone.find(
			call => call.recipient.id === msg.channel.id
		);
		if (!origin && !recipient) return;
		const call = origin || recipient;
		if (call.originDM && call.startUser.id !== msg.author.id) return;
		if (
			!call.adminCall &&
			msg.guild &&
			(!msg.channel.topic || !msg.channel.topic.includes('<phone>'))
		) {
			return;
		}
		if (!call.active) return;
		if (
			call.adminCall &&
			msg.guild.id === call.origin.guild.id &&
			!client.isOwner(msg.author)
		) {
			return;
		}
		try {
			await call.send(
				origin ? call.recipient : call.origin,
				msg,
				hasText,
				hasImage,
				hasEmbed
			);
		} catch {
			return; // eslint-disable-line no-useless-return
		}
	});
	
client.dispatcher.addInhibitor(msg => {
	if (OWNERS.split(',').includes(msg.author.id)) return false;
	if (client.blacklist.user.includes(msg.author.id)) {
		client.logger.info(`Blacklisted user attempt: ${msg.author.id}`) 
		return { reason: 'blacklisted', response: msg.react('❌') };
	}
	if (msg.guild && client.blacklist.guild.includes(msg.guild.id)) {
		client.logger.info(`Blacklisted guild attempt: ${msg.guild.id}`) 
		return { reason: 'blacklisted', response: msg.react('❌') };
	}
	return false;
});

client.login(process.env.TOKEN);

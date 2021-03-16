const Command = require('./shared/Command');
const superagent = require('superagent')

const { MessageEmbed } = require('discord.js')

module.exports = class BaseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'namefromid',
			aliases: ['robloxnameid', 'nameid'],
			group: 'roblox',
			memberName: 'namefromid',
            description: 'Get\'s a name from a user id.',
            args: [{
                key: 'id',
                prompt: 'Please send a user id',
                type: 'integer'
            }]
		});
	}

	run(message, { id }) {
        superagent
            .get(`https://api.roblox.com/users/${id}`)
            .end((err, res) => {
                if (err) {
                    return message.reply('something went wrong. error: ' + err)
                }

                return message.say(new MessageEmbed()
                    .setColor('RANDOM')
                    .setTitle(`result of ${id}`)
                    .setDescription(res.body.Username)
                    .setFooter(Math.random() * 10 > 7 ? '🤡' : '📛'))
            })
	}
};
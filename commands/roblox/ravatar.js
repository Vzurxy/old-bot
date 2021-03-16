const Command = require('./shared/Command');
const superagent = require('superagent')

const { MessageEmbed } = require('discord.js')

module.exports = class BaseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ravatar',
			aliases: ['robloxavatar', 'avatarroblox'],
			group: 'roblox',
			memberName: 'ravatar',
            description: 'Get\'s a user\'s roblox avatar.',
            args: [{
                key: 'id',
                prompt: 'Please send a user id',
                type: 'integer'
            }]
		});
	}

	run(message, { id }) {
        superagent
            .get(`http://www.roblox.com/bust-thumbnail/json?userId=${id}&height=180&width=180`)
            .end((err, res) => {
                if (err) {
                    return message.reply('something went wrong. error: ' + err)
                }
                const url = res.text.split('"')[3]

                return message.say(new MessageEmbed()
                    .setColor('RANDOM')
                    .setTitle(`avatar of ${id}`)
                    .setImage(url)
                    .setFooter(Math.random() * 10 > 7 ? '🤡' : '📁'))
            })
	}
};
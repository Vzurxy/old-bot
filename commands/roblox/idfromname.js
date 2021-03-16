const Command = require('./shared/Command');
const superagent = require('superagent')

const { MessageEmbed } = require('discord.js')

module.exports = class BaseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'idfromname',
			aliases: ['robloxidname', 'idname'],
			group: 'roblox',
			memberName: 'idfromname',
            description: 'Get\'s a id from a username.',
            args: [{
                key: 'name',
                prompt: 'Please send a user name',
                type: 'string'
            }]
		});
	}

	run(message, { name }) {
        superagent
            .get(`https://api.roblox.com/users/get-by-username?username=${name}`)
            .end((err, res) => {
                if (err) {
                    return message.reply('something went wrong. error: ' + err)
                }

                return message.say(new MessageEmbed()
                    .setColor('RANDOM')
                    .setTitle(`result of ${name}`)
                    .setDescription(res.body.Id)
                    .setFooter(Math.random() * 10 > 7 ? '🤡' : '📛'))
            })
	}
};
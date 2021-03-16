const Command = require('./shared/Command');
const superagent = require('superagent')
const { stripIndents } = require('common-tags')
const { MessageEmbed } = require('discord.js')
const { verify, reactIfAble } = require('./shared/util');

module.exports = class BaseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'searchaudio',
			aliases: ['audiosearch'],
			group: 'roblox',
			memberName: 'searchaudio',
            description: 'Searches for a audio.',
            args: [{
                key: 'name',
                prompt: 'Please send a audio name.',
                type: 'string'
            }]
		});
	}

	run(msg, { name }) {
        superagent
            .get(`https://search.roblox.com/catalog/json?Category=9&Keyword=${name.replace(/ /g, '%20')}`)
            .end(async (err, res) => {
                if (err) {
                    return msg.reply('something went wrong. error: ' + err)
                }

                const body = res.body[0]

                msg.reply(new MessageEmbed()
                    .setColor('RANDOM')
                    .setTitle(`audio search`)
                    .setImage('https://t5.rbxcdn.com/b01c2ec50568f8f597ca8b87af0fcb0d')
                    .addFields(
                        { name: 'name', value: body.Name, inline: true},
                        { name: 'creator detail', value: stripIndents`
                            name: ${body.Creator}
                            id: ${body.CreatorID}

                            ⏱ ${body.Updated} ⭐ ${body.Favorited}
                        `, inline: true },
                        { name: 'description', value: `\`${body.Description}\``, inline: true },
                    )
                    .setFooter(`🔉 ${body.AbsoluteUrl}`))

                msg.reply('want me to play the audio? use sudojoin in a vc')

                const verification = await verify(msg.channel, msg.author);
				
                if (verification) {
                    const connection = this.client.voice.connections.get(msg.guild.id);
                    if (!connection) return msg.reply('I am not in a voice channel. ❌');
                    connection.play(body.AudioUrl)

                    return reactIfAble(msg, this.client.user, '🔉');
                }
            })
	}
};
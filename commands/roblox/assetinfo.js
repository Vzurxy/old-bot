const Command = require('./shared/Command');
const superagent = require('superagent')
const { stripIndents } = require('common-tags')
const { MessageEmbed } = require('discord.js')

module.exports = class BaseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'assetinfo',
			aliases: ['infoasset', 'asset'],
			group: 'roblox',
			memberName: 'assetinfo',
            description: 'Get\'s info about an asset.',
            args: [{
                key: 'id',
                prompt: 'Please send a asset id.',
                type: 'integer'
            }]
		});
	}

	run(message, { id }) {
        superagent
            .get(`http://api.roblox.com/Marketplace/ProductInfo?assetId=${id}`)
            .end(async (err, res) => {
                if (err) {
                    return message.reply('something went wrong. error: ' + err)
                }

                const body = res.body

                await superagent.get(`http://www.roblox.com/item-thumbnails?params=[{assetId:${id}}]`).end((err, thumbres) => {
                    if (err)
                        return message.reply('something went while fetching thumbnail. error: ' + err)

                    return message.say(new MessageEmbed()
                    .setColor('RANDOM')
                    .setTitle(`result of ${id}`)
                    .setImage(thumbres.body[0].thumbnailUrl)
                    .addFields(
                        { name: 'price', value: body.PriceInRobux ? body.PriceInRobux : 'free', inline: true},
                        { name: 'name', value: body.Name, inline: true},
                        { name: 'creator detail', value: stripIndents`
                            name: ${body.Creator.Name}
                            id: ${body.Creator.Id}
                            type: ${body.Creator.CreatorType.toLowerCase()}
                            target id: ${body.Creator.CreatorTargetId}

                        `, inline: true },
                        { name: 'description', value: `\`${body.Description}\``, inline: true },
                    )
                    .setFooter('📈📉'))
                })
            })
	}
};
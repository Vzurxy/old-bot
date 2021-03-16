/* eslint-disable class-methods-use-this */

const { MessageEmbed } = require('discord.js');
const Tags = require('./shared/tags');
const Command = require('./shared/Command');

module.exports = class TagDel extends Command {
    constructor(client) {
        super(client, {
            name: 'tagdel',
            aliases: ['tagdelete', 'deltag', 'deletetag'],
            group: 'fun',
            memberName: 'tagdel',
            description: 'Deletes a tag',
            args: [
                {
                    key: 'tag',
                    prompt: 'Please specify a tag!',
                    type: 'string'
                }
            ],
            throttling: {
                usages: 2,
                duration: 10
            }
        });
    }

    async run(message, { tag }) {
        Tags.findOneAndDelete({ guild: message.guild.id, tag }, (err, data) => {
            if (err) throw err;
            if (data) {
                const embed = new MessageEmbed()
                    .setColor('#0x202225')
                    .setTitle('Bot')
                    .setDescription(`Deleted tag.`)
                    .setTimestamp();

                return message.say(embed);
            }

            const embed = new MessageEmbed()
                .setColor('#0x202225')
                .setTitle('Bot')
                .setDescription(`No such tag was found!`)
                .setTimestamp();

            return message.say(embed);
        });
    }
};

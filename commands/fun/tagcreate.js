/* eslint-disable class-methods-use-this */

const { MessageEmbed } = require('discord.js');
const Tags = require('./shared/tags');
const Command = require('./shared/Command');

module.exports = class TagCreate extends Command {
    constructor(client) {
        super(client, {
            name: 'tagcreate',
            aliases: ['tagc'],
            group: 'fun',
            memberName: 'tagcreate',
            description: 'Creates a tag',
            args: [
                {
                    key: 'tag',
                    prompt: 'Please specify a tag!',
                    type: 'string'
                },
                {
                    key: 'content',
                    prompt: 'Please specify content for the tag!',
                    type: 'string'
                }
            ],
            throttling: {
                usages: 2,
                duration: 10
            }
        });
    }

    run(message, { tag, content }) {
        Tags.findOne({ guild: message.guild.id, tag }, async (err, data) => {
            if (err) throw err;
            if (data) {
                message.reply('Cannot overwrite an existing tag.');
            } else {
                const TagDB = new Tags({
                    guild: message.guild.id,
                    tag,
                    content
                });

                await TagDB.save();

                const embed = new MessageEmbed()
                    .setColor('#0x202225')
                    .setTitle('Bot')
                    .setDescription(
                        `Successfully created tag \`${tag}\` with the content of ${content}`
                    )
                    .setTimestamp();

                message.say(embed);
            }
        });
    }
};

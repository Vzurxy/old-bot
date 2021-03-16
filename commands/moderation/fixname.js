const { MessageEmbed } = require('discord.js');
const Command = require('./shared/Command');

function fix(str) {
    const r = str.replace(/[^a-z0-9 ,.?!]/gi, '');
    if (r != '') return r;

    const n = Math.floor(Math.random() * 1000);
    return 'No Name#' + '0'.repeat(4 - n.toString().length) + n;
}

module.exports = class FixName extends Command {
    constructor(client) {
        super(client, {
            name: 'fixname',
            aliases: [],
            group: 'moderation',
            memberName: 'fixname',
            userPermissions: ['MANAGE_NICKNAMES'],
            description: "Fixes a user's name",
            throttling: {
                usages: 1,
                duration: 3
            },
            args: [
                {
                    key: 'user',
                    prompt: 'Which member? (@)',
                    type: 'user'
                }
            ]
        });
    }

    async run(message, { user }) {
        const member = message.guild.member(user);
        const fixed = fix(member ? member.displayName : null);
        const embed = new MessageEmbed()
            .setColor('#0x202225')
            .setTitle('Bot')
            .setDescription(
                `Successfully changed nickname for user <@${user.id}> from \`${user.username}\` to \`${fixed}\``
            )
            .setTimestamp();

        message.say(embed);
        member.setNickname(fixed);
    }
};

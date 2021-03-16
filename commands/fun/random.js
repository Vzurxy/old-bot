/* eslint-disable class-methods-use-this */

const { MessageEmbed } = require('discord.js');
const Command = require('./shared/Command');

module.exports = class RandomNumberCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'random',
            aliases: ['random-number', 'number-between', 'rng'],
            memberName: 'random',
            group: 'fun',
            description:
                'Generate a random number between two provided numbers!',
            args: [
                {
                    key: 'min',
                    prompt: 'What is the minimum number?',
                    type: 'integer'
                },
                {
                    key: 'max',
                    prompt: 'What is the maximum number?',
                    type: 'integer'
                }
            ]
        });
    }

    run(message, { min, max }) {
        const minValue = Math.ceil(min);
        const maxValue = Math.floor(max);
        const rngEmbed = new MessageEmbed().setTitle(
            Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue
        );
        return message.say(rngEmbed);
    }
};

const Collection = require('@discordjs/collection');

module.exports = class PhoneManager extends Collection {
	constructor(client, options) {
		super(options);

		Object.defineProperty(this, 'client', { value: client });
	}

	inCall(channel) {
		return this.some(call => call.origin.id === channel.id || call.recipient.id === channel.id);
	}

	isBlocked(origin, recipient, caller) {
		return (recipient.guild && recipient.topic.includes(`<phone:block:${origin.id}>`))
			|| (recipient.guild && recipient.topic.includes(`<phone:block:${caller.id}>`))
			|| (origin.guild && recipient.guild && recipient.topic.includes(`<phone:block:${origin.guild.id}>`))
			|| (origin.guild && origin.topic.includes(`<phone:block:${recipient.id}>`))
			|| (origin.guild && recipient.guild && origin.topic.includes(`<phone:block:${recipient.guild.id}>`))
			|| (origin.guild && origin.topic.includes(`<phone:block:${caller.id}>`));
	}
};
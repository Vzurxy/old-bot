const SubredditCommandBase = require('./subreddit/Subreddit');

module.exports = class SubredditCommand extends SubredditCommandBase {
	constructor(client) {
		super(client, {
			name: 'subreddit',
			aliases: ['r/', 'sub', 'reddit'],
			group: 'fun',
			memberName: 'subreddit',
			description: 'Responds with a random post from a subreddit.',
			clientPermissions: ['EMBED_LINKS'],
			getIcon: true,
			args: [
				{
					key: 'subreddit',
					prompt: 'What subreddit would you like to get a post from?',
					type: 'string',
					parse: subreddit => encodeURIComponent(subreddit)
				}
			]
		});
	}

	generateText(post, subreddit, icon) {
		return this.makeEmbed(post, subreddit, icon);
	}
};
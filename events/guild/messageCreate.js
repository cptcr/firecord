module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;

        if (message.content === '!ping') {
            message.channel.send('Pong!');
        }
    },
};

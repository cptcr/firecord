// Example: /commands/fun/joke.js
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('joke')
        .setDescription('Sends a joke!'),
    async execute(interaction) {
        await interaction.reply('Why did the scarecrow win an award? Because he was outstanding in his field!');
    },
};

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('start')
		.setDescription('Start new Game!'),
	async execute(interaction) {
		await interaction.reply('Game Starting...');
	},
};
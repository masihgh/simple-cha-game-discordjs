const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		const startTime = Date.now();
		await interaction.reply('Pinging...').then(sentMessage => {
			const endTime = Date.now();
			const latency = endTime - startTime;
			sentMessage.edit(`**Pong!**\n **Latency is: ** ${latency}ms\n **API Latency is: ** ${Math.round(interaction.client.ws.ping)}ms`);
		});
	},
};

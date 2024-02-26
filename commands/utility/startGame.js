const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription('Start a new Game!'),
    async execute(interaction) {
        const players = [];

        const joinButton = new ButtonBuilder()
            .setCustomId('join')
            .setLabel('Join Game')
            .setStyle(ButtonStyle.Success);

        const leaveButton = new ButtonBuilder()
            .setCustomId('leave')
            .setLabel('Leave Game')
            .setStyle(ButtonStyle.Secondary);

        const endButton = new ButtonBuilder()
            .setCustomId('end-game')
            .setLabel('End Game')
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder()
            .addComponents(joinButton, leaveButton, endButton);

        const StartEmbed = new EmbedBuilder()
            .setColor('#ffffff')
            .setTitle('Game Created!')
            .setDescription('Game Created Successfuly')
            .setFooter({ text: 'Waiting for players join...', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

        await interaction.reply({
            embeds: [StartEmbed],
            components: [row],
        });

        const collector = interaction.channel.createMessageComponentCollector({ time: 60000 });

        collector.on('collect', async (interaction) => {
            switch (interaction.customId) {
                case 'join':
                    if (!players.includes(interaction.user.tag)) {
                        players.push(interaction.user.tag);
                        const joinEmbed = new EmbedBuilder()
                            .setColor('#47bd55')
                            .setTitle(':white_check_mark:  Player Joined!')
                            .setDescription(`@${interaction.user.tag} joined the game!`)
                            .setTimestamp();

                        await interaction.reply({ embeds: [joinEmbed] });
                    } else {
                        // Player is already in the game
                        const alreadyInGameEmbed = new EmbedBuilder()
                            .setColor('#297ec4')
                            .setTitle(`:arrow_forward:  You are already in the game!`);

                        await interaction.reply({ embeds: [alreadyInGameEmbed], ephemeral: true });
                    }
                    break;

                case 'leave':
                    if (players.includes(interaction.user.tag)) {
                        const leaveEmbed = new EmbedBuilder()
                            .setColor('#f50036')
                            .setTitle(':x:  Player Left!')
                            .setDescription(`@${interaction.user.tag} left the game.`)
                            .setTimestamp();

                        await interaction.reply({ embeds: [leaveEmbed] });
                        const index = players.indexOf(interaction.user.tag);
                        if (index !== -1) {
                            players.splice(index, 1);
                        }
                    } else {
                        // Player is not in the game
                        const notInGameEmbed = new EmbedBuilder()
                            .setColor('#fdd343')
                            .setTitle(`:warning:  You are not in the game!`);

                        await interaction.reply({ embeds: [notInGameEmbed], ephemeral: true });
                    }
                    break;

                case 'end-game':
                    collector.stop()
                    await interaction.reply({ content:'dsadasdasds', ephemeral: true });
                    break;


                default:
                    break;
            }


        });

        collector.on('end', async () => {
            const endEmbed = new EmbedBuilder()
                .setColor('#f50036')
                .setTitle('Game Ended!')
                .setDescription('The game has ended.')
                .setTimestamp();

            await interaction.followUp({ embeds: [endEmbed], components: [] });
        });
    },
};

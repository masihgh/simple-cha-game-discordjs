const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const Room = require('../../Models/Room')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('new')
        .setDescription('Start a new Game!'),
    async execute(interaction) {
        const { user, channelId, guildId } = interaction

        // Check if a room with the same ID already exists
        let RoomLive = await Room.findOne({ guild_id: guildId, channel_id: channelId });

        if (!RoomLive) {
            // Create a new room if it doesn't exist
            RoomLive = new Room({
                guild_id: guildId,
                channel_id: channelId,
                owner_id: user.id,
                players: []  // Add a players array to store player information
            });
            await RoomLive.save();
        }

        const players = RoomLive.players; // Use the players array from RoomLive

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
                    if (!players.find(player => player.tag === user.tag)) {
                        // Push player information to the players array
                        players.push({
                            id: user.id,
                            username: user.username,
                            globalName: user.globalName,
                            avatar: user.avatar
                        });

                        const joinEmbed = new EmbedBuilder()
                            .setColor('#47bd55')
                            .setTitle(':white_check_mark: Player Joined!')
                            .setDescription(`@${user.tag} joined the game!`)
                            .setTimestamp();

                        await interaction.reply({ embeds: [joinEmbed], ephemeral: true });
                    } else {
                        // Player is already in the game
                        const alreadyInGameEmbed = new EmbedBuilder()
                            .setColor('#297ec4')
                            .setTitle(`:arrow_forward: You are already in the game!`);

                        await interaction.reply({ embeds: [alreadyInGameEmbed], ephemeral: true });
                    }
                    break;

                case 'leave':
                    const index = players.findIndex(player => player.tag === user.tag);
                    if (index !== -1) {
                        // Remove player from the players array
                        players.splice(index, 1);

                        const leaveEmbed = new EmbedBuilder()
                            .setColor('#f50036')
                            .setTitle(':x: Player Left!')
                            .setDescription(`@${user.tag} left the game.`)
                            .setTimestamp();

                        await interaction.reply({ embeds: [leaveEmbed], ephemeral: true });
                    } else {
                        // Player is not in the game
                        const notInGameEmbed = new EmbedBuilder()
                            .setColor('#fdd343')
                            .setTitle(`:warning: You are not in the game!`);

                        await interaction.reply({ embeds: [notInGameEmbed], ephemeral: true });
                    }
                    break;

                case 'end-game':
                    collector.stop()
                    await interaction.reply({ content: 'dsadasdasds', ephemeral: true });
                    break;


                default:
                    break;
            }
            await RoomLive.save();

        });

        collector.on('end', async () => {
            // Update RoomLive with the modified players array
            // Delete the room when the game ends
            await Room.findOneAndDelete({ guild_id: guildId, channel_id: channelId });

            const endEmbed = new EmbedBuilder()
                .setColor('#f50036')
                .setTitle('Game Ended!')
                .setDescription('The game has ended.')
                .setTimestamp();

            await interaction.followUp({ embeds: [endEmbed], components: [] });
        });
    },
};

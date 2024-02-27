const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const Room = require('../../Models/Room');
const { joinEmbed, leaveEmbed, notInGameEmbed, alreadyInGameEmbed, StartEmbed, endEmbed, alreadyRomeExist } = require('../../embeds/StartGameEmbed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('new')
        .setDescription('Start a new Game!'),
    async execute(interaction) {
        const { user, channelId, guildId } = interaction

        // Check if a room with the same ID already exists
        let RoomLive = await Room.findOne({ guild_id: guildId, channel_id: channelId });

        if (RoomLive) {
            return interaction.reply({ embeds: [alreadyRomeExist], ephemeral: true });
        }
    
        RoomLive = new Room({
            guild_id: guildId,
            channel_id: channelId,
            owner_id: user.id,
            players: []  // Add a players array to store player information
        });
        await RoomLive.save();

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

        await interaction.reply({
            embeds: [StartEmbed],
            components: [row],
        });

        const collector = interaction.channel.createMessageComponentCollector({ time: 60000 });

        collector.on('collect', async (interaction) => {
            switch (interaction.customId) {
                case 'join':
                    if (!players.find(player => player.id === user.id)) {
                        // Push player information to the players array
                        players.push({
                            id: user.id,
                            username: user.username,
                            globalName: user.globalName,
                            avatar: user.avatar
                        });

                        await interaction.reply({ embeds: [joinEmbed(user.tag)], ephemeral: true });
                    } else {
                        // Player is already in the game
                        await interaction.reply({ embeds: [alreadyInGameEmbed], ephemeral: true });
                    }
                    break;
                case 'leave':
                    const index = players.findIndex(player => player.id === user.id);
                    if (index !== -1) {
                        // Remove player from the players array
                        players.splice(index, 1);
                        await interaction.reply({ embeds: [leaveEmbed(user.tag)], ephemeral: true });
                    } else {
                        // Player is not in the game
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
            await interaction.followUp({ embeds: [endEmbed], components: [] });
        });
    },
};

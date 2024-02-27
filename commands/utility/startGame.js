const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const Room = require('../../Models/Room');
const { joinEmbed, leaveEmbed, notInGameEmbed, alreadyInGameEmbed, StartEmbed, endEmbed, alreadyRomeExist } = require('../../embeds/StartGameEmbed');
const { getRandomMaterialColor } = require('../../func');

// Function to generate players list embed
function generatePlayersListEmbed(players, BaseColor) {
    const embedFields = players.map((player, index) => {
        const field = {
            name: `║ ⚇ Player ${index + 1}`,
            value: `║ **Username:** ${player.username}`,   
            inline: true
        };

        return field;
    });

    const Embed = new EmbedBuilder()
        .setColor(BaseColor)
        .setTitle("Players Information")
        .setDescription(`*players:* [**${players.length}**]`)
        .addFields(embedFields)
    
    // if(players.length > 0) Embed.setFooter({ text: `Last Player: @${players[players.length - 1].username}`, iconURL: players[players.length - 1].avatar !== null ? `https://cdn.discordapp.com/avatars/${players[players.length - 1].id}/${players[players.length - 1].avatar}.webp?size=48` : undefined });
    return Embed
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName('new')
        .setDescription('Start a new Game!'),
    async execute(interaction) {
        let BaseColor = getRandomMaterialColor()
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

        const playersListMessage = await interaction.reply({
            embeds: [StartEmbed(user,BaseColor), generatePlayersListEmbed(players, BaseColor)],
            components: [row],
        });

        const collector = interaction.channel.createMessageComponentCollector({ time: 60000 });

        collector.on('collect', async (interaction) => {
            switch (interaction.customId) {
                case 'join':
                    if (!players.find(player => player.id === interaction.user.id)) {
                        // Push player information to the players array
                        players.push({
                            id: interaction.user.id,
                            username: interaction.user.username,
                            globalName: interaction.user.globalName,
                            avatar: interaction.user.avatar
                        });

                        await interaction.reply({ embeds: [joinEmbed(interaction.user.tag)], ephemeral: true });
                    } else {
                        // Player is already in the game
                        await interaction.reply({ embeds: [alreadyInGameEmbed], ephemeral: true });
                    }
                    break;
                case 'leave':
                    const index = players.findIndex(player => player.id === interaction.user.id);
                    if (index !== -1) {
                        // Remove player from the players array
                        players.splice(index, 1);
                        await interaction.reply({ embeds: [leaveEmbed(interaction.user.tag)], ephemeral: true });
                    } else {
                        // Player is not in the game
                        await interaction.reply({ embeds: [notInGameEmbed], ephemeral: true });
                    }
                    break;
                case 'end-game':
                    if (RoomLive.owner_id === user.id) {
                        collector.stop()
                    } else {
                        await interaction.reply({ content: 'Only owner of room can stop waiting mode!', ephemeral: true });
                    }
                    break;
                default:
                    break;
            }

            // Update players list message
            await playersListMessage.edit({
                embeds: [StartEmbed(user,BaseColor), generatePlayersListEmbed(players, BaseColor)],
            });

            await RoomLive.save();

        });

        collector.on('end', async () => {
            await Room.findOneAndDelete({ guild_id: guildId, channel_id: channelId });
            await interaction.followUp({ embeds: [endEmbed], components: [] });
        });
    },
};

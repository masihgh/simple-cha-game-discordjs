const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder, ActionRowBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const GuildSetting = require('../../Models/GuildSetting');
const { readDecksFromFolder } = require('../../func');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set')
        .setDescription('Set Game Cards Pack!'),
    async execute(interaction) {

        // Read the card packs from a JSON file
        const folderPath = path.join(__dirname, '../../assets/cardPacks');
        const cardPacks = readDecksFromFolder(folderPath);
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('select-pack')
            .setPlaceholder('Select Card Pack!');

        Object.keys(cardPacks).forEach(key => {
            const pack = cardPacks[key];
            console.log(pack);
            selectMenu.addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel(pack.data.name)
                    .setDescription(`▯: ${pack.data.black.length} / ▮: ${pack.data.white.length}${pack.data.description ? ' | ' + pack.data.description : ''}`)
                    .setValue(pack.fileName)
            );
        });

        const row = new ActionRowBuilder()
            .addComponents(selectMenu);

        await interaction.reply({
            content: 'Select Card Pack!',
            components: [row],
        });

        const filter = i => i.customId === 'select-pack' && i.user.id === interaction.user.id;

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async i => {
            const selectedPack = i.values[0];

            // Save the selected pack to MongoDB
            const guildId = interaction.guild.id;
            try {
                const guildSetting = await GuildSetting.findOneAndUpdate(
                    { guild_id: guildId },
                    { packSelected: selectedPack },
                    { upsert: true, new: true }
                );

                console.log(`Selected pack '${selectedPack}' saved for guild '${guildId}'`);
                await interaction.followUp(`Card Pack Selected to **${selectedPack}**.`);

            } catch (error) {
                console.error('Error updating MongoDB:', error);
                await interaction.followUp(`Error Selected CardPack. Call Developer`);
            }

            await i.deferUpdate();
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.followUp('Time limit reached. Please try again.');
            }
        });
    },
};

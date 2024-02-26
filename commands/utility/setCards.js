const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder, ActionRowBuilder } = require('discord.js');
const fs = require('fs'); // Require the 'fs' module to read JSON files
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set')
        .setDescription('Set Game Cards Pack!'),
    async execute(interaction) {
        // Read the card packs from a JSON file
        const filePath = path.join(__dirname, '../../cah-cards-compact.json');
        const rawdata = fs.readFileSync(filePath);
        const cardPacks = JSON.parse(rawdata);
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('select-pack')
            .setPlaceholder('Select Card Pack!');

        Object.keys(cardPacks).forEach(key => {
            const pack = cardPacks[key];
            selectMenu.addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel(pack.name)
                    .setDescription(`:white_square_button: Black: ${pack.black.length} / :black_square_button: White: ${pack.white.length}`)
                    .setValue(key)
            );
        });

        const row = new ActionRowBuilder()
            .addComponents(selectMenu);

        await interaction.reply({
            content: 'Select Card Pack!',
            components: [row],
        });
    },
};

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
        const folderPath = path.join(__dirname, '../../assets/cardPacks');
        function readDecksFromFolder(folderPath) {
            const files = fs.readdirSync(folderPath);
            const jsonFiles = files.filter(file => file.endsWith('.json'));
            const result = [];
            jsonFiles.forEach(file => {
                const filePath = path.join(folderPath, file);
                const content = fs.readFileSync(filePath, 'utf-8');
                const data = JSON.parse(content);
                const fileName = path.parse(file).name;
                result.push({ fileName, data });
            });

            return result;
        }

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
                    .setDescription(`Black: ${pack.data.black.length} /  White: ${pack.data.white.length}`)
                    .setValue(pack.fileName)
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

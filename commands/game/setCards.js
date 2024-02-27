const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder, ActionRowBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const GuildSetting = require('../../Models/GuildSetting');

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
                const isVIP = fileName.endsWith('-vip');
                result.push({ fileName,isVIP, data });
            });

            return result;
        }

        const cardPacks = readDecksFromFolder(folderPath);
        console.log(cardPacks);
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('select-pack')
            .setPlaceholder('Select Card Pack!');

        Object.keys(cardPacks).forEach(key => {
            const pack = cardPacks[key];
            console.log(pack);
            selectMenu.addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel(pack.data.name)
                    .setEmoji('')
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
                await interaction.followUp(`Card Pack Selected to ${selectedPack}.`);

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

const { SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

// Assuming you have a predefined array of card packs

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set')
        .setDescription('set Game Cards Pack!'),
    async execute(interaction) {
        const cardPacks = [
            { label: 'Pack 1', description: 'The dual-type Grass/Poison Seed Pokémon.', value: 'bulbasaur' },
            { label: 'A**hole', description: 'The Fire-type Lizard Pokémon.', value: 'charmander' },
            { label: 'پی شوم', description: 'پک فارسی شده و خنده دار.', value: 'squirtle' },
        ];

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('select-pack')
            .setPlaceholder('Select Card Pack!');

        cardPacks.forEach(option => {
            selectMenu.addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel(option.label)
                    .setDescription(option.description)
                    .setValue(option.value)
            );
        });

        console.log(selectMenu);
        // const selectMenu = new StringSelectMenuBuilder()
        //     .setCustomId('select-pack')
        //     .setPlaceholder('Select Card Pack')
        //     .addOptions(
        //         cardPacks.map(pack => {
        //             new StringSelectMenuOptionBuilder()
        //                 .setLabel(pack)
        //                 .setDescription(pack + ' Cards Pack.')
        //                 .setValue(pack.toLowerCase().replace(/\s/g, '_'))
        //                 .build()
        //         })
        //     );
        // const row = new ActionRowBuilder()
        //     .addComponents(selectMenu);

        await interaction.reply({
            content: 'Select Card Pack!',
            components: [row],
        });


    },
};

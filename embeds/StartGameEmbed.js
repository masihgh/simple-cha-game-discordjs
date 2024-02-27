const { EmbedBuilder } = require("discord.js");


const StartEmbed = new EmbedBuilder()
    .setColor('#ffffff')
    .setTitle('Game Created!')
    .setDescription('Game Created Successfuly')
    .setFooter({ text: 'Waiting for players join...', iconURL: 'https://i.imgur.com/AfFp7pu.png' });


const joinEmbed = (userTag) => {
    return new EmbedBuilder()
        .setColor('#47bd55')
        .setTitle(':white_check_mark: Player Joined!')
        .setDescription(`@${userTag} joined the game!`)
        .setTimestamp();
}

const leaveEmbed = (userTag) => {
    new EmbedBuilder()
        .setColor('#f50036')
        .setTitle(':x: Player Left!')
        .setDescription(`@${userTag} left the game.`)
        .setTimestamp();
}

const notInGameEmbed = new EmbedBuilder()
    .setColor('#fdd343')
    .setTitle(`:warning: You are not in the game!`);


const alreadyInGameEmbed = new EmbedBuilder()
    .setColor('#297ec4')
    .setTitle(`:arrow_forward: You are already in the game!`);

module.exports = {
    joinEmbed,
    leaveEmbed,
    notInGameEmbed,
    alreadyInGameEmbed,
    StartEmbed
}
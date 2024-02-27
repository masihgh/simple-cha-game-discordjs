const mongoose = require("mongoose");

const ActiveRoomSchema = new mongoose.Schema({
    guild_id: String,
    channel_id: String,
    owner_id: String,
    players: [],
    name: String,
    game_rounds: {type: Number, default: 10},
    created_at: { type: Date, default: Date.now },
    game_ended: Date
});

const ActiveRoom = mongoose.model('ActiveRoom', ActiveRoomSchema);

module.exports = ActiveRoom;

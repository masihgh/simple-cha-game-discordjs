const mongoose = require("mongoose");

const ActiveRoomSchema = new mongoose.Schema({
    guild_id: Number,
    channel_id: Number,
    owner_id: Number,
    players: [],
    name: String,
    created_at: { type: Date, default: Date.now },
    game_ended: Date
});

const ActiveRoom = mongoose.model('ActiveRoom', ActiveRoomSchema);

module.exports = ActiveRoom;

const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
    guild_id: Number,
    channel_id: Number,
    owner_id: Number,
    players: [],
    name: String,
    created_at: { type: Date, default: Date.now },
});

const Room = mongoose.model('Rooms', RoomSchema);

module.exports = Room;
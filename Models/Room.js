const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
    guild_id: String,
    channel_id: String,
    owner_id: String,
    players: [],
    name: String,
    created_at: { type: Date, default: Date.now },
});

const Room = mongoose.model('Rooms', RoomSchema);

module.exports = Room;

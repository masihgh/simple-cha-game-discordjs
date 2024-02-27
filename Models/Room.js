const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
    guild_id: Int,
    owner_id: Int,
    players: [],
    name: String,
    created_at: { type: Date, default: Date.now },
});

const Room = mongoose.model('Rooms', RoomSchema);

module.exports = Room;

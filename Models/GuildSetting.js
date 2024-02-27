const mongoose = require("mongoose");

const GuildSettingSchema = new mongoose.Schema({
    guild_id: String,
    packSelected: String,
});

const GuildSetting = mongoose.model('Rooms', GuildSettingSchema);

module.exports = GuildSetting;
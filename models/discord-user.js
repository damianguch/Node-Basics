const mongoose = require('mongoose');
const { Schema } = mongoose;

const discordUserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },

  discordId: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true
  }
});

const DiscordUser = mongoose.model('DiscordUser', discordUserSchema);

module.exports = DiscordUser;

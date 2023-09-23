const {Client, Collection} = require("discord.js")
const bot = require("./config/bot.json")
const sqlite3 = require("sqlite3").verbose();
const sql = new sqlite3.Database("./database/database.db");


const client = new Client({
    intents : [
        "GuildMembers",
        "MessageContent",
        "Guilds",
        "DirectMessages"
    ]
});


module.exports = client;
client.gacha_5 = new Collection();
client.gacha_10 = new Collection();
client.login(bot.token)
client.slashCommands = new Collection();
client.sql = sql;

require("./handlers")(client);
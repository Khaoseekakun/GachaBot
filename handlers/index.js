const { glob } = require("glob");
const { promisify } = require("util");
const { Client } = require("discord.js");
const { loadEvents } = require("./loadEvents");
const { loadslashCommands } = require("./loadSlashCommands");

const globPromise = promisify(glob);
/**
 * @param {Client} client
 */

module.exports = async (client) => {
    console.log('[Handler] Loading files...')
    loadEvents(client);
    client.on("ready", () => {
        loadslashCommands(client);
    })
}
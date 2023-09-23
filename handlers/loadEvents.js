const { Client } = require("discord.js");
const path = require("path");
const fs = require("fs");

/**
 * @param {Client} client
 */
async function loadEvents(client){
    let eventsPath = path.join(__dirname, "..", "events");
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
    
    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }
}

module.exports = {
    loadEvents
}
const path = require("path");
const fs = require("fs");
const { Client } = require("discord.js");
const { slashCommands } = require("..");

/**
 * 
 * @param {Client} client 
 */
async function loadslashCommands(client){

    let commandArray = [];
    let commandFolderPath = path.join(__dirname, "..", "slashCommands");
    const commandFolder = fs.readdirSync(commandFolderPath)
    commandFolder.forEach((folder) => {
        let commandFiles = fs.readdirSync(path.join(commandFolderPath, folder)).filter(file => file.endsWith('.js'));
        commandFiles.forEach((file) => {
            const commands = require(path.join(commandFolderPath, folder, file));
            slashCommands.set(commands.name, commands)
            commandArray.push(commands);
        })
    })

    client.application.commands.set(commandArray).catch((error) => {
        console.log(`[slashCommands] create command error`);
    }).then(() => {
        console.log(`[slashCommands] ${commandArray.length} SlashCommands!`)
    })
}

module.exports = {
    loadslashCommands
}
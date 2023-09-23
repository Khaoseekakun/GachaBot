
const {CommandInteraction, EmbedBuilder} = require("discord.js")

/**
 * 
 * @param {CommandInteraction} interaction 
 * @param {string} text 
 * @param {boolean} hide 
 */

function successReply(interaction, text, hide = true){
    let embeds = new EmbedBuilder()
    .setAuthor({
        name : text,
        iconURL : "https://media.discordapp.net/attachments/855643137716650015/1153619364097040414/icons8-ok-240.png"
    }).setColor("#C9FFA9")
    .setTimestamp()

    interaction.reply({
        embeds : [embeds],
        ephemeral : hide
    }).catch(() => {})
}

/**
 * 
 * @param {CommandInteraction} interaction 
 * @param {string} text 
 * @param {boolean} hide 
 */

function errorReply(interaction, text, hide = true){
    let embeds = new EmbedBuilder()
    .setAuthor({
        name : text,
        iconURL : "https://media.discordapp.net/attachments/855643137716650015/1153619363866361866/icons8-error-240.png"
    }).setColor("#FFA9A9")
    .setTimestamp()

    interaction.reply({
        embeds : [embeds],
        ephemeral : hide
    }).catch(() => {})
}

module.exports = {
    successReply,
    errorReply
}
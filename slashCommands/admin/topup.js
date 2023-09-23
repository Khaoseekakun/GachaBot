const { ApplicationCommandType, ApplicationCommandOptionType, CommandInteraction, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextChannel } = require("discord.js");
const { errorReply, successReply } = require("../../handlers/reply");
const { sql } = require("../..");

module.exports = {
    name : "topup",
    description : "ระบบเติมPoint",
    type : ApplicationCommandType.ChatInput,
    options: [
        {
            name : "slip",
            description: "รูปสลิป",
            type : ApplicationCommandOptionType.Attachment,
            required : true
        },{
            name : "amount",
            description: "ระบุจำนวนที่อยู่ในสลิป",
            type : ApplicationCommandOptionType.Integer,
            required : true
        }
    ],
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    run: async(client, interaction) => {
        let files = interaction.options.get("slip").attachment;
        let amount = interaction.options.get("amount").value;
        if(amount <= 0) return errorReply(interaction, "จำนวนPointต้องมากกว่า 0")
        if(files){
            if(files.url.endsWith(".png") || files.url.endsWith(".jpg") || files.url.endsWith(".jpeg")){
                sql.get(`SELECT * FROM channel_slip WHERE guild_id = '${interaction.guildId}'`, (err, row) => {
                    if(err) {
                        console.log(err)
                        errorReply(interaction, "เกิดข้อผิดพลาดในระบบฐานข้อมูล โปรดลองอีกครั้ง")
                    }else{
                        if(row){
                            client.channels.fetch(row.channel_id).then(/** @param {TextChannel} channel */channel => {
                                if(channel){
                                    let embeds = new EmbedBuilder()
                                    .setAuthor({
                                        name : interaction.user.username,
                                        iconURL : interaction.user.avatarURL() ?? null
                                    }).setImage(files.url)
                                    .setColor("#FFE9A9")
                                    .setDescription(`💳 จำนวนPoint ${amount} Point`)
                                    .setThumbnail(interaction.user.avatarURL() ?? null)

                                    let actionRow = new ActionRowBuilder()
                                    .setComponents(
                                        new ButtonBuilder()
                                        .setCustomId(`confirm_topup_${interaction.user.id}_${amount}`)
                                        .setLabel("ยืนยันการเติมPoint")
                                        .setStyle(ButtonStyle.Success)
                                        .setEmoji("✅"),

                                        new ButtonBuilder()
                                        .setCustomId(`cancel_topup_${interaction.user.id}`)
                                        .setLabel("ยกเลิกการเติมPoint")
                                        .setStyle(ButtonStyle.Danger)
                                        .setEmoji("❌")
                                    )
                                    channel.send({
                                        embeds : [embeds],
                                        components : [actionRow]
                                    }).catch(() => {
                                        errorReply(interaction, "ไม่สามารถส่งข้อความได้ โปรดตรวจสอบสิทธิ์ของบอท")
                                    }).then(() => {
                                        successReply(interaction, "ส่งสลิปเรียบร้อยแล้ว")
                                    })
                                }else{
                                    errorReply(interaction, "ไม่พบห้องสำหรับอัพโหลดสลิป โปรดติดต่อผู้ดูแลระบบ")
                                }
                            }).catch(() => {
                                errorReply(interaction, "ไม่พบห้องสำหรับอัพโหลดสลิป โปรดติดต่อผู้ดูแลระบบ")
                            })
                        }else{
                            errorReply(interaction, "ผู้ดูแลระบบยังไม่ได้สร้างห้องสำหรับส่งสลิป โปรดติดต่อผู้ดูแลระบบ")
                        }
                    }
                })
            }else{
                errorReply(interaction, "กรุณาอัพโหลดไฟล์รูปภาพเท่านั้น")
            }
        }
    }
}
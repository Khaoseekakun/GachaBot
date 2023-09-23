const { ApplicationCommandType, ApplicationCommandOptionType, Client, CommandInteraction, ChannelType, EmbedBuilder, TextChannel, ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction, ModalBuilder, TextInputBuilder, ModalSubmitInteraction } = require("discord.js");
const { errorReply, successReply } = require("../../handlers/reply");
const { sql } = require("../..");
const jsonEditFile = require("edit-json-file");

module.exports = {
    name : "setup",
    description : "ระบบตั้งค่า",
    type : ApplicationCommandType.ChatInput,
    options: [
        {
            name : "slip-channel",
            description: "ช่องส่งสลิป",
            type : ApplicationCommandOptionType.Subcommand,
            options : [
                {
                    name : "channel",
                    description: "ช่องส่งสลิป",
                    type : ApplicationCommandOptionType.Channel,
                    required : true
                }
            ]
        },{
            name : "show-market",
            description: "แสดงตลาด",
            type : ApplicationCommandOptionType.Subcommand,
            options : [
                {
                    name : "channel",
                    description: "ช่องแสดงตลาด",
                    type : ApplicationCommandOptionType.Channel,
                    required : true
                }
            ]
        },{
            name : "show-market-coins",
            description: "แสดงตลาด",
            type : ApplicationCommandOptionType.Subcommand,
            options : [
                {
                    name : "channel",
                    description: "ช่องแสดงตลาด",
                    type : ApplicationCommandOptionType.Channel,
                    required : true
                }
            ]
        },{
            name : "vip",
            description: "ระบบ VIP",
            type : ApplicationCommandOptionType.Subcommand,
        }
    ],
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    run : async(client, interaction) => {
        if(!interaction.memberPermissions.has("Administrator")) return errorReply(interaction, "คุณต้องมีสิทธิ์ผู้ดูแล เพื่อใช้คำสั่งนี้");
        const subcommand = interaction.options.data[0].name;
        if(subcommand == "slip-channel"){
            let channel = interaction.options.get("channel").channel;
            if(channel && channel.type != ChannelType.GuildText) return errorReply(interaction, "กรุณาเลือกช่องข้อความ");
            sql.get(`SELECT * FROM channel_slip WHERE guild_id = '${interaction.guildId}'`, (err, row) => {
                if(err) {
                    console.log(err)
                    errorReply(interaction, "เกิดข้อผิดพลาดในระบบฐานข้อมูล โปรดลองอีกครั้ง")
                }else{
                    if(row){
                        sql.run(`UPDATE channel_slip SET channel_id = '${channel.id}' WHERE guild_id = '${interaction.guildId}'`, (err) => {
                            if(err) {
                                console.log(err)
                                errorReply(interaction, "เกิดข้อผิดพลาดในระบบฐานข้อมูล โปรดลองอีกครั้ง")
                            }else{
                                successReply(interaction, `ตั้งค่าช่องส่งสลิปเป็น ${channel.name}`)
                            }
                        })
                    }else{
                        sql.run(`INSERT INTO channel_slip (guild_id, channel_id) VALUES ('${interaction.guildId}', '${channel.id}')`, (err) => {
                            if(err) {
                                console.log(err)
                                errorReply(interaction, "เกิดข้อผิดพลาดในระบบฐานข้อมูล โปรดลองอีกครั้ง")
                            }else{
                                successReply(interaction, `ตั้งค่าช่องส่งสลิปเป็น ${channel.name}`)
                            }
                        })
                    }
                }
            });
        }
        if(subcommand == "show-market"){
            /**
             * @type {TextChannel}
             */
            let channel = interaction.options.get("channel").channel;
            if(channel && channel.type != ChannelType.GuildText) return errorReply(interaction, "กรุณาเลือกช่องข้อความ");
            const market = jsonEditFile(`${__dirname}/../../config/market.json`);
            const market_data = market.get();
            let embeds = new EmbedBuilder(market_data)
            let buttonComponents = new ActionRowBuilder()
            .setComponents(
                new ButtonBuilder()
                .setCustomId("market_start")
                .setLabel("เปิดกล่องสุ่ม!")
                .setStyle(ButtonStyle.Success)
                .setEmoji("🎁"),

                new ButtonBuilder()
                .setCustomId("member_check_data")
                .setLabel("ตรวจสอบข้อมูล")
                .setStyle(ButtonStyle.Primary)
                .setEmoji("📊"),checkMoney
            )
            if(embeds){
                channel.send({
                    embeds : [embeds],
                    components : [buttonComponents]
                }).catch((e) => {
                    console.log(e)
                    errorReply(interaction, "ไม่สามารถส่งข้อความได้ โปรดตรวจสอบสิทธิ์ของบอท หรือข้อผิดพลาดผ่าน console")
                }).then(() => {
                    successReply(interaction, "สร้างข้อความสำเร็จแล้ว")
                })
            }else{
                errorReply(interaction, "ไม่สามารถแสดงตลาดได้ market.json ไม่ถูกต้อง")
            }
        }
        if(subcommand == "show-market-coins"){
            /**
             * @type {TextChannel}
             */
            let channel = interaction.options.get("channel").channel;
            if(channel && channel.type != ChannelType.GuildText) return errorReply(interaction, "กรุณาเลือกช่องข้อความ");
            const market = jsonEditFile(`${__dirname}/../../config/market_conis.json`);
            const market_data = market.get();
            let embeds = new EmbedBuilder(market_data)
            let buttonComponents = new ActionRowBuilder()
            .setComponents(
                new ButtonBuilder()
                .setCustomId("coins-market_start")
                .setLabel("เปิดกล่องสุ่ม!")
                .setStyle(ButtonStyle.Success)
                .setEmoji("🎁"),

                new ButtonBuilder()
                .setCustomId("coins-member_check_data")
                .setLabel("ตรวจสอบข้อมูล")
                .setStyle(ButtonStyle.Primary)
                .setEmoji("📊")
            )
            if(embeds){
                channel.send({
                    embeds : [embeds],
                    components : [buttonComponents]
                }).catch((e) => {
                    console.log(e)
                    errorReply(interaction, "ไม่สามารถส่งข้อความได้ โปรดตรวจสอบสิทธิ์ของบอท หรือข้อผิดพลาดผ่าน console")
                }).then(() => {
                    successReply(interaction, "สร้างข้อความสำเร็จแล้ว")
                })
            }else{
                errorReply(interaction, "ไม่สามารถแสดงตลาดได้ market.json ไม่ถูกต้อง")
            }
        }
        if(subcommand == "vip"){
            let vip = jsonEditFile(`${__dirname}/../../config/sub.json`);
            let vip_data = vip.get();
            let embeds = new EmbedBuilder(vip_data);

            let components = new ActionRowBuilder()
            .setComponents(
                new ButtonBuilder()
                .setCustomId("vip_1")
                .setLabel("VIP Silver")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("🥈"),

                new ButtonBuilder()
                .setCustomId("vip_2")
                .setLabel("VIP Gold")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("🥇"),

                new ButtonBuilder()
                .setCustomId("vip_3")
                .setLabel("VIP Platinum")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("💎"),

                new ButtonBuilder()
                .setCustomId("check_vip")
                .setLabel("เช็ค VIP")
                .setStyle(ButtonStyle.Primary)
                .setEmoji("📊")
            )

            interaction.channel.send({
                embeds : [embeds],
                components : [components]
            }).catch((e) => {
                console.log(e)
                errorReply(interaction, "ไม่สามารถส่งข้อความได้ โปรดตรวจสอบสิทธิ์ของบอท หรือข้อผิดพลาดผ่าน console")
            }).then(() => {
                successReply(interaction, "สร้างข้อความสำเร็จแล้ว")
            })  
        }
    }
}
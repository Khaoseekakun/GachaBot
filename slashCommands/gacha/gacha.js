const { ApplicationCommandType, ApplicationCommandOptionType, CommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ModalSubmitInteraction } = require("discord.js");
const { errorReply, successReply } = require("../../handlers/reply");
const { sql } = require("../..");

module.exports = {
    name : "gacha",
    description : "ระบบกล่องสุ่ม",
    type : ApplicationCommandType.ChatInput,
    options : [
        {
            name : "create-gacha",
            description : "สร้างกล่องสุ่ม",
            type : ApplicationCommandOptionType.Subcommand,
            options : [
                {
                    name : "name",
                    description : "ชื่อกล่องสุ่ม",
                    type : ApplicationCommandOptionType.String,
                    required : true
                },{
                    name : "description",
                    description : "รายละเอียดกล่องสุ่ม",
                    type : ApplicationCommandOptionType.String,
                    required : true
                },{
                    name : "price",
                    description : "ราคากล่องสุ่ม",
                    type : ApplicationCommandOptionType.Integer,
                    required : true
                }
            ]
        },{
            name : "setup-gacha",
            description : "ตั้งค่ากล่องสุ่ม",
            type : ApplicationCommandOptionType.Subcommand,
            options : [
                {
                    name : "gacha-id",
                    description : "ID กล่องสุ่ม",
                    type : ApplicationCommandOptionType.Integer,
                    required : true
                }
            ]
        },{
            name : "create-item",
            description : "สร้างไอเทม",
            type : ApplicationCommandOptionType.Subcommand,
        },{
            name : "setup-item",
            description : "ลบไอเทม",
            type : ApplicationCommandOptionType.Subcommand,
            options : [
                {
                    name : "item-id",
                    description : "ID ไอเทม",
                    type : ApplicationCommandOptionType.Integer,
                    required : true
                }
            ]
        },
        {
            name : "add-item",
            description : "เพิ่มไอเทม",
            type : ApplicationCommandOptionType.Subcommand,
            options : [
                {
                    name : "gacha-id",
                    description : "ID กล่องสุ่ม",
                    type : ApplicationCommandOptionType.Integer,
                    required : true
                },{
                    name : "item-id",
                    description : "ID ไอเทม",
                    type : ApplicationCommandOptionType.Integer,
                    required : true
                },{
                    name : "rate" ,
                    description : "เปอร์เซ็นต์",
                    type : ApplicationCommandOptionType.Integer,
                    required : true
                }
            ]
        },
        {
            name : "remove-item",
            description : "ลบไอเทม",
            type : ApplicationCommandOptionType.Subcommand,
            options : [
                {
                    name : "gacha-id",
                    description : "ID กล่องสุ่ม",
                    type : ApplicationCommandOptionType.Integer,
                    required : true
                },{
                    name : "item-id",
                    description : "ID ไอเทม",
                    type : ApplicationCommandOptionType.Integer,
                    required : true
                }
            ]
        }
    ],
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    run: async(client, interaction) => {
        if(!interaction.memberPermissions.has("Administrator")) return errorReply(interaction, "คุณต้องมีสิทธิ์ผู้ดูแล เพื่อใช้คำสั่งนี้");
        const subcommand = interaction.options.data[0].name;
        if(subcommand == "create-gacha"){
            let name = interaction.options.get("name").value;
            let price = interaction.options.get("price").value;
            sql.run(`INSERT INTO gacha_box (name, price) VALUES ('${name}', ${price})`, (err) => {  
                if(err){
                    console.log(err)
                    return errorReply(interaction, "เกิดข้อผิดพลาดบางอย่าง ขณะที่กำลังเพิ่มข้อมูล");
                }else{
                    sql.get(`SELECT * FROM gacha_box ORDER BY id DESC LIMIT 1`, (err, res) => {
                        if(err) {
                            console.log(err)
                            return errorReply(interaction, "เกิดข้อผิดพลาดบางอย่าง ขณะกำลังตรวจสอบข้อมูล");
                        }else{
                            successReply(interaction, `สร้างกล่องสุ่ม ${res.name} ID : ${res.id} เรียบร้อยแล้ว`);
                        }
                    });
                }
            })
        }
        if(subcommand == "setup-gacha"){
            let gacha_id = interaction.options.get("gacha-id").value;
            sql.get(`SELECT * FROM gacha_box WHERE id = ${gacha_id}`, (err, res) => {
                if(err) {
                    console.log(err)
                    return errorReply(interaction, "เกิดข้อผิดพลาดบางอย่าง ขณะกำลังตรวจสอบข้อมูล");
                }else{
                    if(res){
                        let actionRow = new ActionRowBuilder()
                        .setComponents(
                            new ButtonBuilder()
                            .setCustomId(`update_gacha_${gacha_id}`)
                            .setLabel("อัพเดทกล่องสุ่ม")
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji("🔄"),

                            new ButtonBuilder()
                            .setCustomId(`delete_gacha_${gacha_id}`)
                            .setLabel("ลบกล่องสุ่ม")
                            .setStyle(ButtonStyle.Danger)
                            .setEmoji("🗑️")  
                        )

                        let embeds = new EmbedBuilder()
                        .setAuthor({
                            name : `กล่องสุ่ม ${res.name}`,
                            iconURL : "https://cdn-icons-png.flaticon.com/512/3597/3597075.png"
                        }).setDescription("```\n"+res.description+"\n```")
                        .setThumbnail("https://cdn-icons-png.flaticon.com/512/4883/4883370.png")
                        .setColor("#96ffe1")

                        interaction.reply({
                            embeds : [embeds],
                            components : [actionRow],
                            ephemeral : true
                        }).catch(() => {
                            errorReply(interaction, "ไม่สามารถแสดงผลข้อมูลได้")
                        })
                    }else{
                        return errorReply(interaction, "ไม่พบกล่องสุ่มนี้ในระบบ");
                    }
                }
            })
        }
        if(subcommand == "setup-item"){
            let item_id = interaction.options.get("item-id").value;
            sql.get(`SELECT * FROM gacha_items WHERE id = ${item_id}`, (err, res) => {
                if(err) {
                    console.log(err)
                    return errorReply(interaction, "เกิดข้อผิดพลาดบางอย่าง ขณะกำลังตรวจสอบข้อมูล");
                }else{
                    if(res){
                        let actionRow = new ActionRowBuilder()
                        .setComponents(
                            new ButtonBuilder()
                            .setCustomId(`update_item_${item_id}`)
                            .setLabel("อัพเดทไอเทม")
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji("🔄"),

                            new ButtonBuilder()
                            .setCustomId(`delete_item_${item_id}`)
                            .setLabel("ลบไอเทม")
                            .setStyle(ButtonStyle.Danger)
                            .setEmoji("🗑️")  
                        )

                        let embeds = new EmbedBuilder()
                        .setAuthor({
                            name : `ไอเทม ${res.name}`,
                            iconURL : "https://cdn-icons-png.flaticon.com/512/3597/3597075.png"
                        }).setDescription("```\n"+res.description+"\n```")
                        .setThumbnail("https://cdn-icons-png.flaticon.com/512/4883/4883370.png")
                        .setColor("#96ffe1")

                        interaction.reply({
                            embeds : [embeds],
                            components : [actionRow],
                            ephemeral : true
                        }).catch(() => {
                            errorReply(interaction, "ไม่สามารถแสดงผลข้อมูลได้")
                        })
                    }else{
                        return errorReply(interaction, "ไม่พบไอเทมนี้ในระบบ");
                    }
                }
            })
        }
        if(subcommand == "create-item"){
            let modal = new ModalBuilder()
            .setTitle("สร้างไอเทม")
            .setCustomId("create_item")
            .setComponents(
                new ActionRowBuilder()
                .setComponents(
                    new TextInputBuilder()
                    .setCustomId("name")
                    .setPlaceholder("ชื่อไอเทม")
                    .setMinLength(1)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setLabel("ชื่อไอเทม")
                ),

                new ActionRowBuilder()
                .setComponents(
                    new TextInputBuilder()
                    .setCustomId("url")
                    .setPlaceholder("รูปภาพไอเทม")
                    .setMinLength(1)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setLabel("รูปภาพไอเทม")
                ),
                
                new ActionRowBuilder()
                .setComponents(
                    new TextInputBuilder()
                    .setCustomId("description")
                    .setPlaceholder("รายละเอียดไอเทม")
                    .setMinLength(1)
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
                    .setLabel("รายละเอียดไอเทม")
                ),
                
                new ActionRowBuilder()
                .setComponents(
                    new TextInputBuilder()
                    .setCustomId("command")
                    .setPlaceholder("คำสั่งไอเทม")
                    .setMinLength(1)
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
                    .setLabel("คำสั่งไอเทม")
                )
            )

            interaction.showModal(modal).catch((e) => {
                console.log(e)
                errorReply(interaction, "ไม่สามารถแสดงผลข้อมูลได้")
            })
        }
        if(subcommand == "add-item"){
            let gacha_id = interaction.options.get("gacha-id").value;
            let item_id = interaction.options.get("item-id").value;
            let rate = interaction.options.get("rate").value;

            sql.get(`SELECT * FROM gacha_box WHERE id = ${gacha_id}`, (err, res) => {
                if(err) {
                    console.log(err)
                    return errorReply(interaction, "เกิดข้อผิดพลาดบางอย่าง ขณะกำลังตรวจสอบข้อมูล");
                }else{
                    if(res){
                        sql.get(`SELECT * FROM items WHERE id = ${item_id}`, (err, res) => {
                            if(err) {
                                console.log(err)
                                return errorReply(interaction, "เกิดข้อผิดพลาดบางอย่าง ขณะกำลังตรวจสอบข้อมูล");
                            }else{
                                if(res){
                                    sql.get(`SELECT * FROM gacha_items WHERE gacha_box_id = ${gacha_id} AND item_id = ${item_id}`, (err, resG) => {
                                        if(err) {
                                            console.log(err)
                                            return errorReply(interaction, "เกิดข้อผิดพลาดบางอย่าง ขณะกำลังตรวจสอบข้อมูล");
                                        }else{
                                            if(resG){
                                                sql.run(`UPDATE gacha_items SET rate = ${rate} WHERE gacha_box_id = ${gacha_id} AND item_id = ${item_id}`, (err) => {  
                                                    if(err){
                                                        console.log(err)
                                                        return errorReply(interaction, "เกิดข้อผิดพลาดบางอย่าง ขณะที่กำลังอัพเดทข้อมูล");
                                                    }else{
                                                        successReply(interaction, `อัพเดทไอเทม ${res.name} ID : ${res.id} เรียบร้อยแล้ว`);
                                                    }
                                                })
                                            }else{
                                                sql.run(`INSERT INTO gacha_items (gacha_box_id, item_id, rate) VALUES (${gacha_id}, ${item_id}, ${rate})`, (err) => {  
                                                    if(err){
                                                        console.log(err)
                                                        return errorReply(interaction, "เกิดข้อผิดพลาดบางอย่าง ขณะที่กำลังเพิ่มข้อมูล");
                                                    }else{
                                                        successReply(interaction, `เพิ่มไอเทม ${res.name} ID : ${res.id} เรียบร้อยแล้ว`);
                                                    }
                                                })
                                            }
                                        }
                                    })
                                }else{
                                    return errorReply(interaction, "ไม่พบไอเทมนี้ในระบบ");
                                }
                            }
                        })
                    }else{
                        return errorReply(interaction, "ไม่พบกล่องสุ่มนี้ในระบบ");
                    }
                }
            })
        }
        if(subcommand == "remove-item"){
            let gacha_id = interaction.options.get("gacha-id").value;
            let item_id = interaction.options.get("item-id").value;

            sql.get('SELECT * FROM gacha_items WHERE gacha_box_id = ? AND item_id = ?', [gacha_id, item_id], (err, res) => {
                if(err) {
                    console.log(err)
                    return errorReply(interaction, "เกิดข้อผิดพลาดบางอย่าง ขณะกำลังตรวจสอบข้อมูล");
                }else{
                    if(res){
                        sql.run(`DELETE FROM gacha_items WHERE gacha_box_id = ${gacha_id} AND item_id = ${item_id}`, (err) => {  
                            if(err){
                                console.log(err)
                                return errorReply(interaction, "เกิดข้อผิดพลาดบางอย่าง ขณะที่กำลังลบข้อมูล");
                            }else{
                                successReply(interaction, `ลบไอเทม ID : ${item_id} เรียบร้อยแล้ว`);
                            }
                        })
                    }else{
                        return errorReply(interaction, "ไม่พบไอเทมนี้ในกล่องสุ่มนี้");
                    }
                }
            })
        }
    }
}
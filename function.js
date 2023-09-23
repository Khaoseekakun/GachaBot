let fs = require("fs");
const { ButtonInteraction, CommandInteraction, EmbedBuilder, ModalSubmitInteraction, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, User, ChannelType, ButtonBuilder, ButtonStyle, TextChannel, ThreadChannel, Attachment } = require("discord.js");
const { sql, reward, gacha_5, gacha_10 } = require(".");
const { errorReply, successReply } = require("./handlers/reply");
const client = require(".");
const EditJsonFile = require("edit-json-file");
const { gachaBox1, gachaBox5, gachaBox10 } = require("./canvas");

/**
 * @param {ButtonInteraction | CommandInteraction} interaction 
 * @param {User} user
 */


function checkMoney(interaction, user) {
    sql.get(`SELECT * FROM members WHERE member_id = '${user.id}'`, (err, res) => {
        if (err) {
            console.log(err)
            errorReply(interaction, "เกิดข้อผิดพลาดบางอย่าง ภายในระบบฐานข้อมูล")
        } else {
            let embeds = new EmbedBuilder()
                .setAuthor({
                    name: `บัญชีของ | ${user.username}`,
                    iconURL: user.displayAvatarURL() ?? null
                }).setColor("#ffc496")

            if (res) {
                /**
                 * @type {number}
                 */
                let money = res.money
                /**
                 * @type {number}
                 */
                let total = res.total
                embeds.setFields(
                    {
                        name: "💵 Point ในบัญชี",
                        value: `${money.toFixed(0)} Point`,
                        inline: true
                    }, {
                    name: "💳 ยอดเติมทั้งหมด",
                    value: `${total.toFixed(0)} Point`,
                    inline: true
                }
                )
            } else {

                embeds.setFields(
                    {
                        name: "💵 Point ในบัญชี",
                        value: `0 Point`,
                        inline: true
                    }, {
                    name: "💳 ยอดเติมทั้งหมด",
                    value: `0 Point`,
                    inline: true
                }
                )
            }

            interaction.reply({
                embeds: [embeds],
                ephemeral: true
            }).catch(() => {
                errorReply(interaction, "ไม่สามารถแสดงผลข้อมูลได้")
            })
        }
    })
}

/**
 * @param {CommandInteraction} interaction 
 * @param {string} member_id 
 * @param {number} amount 
 */
function setMoney(interaction, member_id, amount) {
    sql.get(`SELECT * FROM members WHERE member_id = '${member_id}'`, (err, res) => {
        if (err) {
            console.log(err)
            errorReply(interaction, "เกิดข้อผิดพลาดบางอย่าง ภายในระบบฐานข้อมูล")
        } else {
            if (res) {
                sql.run(`UPDATE members SET money = ${amount} WHERE member_id = '${member_id}'`, (err) => {
                    if (err) {
                        console.log(err)
                        errorReply(interaction, "เกิดข้อผิดพลาดบางอย่าง ขณะที่กำลังอัพเดทข้อมูล")
                    } else {
                        successReply(interaction, "อัพเดทข้อมูลเรียบร้อยแล้ว")
                    }
                })
            } else {
                sql.run(`INSERT INTO members (member_id, money, total) VALUES ('${member_id}', ${amount}, 0)`, (err) => {
                    if (err) {
                        console.log(err)
                        errorReply(interaction, "เกิดข้อผิดพลาดบางอย่าง ขณะที่กำลังเพิ่มข้อมูล")
                    } else {
                        successReply(interaction, "เพิ่มข้อมูลเรียบร้อยแล้ว")
                    }
                })
            }
        }
    })
}

function checkCoins(interaction, user) {
    sql.get(`SELECT * FROM members WHERE member_id = '${user.id}'`, (err, res) => {
        if (err) {
            console.log(err)
            errorReply(interaction, "เกิดข้อผิดพลาดบางอย่าง ภายในระบบฐานข้อมูล")
        } else {
            let embeds = new EmbedBuilder()
                .setAuthor({
                    name: `บัญชีของ | ${user.username}`,
                    iconURL: user.displayAvatarURL() ?? null
                }).setColor("#ffc496")

            if (res) {
                /**
                 * @type {number}
                 */
                let coins = res.coins
                embeds.setFields(
                    {
                        name: "💵 Coins ในบัญชี",
                        value: `${coins.toFixed(0)} Coins`,
                        inline: true
                    }
                )
            } else {

                embeds.setFields(
                    {
                        name: "💵 Coins ในบัญชี",
                        value: `0 Coins`,
                        inline: true
                    }
                )
            }

            interaction.reply({
                embeds: [embeds],
                ephemeral: true
            }).catch(() => {
                errorReply(interaction, "ไม่สามารถแสดงผลข้อมูลได้")
            })
        }
    })
}

/**
 * @param {CommandInteraction} interaction 
 * @param {string} member_id 
 * @param {number} amount 
 */
function setCoins(interaction, member_id, amount) {
    sql.get(`SELECT * FROM members WHERE member_id = '${member_id}'`, (err, res) => {
        if (err) {
            console.log(err)
            errorReply(interaction, "เกิดข้อผิดพลาดบางอย่าง ภายในระบบฐานข้อมูล")
        } else {
            if (res) {
                sql.run(`UPDATE members SET coins = ${amount} WHERE member_id = '${member_id}'`, (err) => {
                    if (err) {
                        console.log(err)
                        errorReply(interaction, "เกิดข้อผิดพลาดบางอย่าง ขณะที่กำลังอัพเดทข้อมูล")
                    } else {
                        successReply(interaction, "อัพเดทข้อมูลเรียบร้อยแล้ว")
                    }
                })
            } else {
                sql.run(`INSERT INTO members (member_id, coins, total) VALUES ('${member_id}', ${amount}, 0)`, (err) => {
                    if (err) {
                        console.log(err)
                        errorReply(interaction, "เกิดข้อผิดพลาดบางอย่าง ขณะที่กำลังเพิ่มข้อมูล")
                    } else {
                        successReply(interaction, "เพิ่มข้อมูลเรียบร้อยแล้ว")
                    }
                })
            }
        }
    })
}


/**
         * 
         * @param {ButtonInteraction} interaction 
         */
function updateItemModal(interaction) {
    let item_id = interaction.customId.split("_")[2];
    sql.get(`SELECT * FROM gacha_items WHERE id = ${item_id}`, (err, res) => {
        if (err) {
            console.log(err)
            return errorReply(interaction, "เกิดข้อผิดพลาดบางอย่าง ขณะกำลังตรวจสอบข้อมูล");
        } else {
            if (res) {
                let modal = new ModalBuilder()
                    .setTitle("อัพเดทไอเทม")
                    .setCustomId(`update_item_${item_id}`)
                    .setComponents(
                        new ActionRowBuilder()
                            .setComponents(
                                new TextInputBuilder()
                                    .setCustomId("name")
                                    .setPlaceholder("ชื่อไอเทม")
                                    .setValue(res.name)
                                    .setMinLength(1)
                                    .setStyle(TextInputStyle.Short)
                                    .setRequired(true)
                            ),

                        new ActionRowBuilder()
                            .setComponents(
                                new TextInputBuilder()
                                    .setCustomId("url")
                                    .setPlaceholder("รูปภาพไอเทม")
                                    .setValue(res.url)
                                    .setMinLength(1)
                                    .setStyle(TextInputStyle.Short)
                                    .setRequired(true)
                            ),

                        new ActionRowBuilder()
                            .setComponents(
                                new TextInputBuilder()
                                    .setCustomId("description")
                                    .setPlaceholder("รายละเอียดไอเทม")
                                    .setValue(res.description)
                                    .setMinLength(1)
                                    .setStyle(TextInputStyle.Paragraph)
                                    .setRequired(true)
                            ),

                        new ActionRowBuilder()
                            .setComponents(
                                new TextInputBuilder()
                                    .setCustomId("command")
                                    .setPlaceholder("คำสั่งไอเทม")
                                    .setValue(res.command)
                                    .setMinLength(1)
                                    .setStyle(TextInputStyle.Paragraph)
                                    .setRequired(true)
                            )
                    )

                interaction.showModal(modal).catch(() => {
                    errorReply(interaction, "ไม่สามารถแสดงผลข้อมูลได้")
                })
            } else {
                return errorReply(interaction, "ไม่พบไอเทมนี้ในระบบ");
            }
        }
    })
}

/**
 * 
 * @param {ModalSubmitInteraction} interaction 
 */
function insertItemSql(interaction) {
    let name = interaction.fields.getTextInputValue("name");
    let url = interaction.fields.getTextInputValue("url");
    let description = interaction.fields.getTextInputValue("description");
    let command = interaction.fields.getTextInputValue("command");

    sql.run(`INSERT INTO items (name, url, description, command) VALUES ('${name}', '${url}', '${description}', '${command}')`, (err) => {
        if (err) {
            console.log(err)
            return errorReply(interaction, "เกิดข้อผิดพลาดบางอย่าง ขณะกำลังเพิ่มข้อมูล");
        } else {
            sql.get(`SELECT * FROM items ORDER BY id DESC LIMIT 1`, (err, res) => {
                if (err) {
                    console.log(err)
                    return errorReply(interaction, "เกิดข้อผิดพลาดบางอย่าง ขณะกำลังตรวจสอบข้อมูล");
                } else {
                    successReply(interaction, `สร้างไอเทม ${res.name} ID : ${res.id} เรียบร้อยแล้ว`);
                }
            });
        }
    })
}

/**
 * 
 * @param {ModalSubmitInteraction} interaction 
 */
function updateItemSql(interaction) {
    let item_id = interaction.customId.split("_")[2];
    let name = interaction.fields.getTextInputValue("name");
    let url = interaction.fields.getTextInputValue("url");
    let description = interaction.fields.getTextInputValue("description");
    let command = interaction.fields.getTextInputValue("command");

    sql.run(`UPDATE items SET name = '${name}', url = '${url}', description = '${description}', command = '${command}' WHERE id = ${item_id}`, (err) => {
        if (err) {
            console.log(err)
            return errorReply(interaction, "เกิดข้อผิดพลาดบางอย่าง ขณะกำลังอัพเดทข้อมูล");
        } else {
            successReply(interaction, "อัพเดทข้อมูลเรียบร้อยแล้ว");
        }
    })
}

function deleteItemSql(interaction) {
    let item_id = interaction.customId.split("_")[2];
    sql.run(`DELETE FROM items WHERE id = ${item_id}`, (err) => {
        if (err) {
            console.log(err)
            return errorReply(interaction, "เกิดข้อผิดพลาดบางอย่าง ขณะกำลังลบข้อมูล");
        } else {
            sql.run(`DELETE FROM gacha_items WHERE items-id = ${item_id}`, (err) => { })
            successReply(interaction, "ลบข้อมูลเรียบร้อยแล้ว");
        }
    })
}

function deleteGachaSql(interaction) {
    let gacha_id = interaction.customId.split("_")[2];
    sql.run(`DELETE FROM gacha_box WHERE id = ${gacha_id}`, (err) => {
        if (err) {
            console.log(err)
            return errorReply(interaction, "เกิดข้อผิดพลาดบางอย่าง ขณะกำลังลบข้อมูล");
        } else {
            successReply(interaction, "ลบข้อมูลเรียบร้อยแล้ว");
            sql.run(`DELETE FROM gacha_items WHERE gacha_box_id = ${gacha_id}`, (err) => { })
        }
    })
}

/**
 * 
 * @param {ModalSubmitInteraction} interaction 
 */
function createItemSql(interaction) {
    let name = interaction.fields.getTextInputValue("name");
    let url = interaction.fields.getTextInputValue("url");
    let description = interaction.fields.getTextInputValue("description");
    let command = interaction.fields.getTextInputValue("command");

    sql.run(`INSERT INTO items (name, url, description, command) VALUES ('${name}', '${url}', '${description}', '${command}')`, (err) => {
        if (err) {
            console.log(err)
            return errorReply(interaction, "เกิดข้อผิดพลาดบางอย่าง ขณะกำลังเพิ่มข้อมูล");
        } else {
            sql.get(`SELECT * FROM items ORDER BY id DESC LIMIT 1`, (err, res) => {
                if (err) {
                    console.log(err)
                    return errorReply(interaction, "เกิดข้อผิดพลาดบางอย่าง ขณะกำลังตรวจสอบข้อมูล");
                } else {
                    successReply(interaction, `สร้างไอเทม ${res.name} ID : ${res.id} เรียบร้อยแล้ว`);
                }
            });
        }
    })
}

/**
 * 
 * @param {ButtonInteraction} interaction 
 */
function confirmSlip(interaction) {
    let member_id = interaction.customId.split("_")[2];
    let amount = interaction.customId.split("_")[3];
    sql.get(`SELECT * FROM members WHERE member_id = '${member_id}'`, (err, res) => {
        if (err) {
            console.log(err)
            errorReply(interaction, "เกิดข้อผิดพลาดบางอย่าง ขณะกำลังตรวจสอบข้อมูล");
        } else {
            if (res) {
                sql.run(`UPDATE members SET money = ${res.money + parseInt(amount)}, total = ${res.total + parseInt(amount)} WHERE member_id = '${member_id}'`, (err) => {
                    if (err) {
                        console.log(err)
                        errorReply(interaction, "เกิดข้อผิดพลาดบางอย่าง ขณะกำลังอัพเดทข้อมูล");
                    } else {
                        sendMessageToMember(member_id, amount);
                        successReply(interaction, "อัพเดทข้อมูลเรียบร้อยแล้ว");
                        hideButton(interaction);
                    }
                })
            } else {
                sql.run(`INSERT INTO members (member_id, money, total) VALUES ('${member_id}', ${amount}, ${amount})`, (err) => {
                    if (err) {
                        console.log(err)
                        errorReply(interaction, "เกิดข้อผิดพลาดบางอย่าง ขณะกำลังเพิ่มข้อมูล");
                    } else {
                        sendMessageToMember(member_id, amount);
                        successReply(interaction, "เพิ่มข้อมูลเรียบร้อยแล้ว");
                        hideButton(interaction);
                    }
                })
            }
        }
    })
    /**
     * 
     * @param {ButtonInteraction} interaction 
     */
    function hideButton(interaction) {
        let newEmbeds = new EmbedBuilder(interaction.message.embeds[0]).setColor("#D7FFA9").setAuthor({
            name: "ได้รับการยืนยันแล้ว",
        })
        interaction.message.edit({
            components: [],
            embeds: [newEmbeds]
        }).catch(() => { })
    }

    /**
     * @param {string} member_id
     * @param {number} amount
     */
    function sendMessageToMember(member_id, amount) {
        client.users.fetch(member_id).then(user => {
            if (user) {
                let embeds = new EmbedBuilder()
                    .setAuthor({
                        name: "ยืนยันการเติมPoint",
                        iconURL: user.avatarURL() ?? null
                    }).setColor("#D7FFA9")
                    .setDescription(`รายการเติมPointของคุณได้รับการยืนยันแล้วคุณจะได้รับPoint ${amount.toFixed(0)} Point เข้าในบัญชีของคุณ`)
                    .setThumbnail(user.avatarURL() ?? null)
                user.send({
                    embeds: [embeds]
                }).catch((e) => {
                    console.log(e)
                })
            } else {

            }
        }).catch(() => { })
    }
}

/**
 * @param {ButtonInteraction} interaction 
 */
function cancelSlip(interaction) {
    let member_id = interaction.customId.split("_")[2];

    client.users.fetch(member_id).then(user => {
        if (user) {
            let embeds = new EmbedBuilder()
                .setAuthor({
                    name: "ยกเลิกการเติมPoint",
                    iconURL: user.avatarURL() ?? null
                }).setColor("#FFA9A9")
                .setDescription(`รายการเติมPointของคุณถูก ปฏิเสธ โปรดตรวจสอบข้อมูลและส่งใหม่อีกครั้ง`)
                .setThumbnail(user.avatarURL() ?? null)
            user.send({
                embeds: [embeds]
            }).catch(() => { })
        }
    }).catch(() => { })

    let newEmbeds = new EmbedBuilder(interaction.message.embeds[0]).setColor("#FFA9A9").setAuthor({
        name: "ได้รับการยกเลิกแล้ว",
    })

    interaction.message.edit({
        components: [],
        embeds: [newEmbeds]
    }).catch(() => { })
}
/**
 * @param {ButtonInteraction} interaction 
 */
function marketStart(interaction) {
    /**
     * @type {TextChannel}
     */
    let channel = interaction.guild.channels.cache.get(interaction.channelId);
    channel.threads.create({
        name: `กล่องสุ่มของ ${interaction.user.username}`,
        invitable: true,
        type: ChannelType.PrivateThread
    }).catch((e) => {
        console.log(e)
        errorReply(interaction, "ไม่สามารถสร้างห้องได้ โปรดตรวจสอบสิทธิ์ของบอท")
    }).then((channel) => {
        if (channel)
            channel.members.add(interaction.user).catch(() => {
                errorReply(interaction, "ไม่สามารถเพิ่มสมาชิกเข้าห้องได้โปรดแจ้งผู้ดูแล ตรวจสอบสิทธิ์ของบอท")
            }).then(() => {
                let gacha_start = EditJsonFile(`./config/gacha_start.json`);
                let embeds_json = gacha_start.get();
                let embeds = new EmbedBuilder(embeds_json)
                if (embeds) {
                    let gachaBOx = new ActionRowBuilder()
                        .setComponents(
                            new ButtonBuilder()
                                .setCustomId("gacha_1")
                                .setLabel("สุ่ม 1 กล่อง")
                                .setStyle(ButtonStyle.Primary)
                                .setEmoji("🎁"),

                            new ButtonBuilder()
                                .setCustomId("gacha_5")
                                .setLabel("สุ่ม 5 กล่อง")
                                .setStyle(ButtonStyle.Primary)
                                .setEmoji("🎁"),

                            new ButtonBuilder()
                                .setCustomId("gacha_10")
                                .setLabel("สุ่ม 10 กล่อง")
                                .setStyle(ButtonStyle.Primary)
                                .setEmoji("🎁"),

                            new ButtonBuilder()
                                .setCustomId("member_check_data")
                                .setLabel("ตรวจสอบข้อมูล")
                                .setStyle(ButtonStyle.Primary)
                                .setEmoji("📊"),

                            new ButtonBuilder()
                                .setCustomId("get_reward")
                                .setLabel("พร้อมรับของ")
                                .setStyle(ButtonStyle.Success)
                                .setEmoji("🎁"),
                        )
                    channel.send({
                        content: `<@${interaction.user.id}>`,
                        embeds: [embeds],
                        components: [gachaBOx]
                    }).catch((e) => {
                        console.log(e)
                        errorReply(interaction, "ไม่สามารถส่งข้อความได้ โปรดตรวจสอบสิทธิ์ของบอท")
                    }).then(() => {
                        successReply(interaction, `สร้างห้องสำหรับสุ่มของเสร็จแล้วชื่อห้อง ${channel.name}`)
                    })
                } else {
                    errorReply(interaction, "ไม่สามารถสร้างกล่องสุ่มได้ โปรดติดต่อผู้ดูแลระบบ")
                }
            })
    })
}

/**
 * @param {ButtonInteraction} interaction 
 */
function coinsmarketStart(interaction) {
    /**
     * @type {TextChannel}
     */
    let channel = interaction.guild.channels.cache.get(interaction.channelId);
    channel.threads.create({
        name: `กล่องสุ่มของ ${interaction.user.username}`,
        invitable: true,
        type: ChannelType.PrivateThread
    }).catch((e) => {
        console.log(e)
        errorReply(interaction, "ไม่สามารถสร้างห้องได้ โปรดตรวจสอบสิทธิ์ของบอท")
    }).then((channel) => {
        if (channel)
            channel.members.add(interaction.user).catch(() => {
                errorReply(interaction, "ไม่สามารถเพิ่มสมาชิกเข้าห้องได้โปรดแจ้งผู้ดูแล ตรวจสอบสิทธิ์ของบอท")
            }).then(() => {
                let gacha_start = EditJsonFile(`./config/gacha_start.json`);
                let embeds_json = gacha_start.get();
                let embeds = new EmbedBuilder(embeds_json)
                if (embeds) {
                    let gachaBOx = new ActionRowBuilder()
                        .setComponents(
                            new ButtonBuilder()
                                .setCustomId("coins_gacha_1")
                                .setLabel("สุ่ม 1 กล่อง")
                                .setStyle(ButtonStyle.Primary)
                                .setEmoji("🎁"),

                            new ButtonBuilder()
                                .setCustomId("coins_gacha_5")
                                .setLabel("สุ่ม 5 กล่อง")
                                .setStyle(ButtonStyle.Primary)
                                .setEmoji("🎁"),

                            new ButtonBuilder()
                                .setCustomId("coins_gacha_10")
                                .setLabel("สุ่ม 10 กล่อง")
                                .setStyle(ButtonStyle.Primary)
                                .setEmoji("🎁"),

                            new ButtonBuilder()
                                .setCustomId("coins-member_check_data")
                                .setLabel("ตรวจสอบข้อมูล")
                                .setStyle(ButtonStyle.Primary)
                                .setEmoji("📊"),

                            new ButtonBuilder()
                                .setCustomId("get_reward")
                                .setLabel("พร้อมรับของ")
                                .setStyle(ButtonStyle.Success)
                                .setEmoji("🎁"),
                        )
                    channel.send({
                        content: `<@${interaction.user.id}>`,
                        embeds: [embeds],
                        components: [gachaBOx]
                    }).catch((e) => {
                        console.log(e)
                        errorReply(interaction, "ไม่สามารถส่งข้อความได้ โปรดตรวจสอบสิทธิ์ของบอท")
                    }).then(() => {
                        successReply(interaction, `สร้างห้องสำหรับสุ่มของเสร็จแล้วชื่อห้อง ${channel.name}`)
                    })
                } else {
                    errorReply(interaction, "ไม่สามารถสร้างกล่องสุ่มได้ โปรดติดต่อผู้ดูแลระบบ")
                }
            })
    })
}

/**
 * 
 * @param {ButtonInteraction} interaction 
 */
function gacha_1_random(interaction) {
    sql.get(`SELECT * FROM members WHERE member_id = '${interaction.member.id}'`, (err, member) => {
        if (err) {
            console.log(err)
            return errorReply(interaction, "เกิดข้อผิดพลาดบางอย่าง ขณะกำลังตรวจสอบข้อมูล");
        } else {
            if (member) {

                let gacha_set = {
                    gacha_1 : {
                        count : 1,
                        price : 10
                    },
                    gacha_5 : {
                        count : 5,
                        price : 50
                    },
                    gacha_10 : {
                        count : 10,
                        price : 100
                    }
                }

                let gachaset = gacha_set[interaction.customId]

                if (member.money >= gachaset.price) {
                    sql.run(`UPDATE members SET money = ${member.money - gachaset.price} WHERE member_id = '${interaction.member.id}'`, (err) => {
                        if (err) {
                            console.log(err)
                            return errorReply(interaction, "เกิดข้อผิดพลาดบางอย่าง ขณะกำลังอัพเดทข้อมูล");
                        } else {
                            sql.all(`SELECT * FROM gacha_items WHERE gacha_box_id = 1`, (err, res) => {
                                if (err) return errorReply(interaction, "เกิดข้อผิดพลาดบางอย่าง ขณะกำลังสุ่มของ");
                                if (res.length <= 0) return errorReply(interaction, "ไม่พบไอเทมในกล่องนี้");
                                /**
                                 * @typedef {Object} items_all
                                 * @property {number} id
                                 * @property {number} gacha_box_id
                                 * @property {number} item_id
                                 * @property {number} rate
                                 */

                                /**
                                 * @type {Array<items_all>}
                                 */
                                let items_all = res;
                                const randomlySelectedItem = getRandomItemsWithRate(items_all, gachaset.count);
                                if (randomlySelectedItem) {
                                    randomlySelectedItem.forEach((item) => {
                                        sql.get(`SELECT * FROM items WHERE id = ${item.item_id}`, (err, res) => {
                                            if (err) {

                                            } else {
                                                if (res) {
                                                    if(gachaset.count == 1){
                                                        gachaBox1(res, interaction)
                                                        gachaSaveList(interaction, [res])
                                                    }else{
                                                        if(gachaset.count == 5){
                                                            var gacha = gacha_5.get(`${interaction.user.id}`);
                                                            if(!gacha){
                                                                gacha_5.set(`${interaction.user.id}`, [res])
                                                            }else{
                                                                gacha.push(res)
                                                                gacha_5.set(`${interaction.user.id}`, gacha)
                                                                if(gacha.length == gachaset.count){
                                                                    gachaBox5(gacha, interaction)
                                                                    gachaSaveList(interaction, gacha)
                                                                    gacha_5.delete(`${interaction.user.id}`)
                                                                }
                                                            }
                                                        }
                                                        if(gachaset.count == 10){
                                                            var gacha = gacha_10.get(`${interaction.user.id}`);
                                                            if(!gacha){
                                                                gacha_10.set(`${interaction.user.id}`, [res])
                                                            }else{
                                                                gacha.push(res)
                                                                gacha_10.set(`${interaction.user.id}`, gacha)
                                                                if(gacha.length == gachaset.count){
                                                                    gachaBox10(gacha, interaction)
                                                                    gachaSaveList(interaction, gacha)
                                                                    gacha_10.delete(`${interaction.user.id}`)
                                                                }
                                                            }
                                                        }

                                                    }
                                                }
                                            }
                                        })
                                    })
                                } else {
                                    errorReply(interaction, "เสียใจด้วย คุณไม่ได้รับไอเทมใดๆ")
                                }
                            })
                        }
                    })
                } else {
                    return errorReply(interaction, "Point ของคุณไม่เพียงพอ กรุณาเติมPoint");
                }
            } else {
                return errorReply(interaction, "Point ของคุณไม่เพียงพอ กรุณาเติมPoint");
            }
        }
    })
}

/**
 * 
 * @param {ButtonInteraction} interaction 
 */
function gacha_2_random(interaction) {
    sql.get(`SELECT * FROM members WHERE member_id = '${interaction.member.id}'`, (err, member) => {
        if (err) {
            console.log(err)
            return errorReply(interaction, "เกิดข้อผิดพลาดบางอย่าง ขณะกำลังตรวจสอบข้อมูล");
        } else {
            if (member) {
                let gacha_set = {
                    coins_gacha_1 : {
                        count : 1,
                        price : 10
                    },
                    coins_gacha_5 : {
                        count : 5,
                        price : 50
                    },
                    coins_gacha_10 : {
                        count : 10,
                        price : 100
                    }
                }

                let gachaset = gacha_set[interaction.customId]

                if (member.coins >= gachaset.price) {
                    sql.run(`UPDATE members SET coins = ${member.money - gachaset.price} WHERE member_id = '${interaction.member.id}'`, (err) => {
                        if (err) {
                            console.log(err)
                            return errorReply(interaction, "เกิดข้อผิดพลาดบางอย่าง ขณะกำลังอัพเดทข้อมูล");
                        } else {
                            sql.all(`SELECT * FROM gacha_items WHERE gacha_box_id = 2`, (err, res) => {
                                if (err) return errorReply(interaction, "เกิดข้อผิดพลาดบางอย่าง ขณะกำลังสุ่มของ");
                                if (res.length <= 0) return errorReply(interaction, "ไม่พบไอเทมในกล่องนี้");
                                /**
                                 * @typedef {Object} items_all
                                 * @property {number} id
                                 * @property {number} gacha_box_id
                                 * @property {number} item_id
                                 * @property {number} rate
                                 */

                                /**
                                 * @type {Array<items_all>}
                                 */
                                let items_all = res;
                                const randomlySelectedItem = getRandomItemsWithRate(items_all, gachaset.count);
                                if (randomlySelectedItem) {
                                    randomlySelectedItem.forEach((item) => {
                                        sql.get(`SELECT * FROM items WHERE id = ${item.item_id}`, (err, res) => {
                                            if (err) {
                                                console.log(err);
                                                errorReply(interaction, "เกิดข้อผิดพลาดบางอย่าง ขณะกำลังสุ่มของ");
                                            } else {
                                                if (res) {
                                                    if(gachaset.count == 1){
                                                        gachaBox1(res, interaction)
                                                        gachaSaveList(interaction, [res])
                                                    }else{
                                                        if(gachaset.count == 5){
                                                            var gacha = gacha_5.get(`${interaction.user.id}`);
                                                            if(!gacha){
                                                                gacha_5.set(`${interaction.user.id}`, [res])
                                                            }else{
                                                                gacha.push(res)
                                                                gacha_5.set(`${interaction.user.id}`, gacha)
                                                                if(gacha.length == gachaset.count){
                                                                    gachaBox5(gacha, interaction)
                                                                    gachaSaveList(interaction, gacha)
                                                                    gacha_5.delete(`${interaction.user.id}`)
                                                                }
                                                            }
                                                        }
                                                        if(gachaset.count == 10){
                                                            var gacha = gacha_10.get(`${interaction.user.id}`);
                                                            if(!gacha){
                                                                gacha_10.set(`${interaction.user.id}`, [res])
                                                            }else{
                                                                gacha.push(res)
                                                                gacha_10.set(`${interaction.user.id}`, gacha)
                                                                if(gacha.length == gachaset.count){
                                                                    gachaBox10(gacha, interaction)
                                                                    gachaSaveList(interaction, gacha)
                                                                    gacha_10.delete(`${interaction.user.id}`)
                                                                }
                                                            }
                                                        }

                                                    }
                                                }
                                            }
                                        })
                                    })
                                } else {
                                    errorReply(interaction, "เสียใจด้วย คุณไม่ได้รับไอเทมใดๆ")
                                }
                            })
                        }
                    })
                } else {
                    return errorReply(interaction, "Coins ของคุณไม่เพียงพอ");
                }
            } else {
                return errorReply(interaction, "Coins ของคุณไม่เพียงพอ");
            }
        }
    })
}

function getRandomItemWithRate(items_all) {
    const totalRate = items_all.reduce((total, item) => total + item.rate, 0);
    const randomNum = Math.random() * totalRate;
    let runningTotal = 0;
    for (const item of items_all) {
        runningTotal += item.rate;
        if (randomNum <= runningTotal) {
            return item;
        }
    }
    return null;
}

function getRandomItemsWithRate(items_all, numItems) {
    const randomItems = [];
    for (let i = 0; i < numItems; i++) {
        const randomItem = getRandomItemWithRate(items_all);
        randomItems.push(randomItem);
    }
    return randomItems;
}

/**
 * @typedef {Object} items_all
 * @property {number} id
 * @property {number} gacha_box_id
 * @property {number} item_id
 * @property {number} rate
 */

/**
 * 
 * @param {ButtonInteraction} interaction 
 * @param {Array<items_all>} items 
 */
function gachaSaveList(interaction, items) {
    let timeOut = 100;
    items.forEach(items => {
        setTimeout(() => {
            sql.get(`SELECT * FROM reward WHERE member_id = '${interaction.member.id}'`, (err, res) => {
                if (err) return errorReply(interaction, "เกิดข้อผิดพลาดบางอย่าง ขณะกำลังตรวจสอบข้อมูล");
                if (res) {
                    sql.run(`UPDATE reward SET items_list = '${res.items_list}, ${items.id}' WHERE member_id = '${interaction.member.id}'`, (err) => {
                        if (err) return errorReply(interaction, "เกิดข้อผิดพลาดบางอย่าง ขณะกำลังอัพเดทข้อมูล");
                    })
                } else {
                    sql.run(`INSERT INTO reward (member_id, items_list) VALUES ('${interaction.member.id}', '${items.id}')`, (err) => {
                        if (err) return errorReply(interaction, "เกิดข้อผิดพลาดบางอย่าง ขณะกำลังเพิ่มข้อมูล");
                    })
                }
            })
        }, timeOut);
        timeOut += 100;
    })
}

/**
 * 
 * @param {ButtonInteraction} interaction 
 */
function getReward(interaction) {
    /**
     * @type {ThreadChannel}
     */
    let channel = interaction.channel;
    channel.members.remove(interaction.user.id).catch((e) => {
        console.log(e)
        errorReply(interaction, "ไม่สามารถนำคุณออกจากระบบได้โปรดแจ้งผู้ดูแล ตรวจสอบสิทธิ์ของบอท")
    }).then(() => {
        sql.get(`SELECT * FROM reward WHERE member_id = '${interaction.member.id}'`, async (err, res) => {
            if (err) {
                console.log(err)
                errorReply(interaction, "เกิดข้อผิดพลาดบางอย่าง ขณะกำลังตรวจสอบข้อมูล")
            } else {
                if (res) {
                    if (!res.items_list) {
                        channel.delete().catch(() => {
                            errorReply(interaction, "ไม่สามารถลบห้องได้โปรดแจ้งผู้ดูแล ตรวจสอบสิทธิ์ของบอท")
                        })
                    } else {
                        let text = "";
                        /**
                         * @type {Array<string>}
                         */
                        let rewards = res.items_list.split(",");
                        for (let i = 0; i < rewards.length; i++) {
                            let item = await getItems(rewards[i]);
                            if (item) {
                                text += `${item.command}\n`
                            }
                        }

                        let path = `./gacha_list/${interaction.member.id}.txt`;
                        fs.writeFile(path, text, (err) => {
                            if (err) {
                                console.log(err)
                                errorReply(interaction, "เกิดข้อผิดพลาดบางอย่าง ขณะกำลังบันทึกข้อมูล")
                            } else {
                                let file = path;
                                channel.send({
                                    files: [file]
                                }).then(() => {
                                    interaction.deferUpdate().catch(() => { })
                                    fs.unlinkSync(file);
                                    sql.run(`DELETE FROM reward WHERE member_id = '${interaction.member.id}'`, (err) => { })
                                }).catch(() => {
                                    interaction.deferUpdate().catch(() => { })
                                })
                            }
                        })
                    }
                } else {
                    channel.delete().catch(() => {
                        errorReply(interaction, "ไม่สามารถลบห้องได้โปรดแจ้งผู้ดูแล ตรวจสอบสิทธิ์ของบอท")
                    })
                }
            }
        })
    })
}



/**
 * @typedef {Object} RewardItem
 * @property {number} id
 * @property {string} name
 * @property {string} url
 * @property {string} description
 * @property {string} command
 */

/**
 * 
 * @param {String} item_id 
 * @returns  {Promise<RewardItem>}
 */
function getItems(item_id) {
    return new Promise((resolve, reject) => {
        sql.get(`SELECT * FROM items WHERE id = ${item_id}`, (err, res) => {
            if (err) reject(err);
            if (res) resolve(res);
        })
    })
}

/**
             * 
             * @param {ModalSubmitInteraction} interaction 
             */
function subModal(interaction) {
    let vip_type = {
        vip_1: {
            name: "VIP Silver",
            price: 69,
            date: 3,
            role_id: "1155059226931114054"
        },
        vip_2: {
            name: "VIP Gold",
            price: 150,
            date: 15,
            role_id: "1155059263866155008"
        },
        vip_3: {
            name: "VIP Platinum",
            price: 300,
            date: 30,
            role_id: "1155059289992478771"
        }
    }

    let stream_id = interaction.fields.getTextInputValue("strem_id");
    let role = interaction.guild.roles.cache.get(vip_type[interaction.customId].role_id);
    let price = vip_type[interaction.customId].price;
    let date = vip_type[interaction.customId].date;
    sql.get(`SELECT * FROM vip WHERE member_id = '${interaction.user.id}'`, (err, row) => {
        if (err) {
            console.log(err)
            errorReply(interaction, "เกิดข้อผิดพลาดในระบบฐานข้อมูล โปรดลองอีกครั้ง")
        } else {
            if (row) {
                if (row.time_out > Date.now() / 1000) {
                    errorReply(interaction, "คุณต้องรอให้ VIP หมดก่อนถึงจะสามารถซื้อได้อีก")
                } else {
                    nextStep(true)
                }
            } else {
                nextStep(false)
            }
        }
        /**
         * 
         * @param {Boolean} check 
         */
        function nextStep(check) {
            sql.get(`SELECT * FROM members WHERE member_id = '${interaction.user.id}'`, (err, row) => {
                if (err) {
                    console.log(err)
                    errorReply(interaction, "เกิดข้อผิดพลาดในระบบฐานข้อมูล โปรดลองอีกครั้ง")
                } else {
                    if (row) {
                        if (row.money < price) {
                            errorReply(interaction, "คุณมีพ้อยไม่เพียงพอ โปรดเติมพ้อยก่อน")
                        } else {
                            sql.run(`UPDATE members SET money = money - ${price} WHERE member_id = '${interaction.user.id}'`, (err) => {
                                if (err) {
                                    console.log(err)
                                    errorReply(interaction, "เกิดข้อผิดพลาดในระบบฐานข้อมูล โปรดลองอีกครั้ง")
                                } else {
                                    interaction.member.roles.add(role).then(() => {
                                        let newTime = (Date.now() / 1000 + (date * 86400)).toFixed(0)
                                        let next_alert = (Date.now() / 1000 + ((date - 1) * 86400)).toFixed(0)
                                        if (check == true) {
                                            sql.run(`UPDATE vip SET time_out = ${newTime}, role_id = '${role.id}', next_alert = ${next_alert} WHERE member_id = '${interaction.user.id}'`, (err) => {
                                                if (err) {
                                                    console.log(err)
                                                    errorReply(interaction, "เกิดข้อผิดพลาดในระบบฐานข้อมูล โปรดลองอีกครั้ง")
                                                } else {
                                                    sendMember(newTime)
                                                    sendAdminChannel(newTime)
                                                    successReply(interaction, `คุณได้รับ ${vip_type[interaction.customId].name} แล้ว`)
                                                }
                                            })
                                        } else {
                                            sql.run(`INSERT INTO vip (member_id, role_id, time_out, next_alert) VALUES ('${interaction.user.id}', '${role.id}', ${newTime}, ${next_alert})`, (err) => {
                                                if (err) {
                                                    console.log(err)
                                                    errorReply(interaction, "เกิดข้อผิดพลาดในระบบฐานข้อมูล โปรดลองอีกครั้ง")
                                                } else {
                                                    sendMember(newTime)
                                                    sendAdminChannel(newTime)
                                                    successReply(interaction, `คุณได้รับ ${vip_type[interaction.customId].name} แล้ว`)
                                                }
                                            })
                                        }

                                        function sendMember(newTime) {
                                            interaction.user.send({
                                                content: `คุณได้ทำการซื้อยศ ${vip_type[interaction.customId].name} | หมดอายุ <t:${newTime}:R> วัน จำนวน ${price} พ้อย`,
                                            }).catch(() => { })
                                        }

                                        function sendAdminChannel(newTime) {
                                            let channel = interaction.guild.channels.cache.get("1155074915624554517");
                                            if (channel) {
                                                channel.send({
                                                    content: `คุณ ${interaction.user.tag} ไอดีสตรีม : ${stream_id} \nได้ทำการซื้อยศ ${vip_type[interaction.customId].name} | หมดอายุ <t:${newTime}:R> วัน จำนวน ${price} พ้อย`,
                                                }).catch(() => { })
                                            }
                                        }
                                    }).catch((e) => {
                                        console.log(e)
                                        errorReply(interaction, "เกิดข้อผิดพลาดในการเพิ่มบทบาท โปรดลองอีกครั้ง")
                                        sql.run(`UPDATE members SET money = money + ${price} WHERE member_id = '${interaction.user.id}'`, (err) => {
                                            if (err) console.log(err)
                                        })
                                    })
                                }
                            })
                        }
                    } else {
                        errorReply(interaction, "คุณมีพ้อยไม่เพียงพอ โปรดเติมพ้อยก่อน")
                    }
                }
            })
        }
    })
}
/**
            * 
            * @param {ButtonInteraction} interaction 
            */
function sub(interaction) {
    let vip_type = {
        vip_1: {
            name: "VIP Silver",
            price: 69,
            date: 3,
            role_id: "1155059226931114054"
        },
        vip_2: {
            name: "VIP Gold",
            price: 150,
            date: 15,
            role_id: "1155059263866155008"
        },
        vip_3: {
            name: "VIP Platinum",
            price: 300,
            date: 30,
            role_id: "1155059289992478771"
        }
    }

    let modal = new ModalBuilder()
        .setComponents(
            new ActionRowBuilder()
                .setComponents(
                    new TextInputBuilder()
                        .setCustomId("strem_id")
                        .setPlaceholder("กรอกไอดีสตรีม")
                        .setRequired(true)
                        .setLabel("ไอดีสตรีม")
                        .setMinLength(3)
                        .setMaxLength(50)
                        .setStyle(TextInputStyle.Short)
                )
        ).setTitle(`${vip_type[interaction.customId].name}`)
        .setCustomId(`${interaction.customId}`)

    interaction.showModal(modal).then(() => { }).catch((e) => {
        console.log(e)
        errorReply(interaction, "ไม่สามารถส่งข้อความได้ โปรดตรวจสอบสิทธิ์ของบอท หรือข้อผิดพลาดผ่าน console")
    })
}
/**
 * 
 * @param {ButtonInteraction} interaction 
 */
function checkVIP(interaction) {
    sql.get(`SELECT * FROM vip WHERE member_id = '${interaction.user.id}'`, (err, row) => {
        if (err) {
            console.log(err)
            errorReply(interaction, "เกิดข้อผิดพลาดในระบบฐานข้อมูล โปรดลองอีกครั้ง")
        } else {
            if (row) {
                let embeds = new EmbedBuilder()
                    .setAuthor({
                        name: "ระบบ VIP",
                        iconURL: interaction.user.avatarURL() ?? null
                    }).setFields(
                        {
                            name: "บทบาท",
                            value: `<@&${row.role_id}>`,
                            inline: true
                        }, {
                        name: "หมดอายุ",
                        value: `<t:${row.time_out}:R>`,
                        inline: true
                    }
                    ).setThumbnail(interaction.user.avatarURL() ?? null)

                interaction.reply({
                    embeds: [embeds],
                    ephemeral: true
                }).then(() => { }).catch(() => {
                    errorReply(interaction, "ไม่สามารถส่งข้อความได้ โปรดตรวจสอบสิทธิ์ของบอท")
                })
            } else {
                successReply(interaction, "คุณไม่ได้สมัคร VIP")
            }
        }
    })
}

module.exports = {
    checkMoney,
    setMoney,
    updateItemModal,
    insertItemSql,
    updateItemSql,
    deleteItemSql,
    deleteGachaSql,
    createItemSql,
    confirmSlip,
    cancelSlip,
    marketStart,
    gacha_1_random,
    getReward,
    gacha_2_random,
    subModal,
    sub,
    checkVIP,
    checkCoins,
    setCoins,
    coinsmarketStart
}
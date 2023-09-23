const { createCanvas, loadImage } = require('canvas');
const { ButtonInteraction, EmbedBuilder, Attachment, AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const client = require('.');
const { errorReply } = require('./handlers/reply');
const gacha = require('./config/gacha_box.json')
let borderImage = {
    "Rare": "https://media.discordapp.net/attachments/855643137716650015/1155047168353255434/381369572_1016843906316362_2885958425120432508_n.png",
    "Uncommon": "https://media.discordapp.net/attachments/855643137716650015/1155047167979954227/382251303_6613330338745418_513080525294979237_n.png",
    "Common": "https://media.discordapp.net/attachments/855643137716650015/1155047167677956106/381348729_2127378747653733_8608604335580708097_n.png"
}


/**
 * @typedef {Object} Item
 * @property {string} name
 * @property {string} url
 * @property {string} description
 */

/**
 * @param {Item} items_all 
 * @param {ButtonInteraction} interaction
 */
async function gachaBox1(items_all, interaction) {
    let BorderPicture = await loadImage(borderImage[items_all.description])

    const canvasWidth = 300;
    const canvasHeight = 300;
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    const background = await loadImage(gacha.gacha_1);
    ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight);

    const imageWidth = 260;
    const imageHeight = 260;
    const imageX = 20;
    const imageY = 20;
    loadImage(items_all.url).then((image) => {
        ctx.drawImage(image, imageX, imageY, imageWidth, imageHeight);


        const frameWidth = 270;
        const frameHeight = 270;
        const frameX = imageX - 5;
        const frameY = imageY - 5;
        ctx.drawImage(BorderPicture, frameX, frameY, frameWidth, frameHeight);

        // บันทึกรูปภาพ
        const out = fs.createWriteStream(__dirname + '/image/gacha1.png');
        const stream = canvas.createPNGStream();
        stream.pipe(out);
        out.on('finish', () => {
            let data = fs.readFileSync(__dirname + '/image/gacha1.png');
            let attachment = new AttachmentBuilder(data, 'gacha1.png');
            client.channels.fetch(gacha.channel_id).then((channel) => {
                if(channel){
                    channel.send({
                        files: [attachment]
                    }).then((message) => {
                        if(message){
                            let url = message.attachments.first().url;
                            let embeds = new EmbedBuilder().setAuthor({
                                name : "Gacha Box | ของรางวัล",
                                icon_url : interaction.user.avatarURL()
                            }).setImage(url)
                            .setColor("#FFD441").setFooter({
                                text : "GachaBox"
                            })
                            .setDescription("```yml\n1. "+items_all.name+" ("+items_all.description+")\n```".replace(/,/g, ""))
                            .setTimestamp();

                            interaction.reply({
                                embeds : [embeds],
                                components : interaction.message.components
                            }).catch((e) => {
                                console.log(e)
                                errorReply(interaction, "ไม่สามารถส่งข้อความได้ กรุณาลองใหม่อีกครั้ง")
                            })
                        }
                    }).catch((e) => {
                        console.log(e)
                        errorReply(interaction, "ไม่สามารถส่งข้อความได้ กรุณาลองใหม่อีกครั้ง")
                    })
                }
            })  
        });
    });
}

/**
 * @param {Array<Item>} items_all 
 * @param {ButtonInteraction} interaction
 */
async function gachaBox5(items_all, interaction) {
    const canvasWidth = 1600;
    const canvasHeight = 300;
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');
    const frameWidth = canvasWidth / 5 - 20;
    const frameHeight = canvasHeight - 20;
    const background = await loadImage(gacha.gacha_2);
    ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight);
    let timeOut = 0;
    items_all.forEach((item, index) => {
        setTimeout(async() => {
            const frameX = index * (frameWidth + 20);
            let imageBorder = await loadImage(borderImage[item.description])

            loadImage(item.url).then((image) => {
                const imageWidth = frameWidth - 20;
                const imageHeight = frameHeight - 20;
                const imageX = frameX + 10;
                const imageY = 10 + 10; 
                ctx.drawImage(image, imageX, imageY, imageWidth, imageHeight);
                ctx.drawImage(imageBorder, frameX, 0, frameWidth, frameHeight);

                if (index === items_all.length - 1) {
                    const out = fs.createWriteStream(__dirname + '/image/gacha2.png');
                    const stream = canvas.createPNGStream();
                    stream.pipe(out);
                    out.on('finish', () => {
                        let data = fs.readFileSync(__dirname + '/image/gacha2.png');
                        let attachment = new AttachmentBuilder(data, 'gacha2.png');
                        client.channels.fetch(gacha.channel_id).then((channel) => {
                            if(channel){
                                channel.send({
                                    files: [attachment]
                                }).then((message) => {
                                    if(message){
                                        let url = message.attachments.first().url;
                                        let formattedItems = ""
                                        items_all.forEach((item, index) => {
                                            formattedItems += `${index + 1}. ${item.name} (${item.description})\n`.replace(/,/g, ' ')
                                        });
                                        let embeds = new EmbedBuilder().setAuthor({
                                            name : "Gacha Box | ของรางวัล",
                                            icon_url : interaction.user.avatarURL()
                                        }).setImage(url)
                                        .setColor("#FFD441").setFooter({
                                            text : "GachaBox"
                                        })
                                        .setDescription("```yml\n"+formattedItems+"\n```")

                                        interaction.channel.send({
                                            embeds : [embeds],
                                            components : interaction.message.components
                                        }).catch((e) => {
                                            console.log(e)
                                            errorReply(interaction, "ไม่สามารถส่งข้อความได้ กรุณาลองใหม่อีกครั้ง")
                                        }).then(() => {
                                            interaction.deferUpdate().catch(() => {})
                                        })
                                    }
                                }).catch((e) => {
                                    console.log(e)
                                    errorReply(interaction, "ไม่สามารถส่งข้อความได้ กรุณาลองใหม่อีกครั้ง")
                                })
                            }
                        })  
                    });
                }
            });
        }, timeOut);

        timeOut += 300;
    });
}
/**
 * @param {Array<Item>} items_all 
 * @param {ButtonInteraction} interaction
 */
async function gachaBox10(items_all, interaction) {
    const canvasWidth = 2400;
    const canvasHeight = 840;
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');
    const frameWidth = canvasWidth / 5 - 20;
    const frameHeight = canvasHeight / 2 - 20;
    const background = await loadImage(gacha.gacha_3);
    ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight);
    let timeOut = 0;
    items_all.forEach((item, index) => {
        setTimeout(async() => {
            if (index < 5) {
                const frameX = index * (frameWidth + 20);
                const frameY = index < 5 ? 10 : 10 + frameHeight + 20;

                let imageBorder = await loadImage(borderImage[item.description])
                let image = await loadImage(item.url);
                const imageWidth = frameWidth - 20;
                const imageHeight = frameHeight - 20;
                const imageX = frameX + 10;
                const imageY = frameY + 10; 
                ctx.drawImage(image, imageX, imageY, imageWidth, imageHeight);
                ctx.drawImage(imageBorder, frameX, frameY, frameWidth, frameHeight);
            } else {
                const frameX = (index - 5) * (frameWidth + 20);
                const frameY = 10 + frameHeight + 20;
                let imageBorder = await loadImage(borderImage[item.description])
                let image = await loadImage(item.url);
                const imageWidth = frameWidth - 20;
                const imageHeight = frameHeight - 20;
                const imageX = frameX + 10;
                const imageY = frameY + 10; 
                ctx.drawImage(image, imageX, imageY, imageWidth, imageHeight);
                ctx.drawImage(imageBorder, frameX, frameY, frameWidth, frameHeight);
                const text = item.name;
                ctx.font = '16px Arial';
                const textWidth = ctx.measureText(text).width;
                const textX = frameX + (frameWidth - textWidth) / 2;
                const textY = frameY + frameHeight - 20;
                ctx.fillStyle = 'white';
                ctx.fillText(text, textX, textY);
                if (index === items_all.length - 1) {
                    const out = fs.createWriteStream(__dirname + '/image/gacha3.png');
                    const stream = canvas.createPNGStream();
                    stream.pipe(out);
                    out.on('finish', () => {
                        let data = fs.readFileSync(__dirname + '/image/gacha3.png');
                        let attachment = new AttachmentBuilder(data, 'gacha3.png');
                        client.channels.fetch(gacha.channel_id).then((channel) => {
                            if(channel){
                                channel.send({
                                    files: [attachment]
                                }).then((message) => {
                                    if(message){
                                        let url = message.attachments.first().url;
                                        let formattedItems = ""
                                        items_all.forEach((item, index) => {
                                            formattedItems += `${index + 1}. ${item.name} (${item.description})\n`.replace(/,/g, ' ')
                                        });
                                        
                                        let embeds = new EmbedBuilder().setAuthor({
                                            name : "Gacha Box | ของรางวัล",
                                            icon_url : interaction.user.avatarURL()
                                        }).setImage(url)
                                        .setColor("#FFD441").setFooter({
                                            text : "GachaBox"
                                        })
                                        .setDescription("```yml\n"+formattedItems+"\n```")
                                        interaction.channel.send({
                                            embeds : [embeds],
                                            components : interaction.message.components
                                        }).catch(() => {
                                            errorReply(interaction, "ไม่สามารถส่งข้อความได้ แต่ของรางวัลอยู่ในกล่องของขวัญแล้ว")
                                        }).then(() => {
                                            interaction.deferUpdate().catch(() => {})
                                        })
                                    }
                                }).catch((e) => {
                                    console.log(e)
                                    errorReply(interaction, "ไม่สามารถส่งข้อความได้ กรุณาลองใหม่อีกครั้ง")
                                })
                            }
                        })
                    });
                }
            }
        }, timeOut);
        timeOut += 300;
    });
}

module.exports = {
    gachaBox1,
    gachaBox5,
    gachaBox10
}

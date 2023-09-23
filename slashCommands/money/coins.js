const { ApplicationCommandType, ApplicationCommandOptionType, CommandInteraction } = require("discord.js");
const { errorReply } = require("../../handlers/reply");
const { checkCoins, setCoins } = require("../../function");

module.exports = {
    name : "coins",
    description : "ตรวจสอบ Coins หรือ ตั้งค่า Coins",
    type : ApplicationCommandType.ChatInput,
    options : [
        {
            name : "check",
            description : "ตรวจสอบ Coins",
            type : ApplicationCommandOptionType.Subcommand,
            options : [
                {
                    name : "user",
                    description : "ผู้ใช้",
                    type : ApplicationCommandOptionType.User,
                    required : false
                }
            ]
        },
        {
            name : "set",
            description : "ตั้งค่า Coins",
            type : ApplicationCommandOptionType.Subcommand,
            options : [
                {
                    name : "user",
                    description : "ผู้ใช้",
                    type : ApplicationCommandOptionType.User,
                    required : true
                },
                {
                    name : "amount",
                    description : "จำนวน Coins",
                    type : ApplicationCommandOptionType.Integer,
                    required : true
                }
            ]
        },{
            name : "add",
            description : "เพิ่ม Coins",
            type : ApplicationCommandOptionType.Subcommand,
            options : [
                {
                    name : "user",
                    description : "ผู้ใช้",
                    type : ApplicationCommandOptionType.User,
                    required : true
                },
                {
                    name : "amount",
                    description : "จำนวน Coins",
                    type : ApplicationCommandOptionType.Integer,
                    required : true
                }
            ]
        },{
            name : "remove",
            description : "ลบ Coins",
            type : ApplicationCommandOptionType.Subcommand,
            options : [
                {
                    name : "user",
                    description : "ผู้ใช้",
                    type : ApplicationCommandOptionType.User,
                    required : true
                },
                {
                    name : "amount",
                    description : "จำนวน Coins",
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
        let subcommand = interaction.options.data[0].name;
        if(subcommand != "check"){
            if(!interaction.memberPermissions.has("Administrator")) return errorReply(interaction, "คุณต้องมีสิทธิ์ผู้ดูแล เพื่อใช้คำสั่งนี้");
            let userMember = interaction.options.getUser("user");
            if(!userMember || userMember.bot) return errorReply(interaction, "ผู้ใช้นี้ไม่สามารถใช้ในการทำรายการได้โปรดเลือกสมาชิกอื่น");
            let amount = interaction.options.get("amount").value;
            if(subcommand == "set"){
                return setCoins(interaction, userMember.id, amount)
            }
            if(subcommand == "remove"){
                return setCoins(interaction, userMember.id, -amount)
            }
            if(subcommand == "add"){
                return setCoins(interaction, userMember.id, +amount)
            }
        }else{
            let user_id = interaction.options.getUser("user") ?? interaction.user;
            return checkCoins(interaction, user_id)
        }
    }
}
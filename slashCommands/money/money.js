const { ApplicationCommandType, ApplicationCommandOptionType, CommandInteraction } = require("discord.js");
const { errorReply } = require("../../handlers/reply");
const { checkMoney, setMoney } = require("../../function");

module.exports = {
    name : "money",
    description : "ตรวจสอบPoint หรือ ตั้งค่าPoint",
    type : ApplicationCommandType.ChatInput,
    options : [
        {
            name : "check",
            description : "ตรวจสอบPoint",
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
            description : "ตั้งค่าPoint",
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
                    description : "จำนวนPoint",
                    type : ApplicationCommandOptionType.Integer,
                    required : true
                }
            ]
        },{
            name : "add",
            description : "เพิ่มPoint",
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
                    description : "จำนวนPoint",
                    type : ApplicationCommandOptionType.Integer,
                    required : true
                }
            ]
        },{
            name : "remove",
            description : "ลบPoint",
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
                    description : "จำนวนPoint",
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
                return setMoney(interaction, userMember.id, amount)
            }
            if(subcommand == "remove"){
                return setMoney(interaction, userMember.id, -amount)
            }
            if(subcommand == "add"){
                return setMoney(interaction, userMember.id, +amount)
            }
        }else{
            let user_id = interaction.options.getUser("user") ?? interaction.user;
            return checkMoney(interaction, user_id)
        }
    }
}
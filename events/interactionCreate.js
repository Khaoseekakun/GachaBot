const client = require("..");
const { slashCommands } = require("..");
const { checkVIP, updateItemSql, updateItemModal, deleteItemSql, createItemSql, confirmSlip, cancelSlip, checkMoney, marketStart, gacha_1_random, gacha_2_random, getReward, subModal, sub, checkCoins, coinsmarketStart } = require("../function");
const { errorReply } = require("../handlers/reply");

client.on("interactionCreate", async(interaction) => {
    if(interaction.guild){
        if(interaction.isCommand()){
            let commnads = interaction.commandName;
            let cmd = slashCommands.get(commnads);
            if(cmd){
                interaction.member = interaction.guild.members.cache.get(interaction.user.id);
                try {
                    cmd.run(client, interaction)
                } catch (error) {
                    console.log(error)
                    errorReply(interaction, "เกิดข้อผิดพลาดบางอย่าง โปรดลองอีกครั้งภายหลัง")
                }
            }
        }
        if(interaction.isModalSubmit()){
            if(interaction.customId.includes("update_item_")){
                updateItemSql(interaction);
            }
            if(interaction.customId == "create_item"){
                createItemSql(interaction);
            }
            if(interaction.customId.includes("vip_")){
                subModal(interaction);
            }
        }
        if(interaction.isButton()){
            if(interaction.customId.includes("vip_")){
                sub(interaction);
            }
            if(interaction.customId.includes("update_item_")){
                updateItemModal(interaction);
            }
            if(interaction.customId.includes("delete_item_")){
                deleteItemSql(interaction);
            }
            if(interaction.customId.includes("delete_cacha_")){
                deleteGachaSql(interaction);
            }
            if(interaction.customId.includes("confirm_topup_")){
                confirmSlip(interaction);
            }
            if(interaction.customId.includes("cancel_topup_")){
                cancelSlip(interaction);
            }
            if(interaction.customId == "member_check_data"){
                checkMoney(interaction, interaction.user);
            }
            if(interaction.customId == "coins-member_check_data"){
                checkCoins(interaction, interaction.user);
            }
            if(interaction.customId == "market_start"){
                marketStart(interaction);
            }
            if(interaction.customId == "coins-market_start"){
                coinsmarketStart(interaction);
            }
            if(interaction.customId == "gacha_1"){
                gacha_1_random(interaction);
            }
            if(interaction.customId == "gacha_5"){
                gacha_1_random(interaction);
            }
            if(interaction.customId == "gacha_10"){
                gacha_1_random(interaction);
            }
            if(interaction.customId == "coins_gacha_1"){
                gacha_2_random(interaction);
            }
            if(interaction.customId == "coins_gacha_5"){
                gacha_2_random(interaction);
            }
            if(interaction.customId == "coins_gacha_10"){
                gacha_2_random(interaction);
            }
            if(interaction.customId == "get_reward"){
                getReward(interaction);
            }
            if(interaction.customId == "check_vip"){
                checkVIP(interaction)
            }
        }
    }
})
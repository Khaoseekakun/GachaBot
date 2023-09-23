const client = require("..")
const {sql} =  require("..")

client.on("ready", () => {
    console.log("Bot is ready")

    setInterval(() => {
        sql.all(`SELECT * FROM vip WHERE time_out <= ${(Date.now()/1000).toFixed(0)} OR next_alert <= ${(Date.now()/1000).toFixed(0)}`, (err, rows) => {
            if(err){
                console.log(err)
            }else{
                if(rows){
                    if(rows.length > 0){
                        rows.forEach(row => {
                            if(row.next_alert <= (Date.now()/1000).toFixed(0) && row.next_alert != row.time_out){
                                client.users.fetch(row.member_id).then(user => {
                                    user.send(`คุณ ${user.username} อายุ VIP ของคุณจะหมดอายุในอีก ${row.time_out - (Date.now()/1000).toFixed(0)} วินาที`)
                                })
                                sql.run(`UPDATE vip SET next_alert = time_out WHERE member_id = '${row.member_id}'`, (err) => {
                                    console.log(err)
                                })
                            }else{
                                client.users.fetch(row.member_id).then(user => {
                                    user.send(`คุณ ${user.username} อายุ VIP ของคุณหมดอายุแล้ว`)
                                })
                                client.guilds.fetch('1052231856717844600').then((guild) => {
                                    guild.members.fetch(row.member_id).then(member => {
                                        member.roles.remove(row.role_id).catch(() => {
                                            
                                        })
                                    })
                                })
                                sql.run(`DELETE FROM vip WHERE member_id = '${row.member_id}'`, (err) => {
                                    console.log(err)
                                })
                            }
                        })
                    }
                }
            }
        })
    }, 1000 * 60);
})
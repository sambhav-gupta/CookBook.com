const {db,Users,Recipes,Comments , NotificationsComments , Chats} = require('./database')

Chats.findAndCountAll({
  
        Sender : "adhiraj-seth"
  
}).then((chats)=>{
    for(let i=0;i<chats.count;i++){
        console.log(chats.rows[i].dataValues)
    }
  
})
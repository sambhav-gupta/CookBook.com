const Seqeulize = require('sequelize')

const db = new Seqeulize({
    dialect: 'mysql',
    database: 'project1',
    username: 'sambhavgupta',
    password: '9844'
})

const Users = db.define('user',{
    Firstname:{
        type: Seqeulize.STRING,
        allownull: false
    },
    Lastname:{
        type: Seqeulize.STRING,
        allownull: false
    },
    Username:{
        type: Seqeulize.STRING,
        allownull: false,
        unique: true
    },
    Password:{
        type: Seqeulize.STRING,
        allownull: false
    },
    Dp:{
        type: Seqeulize.STRING,
        allownull: false
    }
})

const Recipes = db.define('recipe',{
    Uploader : {
        type: Seqeulize.STRING,
        allownull: false
    },
    NameOfDish : {
        type: Seqeulize.STRING,
        allownull: false
    },
    Type:{
        type: Seqeulize.STRING,
        allownull: false
    },
    Ingredients:{
        type: Seqeulize.STRING,
        allownull: false
    },
    Method:{
        type: Seqeulize.STRING,
        allownull: false
    },
    Image:{
        type: Seqeulize.STRING,
        allownull: false
    },
    Cuisine:{
        type: Seqeulize.STRING,
        allownull: false
    },
    Deleted:{
        type: Seqeulize.BOOLEAN,
        
    },
    Time:{
        type: Seqeulize.STRING,
        allownull: false
    },
    Date:{
        type: Seqeulize.STRING,
        allownull: false
    }
    ,
    UploaderImage:{
        type: Seqeulize.STRING,
        allownull: false
    }
})

const Friendlist = db.define('friendlist',{
    Username: {
        type: Seqeulize.STRING,
        allownull: false
    },
    Friendname:{
        type: Seqeulize.STRING,
        allownull: false
    },
    Image:{
        type: Seqeulize.STRING,
        allownull: false
    }
})

const Comments = db.define('comments',{
    Recipe:{
        type: Seqeulize.INTEGER,
        allownull: false
    },
    Sender:{
        type: Seqeulize.STRING,
        allownull: false
    },
    Owner:{
        type: Seqeulize.STRING,
        allownull: false
    },
    Deleted:{
        type : Seqeulize.BOOLEAN,
        allownull: false
    },
    Comment:{
        type: Seqeulize.STRING,
        allownull: false
    },
    ImageSender:{
        type: Seqeulize.STRING,
        allownull: false
    },
    Date:{
        type: Seqeulize.STRING,
        allownull: false
    },
    Time: {
        type: Seqeulize.STRING,
        allownull: false
    },
})
const Favourites = db.define('favourites',{
    Markedby:{
        type: Seqeulize.STRING,
        allownull: false
    },
    Recipe:{
        type: Seqeulize.INTEGER,
        allownull: false
    },
    Unmarked:{
        type: Seqeulize.BOOLEAN
    }
})
const NotificationsRecipes = db.define('notificationrecipes',{
    Sender : {
        type: Seqeulize.STRING,
        allownull: false
    },
    Notification: {
        type: Seqeulize.STRING,
        allownull: false
    },
    Date:{
        type: Seqeulize.STRING,
        allownull: false
    },
    Time: {
        type: Seqeulize.STRING,
        allownull: false
    },
    SenderImage:{
        type: Seqeulize.STRING,
        allownull: false
    }
})
const NotificationsComments= db.define('notificationcomments',{
    Sender : {
        type: Seqeulize.STRING,
        allownull: false
    },
    Receiver:{
        type: Seqeulize.STRING,
        allownull: false
    },
    Notification: {
        type: Seqeulize.STRING,
        allownull: false
    },
    Date:{
        type: Seqeulize.STRING,
        allownull: false
    },
    Time: {
        type: Seqeulize.STRING,
        allownull: false
    },
    SenderImage:{
        type: Seqeulize.STRING,
        allownull: false
    },
  
})
const NotificationsFriends = db.define('notificationfriends',{
    Sender : {
        type: Seqeulize.STRING,
        allownull: false
    },
    Notification: {
        type: Seqeulize.STRING,
        allownull: false
    },
    Date:{
        type: Seqeulize.STRING,
        allownull: false
    },
    Time: {
        type: Seqeulize.STRING,
        allownull: false
    },
    SenderImage:{
        type: Seqeulize.STRING,
        allownull: false
    },
    Receiver:{
        type: Seqeulize.STRING,
        allownull: false
    }
})

const Chats = db.define("chats",{
    Sender: {
        type: Seqeulize.STRING,
    allownull: false
    },
    Receiver: {
        type: Seqeulize.STRING,
        allownull: false
    },
    Message:{
        type: Seqeulize.STRING,
        allownull: false
    },
    Time : {
        type: Seqeulize.STRING,
        allownull: false
    },
    Date: {
        type: Seqeulize.STRING,
        allownull: false
    }

})

exports  = module.exports = {db,Users,Recipes,Friendlist,Comments,Favourites,NotificationsRecipes,NotificationsComments,NotificationsFriends , Chats}
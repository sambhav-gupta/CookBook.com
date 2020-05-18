const {db,Users,Recipes,Comments} = require('./database')

Comments.create({
    Recipe : 1,
    Sender : "dfsfklj",
    Owner: "dfkjhsdfkjsh",
    Deleted: false,
    Comment: "sdkljfsdg",
    ImageSender: "dfsjkdsfhsd"

 }).then((comment)=>{
     console.log(comment)
 })
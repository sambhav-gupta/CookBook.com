
const express = require('express')
const session = require('express-session')
const http = require('http')
const path = require('path')
const {db,Users , Recipes ,Friendlist , Comments, NotificationsRecipes,NotificationsFriends,Chats} = require('./database')
const socketio = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const multer = require('multer')



const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
const client =  pool.connect();

app.get('/db', async (req, res) => {
    try {
     
      const result = await client.query('SELECT * FROM users');
      const results = { 'results': (result) ? result.rows : null};
      res.send(results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
// const client = new Client({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });

// client.connect();

 
// client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
//     if (err) throw err;
//     for (let row of res.rows) {
//       console.log(JSON.stringify(row));
//     }
//     client.end();
//   });
  
  
// const client = new Client({
//     user: 'sambhavgupta',
//     host: 'localhost',
//     database: 'cookbook',
//     password: '9844',
//     port: 5432,
//   })
//   client.connect()


const SERVER_PORT =  process.env.PORT || 6789
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// using multer to upload profile pictures of users
var storage = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null,path.join(__dirname,'/profilepictures'))
    },
    filename: (req,file,cb)=>{
       
        
            cb(null,file.fieldname + '-' + req.body.uname + '-' +  Date.now() + path.extname(file.originalname) )
        
      
    }
    })
    
    var upload = multer({
        storage: storage,
        fileFilter: (req,file,cb)=>{
            checkfiletype(file,cb)
        }
    }).single('myphoto')
    
    function checkfiletype(file,cb){
        const filetypes = /jpeg|jpg|png/
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
        const mimetype = filetypes.test(file.mimetype)
        if(mimetype && extname){
             return cb(null,true)
        }else{
            return cb('Error: Images Only')
    
        }
    
    }
    app.use(express.static('./views'))
    app.use(express.static('./audios'))
    app.use(express.static('./Screenshots'))

    // adding user details to database on signup
    app.post('/signup',(req,res)=>{
   
    
        upload(req,res,(err)=>{
            if(err){
                console.log("Error in server")
                console.log(err)
               res.send(err)
                return
            }else {
                if(req.file == undefined){
                    res.send("No file Selected")
                    return
                }else{
                  
                const users = 'INSERT INTO users (firstname,lastname,username,password,dp,date,time) VALUES($1,$2,$3,$4,$5,$6,$7)'
                const data = [req.body.fname,req.body.lname,req.body.uname,req.body.pword,req.file.filename,new Date().getDate() + '/'+(new Date().getMonth()+1) +'/'+new Date().getFullYear(), new Date().getHours() + ':' + new Date().getMinutes()]
                client.query(users,data,(err,result)=>{
                    if(result){
                        res.send("Signed up "+ req.body.uname +" succesfully")
                    
                        return
                    }else{
                        res.send("User " + req.body.uname + " Already Exists . Please login!!")
                    return
                    }
                })
                
                console.log("Uploaded Successfully")
               
                  
                }
            }
        })
    })

// using session for security login
app.use( session({
    secret: 'a long unguessable string here',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: false
    }
  })
)

app.set('view engine','hbs')
app.set('views',__dirname + '/views')
app.use('/',express.static(path.join(__dirname,'./public')))


app.use('/signup',express.static(path.join(__dirname,'./public/signup.html')))

app.use('/signin',express.static(path.join(__dirname,'./public/signin.html')))

// fetching details of user on login
app.post('/signin',(req,res)=>{

    const query = {text: 'SELECT * FROM users where username = $1',
values:[req.body.username]}
client
.query(query)
.then((user)=>{
    if(!user.rows[0]){
        res.send("signup")
    }else if(user.rows[0].password != req.body.password){
        res.send("password")
    }else if(user.rows[0].username != req.body.username){
        res.send("username")
    }else{
      res.send("success")
    }
})
.catch((err)=> console.log(err))
    


})

app.use(express.static('profilepictures'))
app.use(express.static('recipepics'))
app.use(express.static('wallpapers'))


// rendering content page if the user is signed up or logged in successfully
app.get('/content',(req,res)=>{
    if (!req.session.username) {
        res.redirect('/')
        return
      }
      const query = {text :'SELECT * FROM users WHERE username = $1',values:[req.session.username]}
      client.query(query,(err,result)=>{
          if(result){
           const userinfo = {name: result.rows[0].username,
                image : result.rows[0].dp}
                console.log(userinfo)
                res.render('content',{userinfo})
        
          }else{
              console.log(err)
          }
      })
    
     
      
})
// establishing socket.io connection
io.on('connection',(socket)=>{
   
    socket.on('loggedin',(data)=>{
        socket.join(data.username)
        
    })

    socket.on('logout',(data)=>{
        io.to(data.user).emit("loggedout")
    })
    socket.on('getfriends',(data)=>{


        let friendlist = []
        const query = {text:'select*from friendlist where username = $1 ',values:[data.username]}
        client.query(query)
        .then((friends)=>{
            for(let i=0;i<friends.rows.length;i++){
                friendlist.push(friends.rows[i].friendname)
            }
            io.to(data.username).emit('gotfriends',friendlist)
        })
     
    })

    socket.on('getrecipesoffriends',(data)=>{
       console.log(data)
     
     for(let i=0;i<data.length;i++){
        let recipes = []
        const query = {text: 'select*from recipes where uploader = $1',values:[data[i]]}
        client.query(query)
        .then((recipe)=>{
            if(recipe.rows){
                console.log(recipe.rows)
                for(let i=0;i<recipe.rows.length;i++){

                    recipes.push(recipe.rows[i].id)

                }
                
                socket.emit('foundrecipes',recipes)
               
            }
        })
      
        
     }

    })
    // returning recipes for given id
    socket.on('getrecipe',(data)=>{
        const query = {text: 'select*from recipes where id = $1',values:[data]}
        client.query(query)
        .then((recipe)=>{
            socket.emit('foundrecipe',recipe.rows[0])
        })
        
    })

    socket.on('commentsend',(data)=>{
        const query = {text:'insert into comments(recipe,sender,owner,deleted,comment,imagesender,date,time) values($1,$2,$3,$4,$5,$6,$7,$8) returning recipe,sender,owner,deleted,comment,imagesender,date,time',
    values:[data.recipeid,data.sender,data.owner,false,data.msg,data.senderimage,new Date().getDate() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear(),new Date().getHours() + ':' + new Date().getMinutes(),]
    }
    client.query(query)
    .then(comment=>{
       console.log(comment)
        socket.broadcast.emit('commentreceive',comment.rows[0])
    })
       
       
       
    })

    socket.on('check',(data)=>{
        Friendlist.findOne({
            where:{
                Username : data.user,
                Friendname: data.friend
            }
        }).then((friend)=>{
            if(friend){
                io.to(data.user).emit('status',true)
            }else{
                io.to(data.user).emit('status',false)
            }
        })
    })

    socket.on('getcomments',(data)=>{
        Comments.findAndCountAll({
            where: {
                Recipe: data.recipeid
            }
        }).then((comments)=>{
            for(let i=0;i<comments.count;i++){
                socket.emit('gotcomments',{comment: comments.rows[i].dataValues.Comment,
                sender: comments.rows[i].dataValues.Sender,
            recipeid:comments.rows[i].dataValues.Recipe ,
        id: comments.rows[i].dataValues.id ,
    senderimage: comments.rows[i].dataValues.ImageSender})
            }
        })
    })

    socket.on("notify",(data)=>{
        const query1 = {text: 'insert into notificationsrecipes(sender,notification,date,time,senderimage) values($1,$2,$3,$4,$5)'
    , values:[data.user,"Added a recipe",new Date().getDate() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear(),new Date().getHours() + ':' + new Date().getMinutes(),data.userimage]

    }
    client.query(query1)
    const query2 = {text:'select*from friendlist where username = $1',values:[data.user]}
client.query(query2)
.then((friends)=>{
    for(let i=0;i<friends.rows.length;i++){
        io.to(friends.rows[i].friendname).emit("notificationrecipe",(data))
    }
})

        
    })
    socket.on('getnotificationsrecipes',(data)=>{
        for(let i=0;i<data.array.length;i++){

            const query = {text: 'select*from notificationsrecipes where sender = $1',values:[data.array[i]]}
            client.query(query)
            .then((notification)=>{
                if(notification.rows){
                    for(let i=0;i<notification.rows.length;i++){

                    
                    io.to(data.user).emit("gotnotificationsrecipes",{msg : notification.rows[i].notification , image: notification.rows[i].senderimage ,sender: notification.rows[i].sender,date: notification.rows[i].date , time : notification.rows[i].time })
                    }
                }
            })
         

        }
        
    })

    socket.on("msgsend",(data)=>{
        const query = {text:'insert into chats(sender,receiver,message,date,time) values($1,$2,$3,$4,$5) returning sender,receiver,message,date,time',
    values:[data.from,data.to,data.msg,new Date().getDate() + "/" + (new Date().getMonth() + 1) + '/' + new Date().getFullYear(),new Date().getHours() + ":" + new Date().getMinutes()]
    }
    client.query(query)
    .then((message)=>{
        io.to(data.to).emit("msgreceive",message.rows[0])
    }).catch((err)=>{
        console.log(err)
    })
        Chats.create({
            Sender: data.from,
            Receiver: data.to,
            Message: data.msg,
            Date: new Date().getDate() + "/" + (new Date().getMonth() + 1) + '/' + new Date().getFullYear(),
            Time: new Date().getHours() + ":" + new Date().getMinutes()
        }).then((message)=>{
            console.log(message.dataValues)
            io.to(data.to).emit("msgreceive",message.dataValues)
        })
    
    })

   
    
})
// redirection to content page after login
app.post('/content', async (req, res) => {

  
    req.session.username = req.body.username
    req.session.save()
  
    res.redirect('/content')
  })



// destroying the session when a user logs out
app.post('/logout',(req,res)=>{
    req.session.destroy()
    res.send('done')
})

// getting all the users 
app.post('/getallusers',(req,res)=>{
    let userlistserver = []
    const query = {text:'select*from users'}
    client.query(query)
    .then((users)=>{
        for(let i=0;i<users.rows.length;i++){
            userlistserver.push(users.rows[i].username + "=" + users.rows[i].dp)
        }
        res.send(userlistserver)
    })

  
    
})

// add recipe in database
var storagerecipe = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null,'../COOKBOOK.com/recipepics')
    },
    filename: (req,file,cb)=>{
       
        console.log(req.body)
            cb(null,file.fieldname + '-' + req.body.nameofdish + '-' + Date.now() + path.extname(file.originalname) )
        
      
    }
    })
    
    var uploadrecipe = multer({
        storage: storagerecipe,
        fileFilter: (req,file,cb)=>{
            checkfiletype(file,cb)
        }
    }).single('recipeimage')
    
    function checkfiletype(file,cb){
        const filetypes = /jpeg|jpg|png/
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
        const mimetype = filetypes.test(file.mimetype)
        if(mimetype && extname){
             return cb(null,true)
        }else{
            return cb('Error: Images Only')
    
        }
    
    }

    app.post('/addrecipe',(req,res)=>{
   
    
        uploadrecipe(req,res,(err)=>{
            if(err){
                console.log("Error in server")
              res.send(err)
                return
            }else {
                if(req.file == undefined){
                    res.send("No file Selected")
                    return
                }else{

                const query = {text:'insert into recipes(uploader,nameofdish,type,ingredients,method,image,cuisine,time,date,deleted,uploaderimage) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',
            values:[req.body.username,req.body.nameofdish,req.body.type,req.body.ingredients.toString().trim(),req.body.steps.toString().trim(), req.file.filename,req.body.cuisine,new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(),new Date().getDate() + "/" + (new Date().getMonth() + 1) + '/' + new Date().getFullYear(),false,req.body.uploaderimage]
            }
            client.query(query)
            .then((created)=>{
                res.send(created.rows[0])
            })



          
           

               console.log("Uploaded Successfully")
              
                  
                }
            }
        })
    })


// adding friends
app.post('/addfriend',(req,res)=>{

    const query = {text: 'select*from users where username = $1',values:[req.body.friendname]}
    client.query(query)
    .then((user)=>{
        if(user.rows[0]){
            const query = {text: 'insert into friendlist(username,friendname,image) values($1,$2,$3)',values:[req.body.username,req.body.friendname,user.rows[0].dp]}
            client.query(query)
           const query2 = {text : 'insert into notificationsfriends(sender,notification,date,time,senderimage,receiver) values($1,$2,$3,$4,$5,$6)',
           values:[req.body.username,"Added You as a Friend",new Date().getDate() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear(),new Date().getHours() + ':' + new Date().getMinutes(),req.body.image,req.body.friendname]}
            client.query(query2)
io.to(req.body.friendname).emit("notifyfriend",{sender: req.body.username , msg: "Added You as a friend" ,image:req.body.image})
            res.send(user.rows[0].dp)
        } else{
            res.send("Failed")
        }
    }).catch((err)=> console.log(err))
  
    })


// my recipes
app.post('/myrecipes',(req,res)=>{
    let myrecipes = []

    const query = {text:'select*from recipes where uploader = $1',values:[ req.body.username]}
    client.query(query)
    .then((recipe)=>{
        if(recipe.rows){
            for(let i=0;i<recipe.rows.length;i++){
                myrecipes.push(recipe.rows[i])
            }
            res.send(myrecipes)
        }else{
            res.send("No")
        }
    })

})

app.post('/getcomments',(req,res)=>{

    const query = {text:'select*from comments where recipe = $1',values:[req.body.id]}
client.query(query)
.then((comments)=>{
    let commentlist = []
    for(let i=0;i<comments.rows.length;i++){
        commentlist.push(comments.rows[i])
    }
   
    res.send(commentlist)
})
   
})
// editing a recipe
app.post('/getrecipedetails',(req,res)=>{
    const query = {text:'select*from recipes where id= $1',values:[req.body.id]}
    client.query(query)
    .then((recipe)=>{
        res.send(recipe.rows[0])
    })
   
})
// editing
var storagerecipeedit = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null,'../COOKBOOK.com/recipepics')
    },
    filename: (req,file,cb)=>{
       
        console.log(req.body)
            cb(null,file.fieldname + '-' + req.body.nameofdish + '-' + Date.now() + path.extname(file.originalname) )
        
      
    }
    })
    
    var uploadrecipeedit = multer({
        storage: storagerecipeedit,
        fileFilter: (req,file,cb)=>{
            checkfiletype(file,cb)
        }
    }).single('recipeimage')
    
    function checkfiletype(file,cb){
        const filetypes = /jpeg|jpg|png/
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
        const mimetype = filetypes.test(file.mimetype)
        if(mimetype && extname){
             return cb(null,true)
        }else{
            return cb('Error: Images Only')
    
        }
    
    }

    app.post('/editrecipe',(req,res)=>{
   
    
        uploadrecipeedit(req,res,(err)=>{
            if(err){
                console.log("Error in server")
                console.log(err)
               res.send(err)
                return
            }else {
                if(req.file == undefined){

                    const query = {text:'update recipes set uploader=$1,nameofdish=$2,type=$3,ingredients=$4,method=$5,cuisine=$6,deleted=$7,time=$8,date=$9 where id=$10',
                values:[req.body.username,req.body.nameofdish,req.body.type,req.body.ingredients.toString().trim(),req.body.steps.toString().trim(), req.body.cuisine,false,new Date().getHours() + ':' + new Date().getMinutes(),new Date().getDate()+'/'+(new Date().getMonth()+1)+'/'+ new Date().getFullYear(),req.body.id]
                }
            client.query(query)

                    
                    res.send("Updated Successfully")
                    return
                }else{

                    const query = {text:'update recipes set uploader=$1,nameofdish=$2,type=$3,ingredients=$4,method=$5,cuisine=$6,deleted=$7,time=$8,date=$9,image=$10 where id=$11',
                    values:[req.body.username,req.body.nameofdish,req.body.type,req.body.ingredients.toString().trim(),req.body.steps.toString().trim(), req.body.cuisine,false,new Date().getHours() + ':' + new Date().getMinutes(),new Date().getDate()+'/'+(new Date().getMonth()+1)+'/'+ new Date().getFullYear(),req.file.filename,req.body.id]
                    }
                client.query(query)
     
                 
           res.send("Updated Successfully")
               console.log("Uploaded Successfully")
                  
                }
            }
        })
    })
// deleting a recipe
app.post('/deleterecipe',(req,res)=>{
    const query = {text:'update recipes set deleted = $1',values:[true]}
    client.query(query)


    res.send("deleted")
})
// notifications
app.post('/getnotification',(req,res)=>{
    const query = {text:'select*from notificationsfriends where receiver = $1',values:[req.body.user]}
    client.query(query)
    .then((msg)=>{
        if(msg.rows){
            let list = []
            for(let i=0;i<msg.rows.length;i++){
                list.push(msg.rows[i])
            }
            res.send(list)
        }
    })
  

})

app.post("/getdetails",(req,res)=>{
    const query = {text:'select*from comments where id = $1',values:[req.body.id]}
    client.query(query)
    .then((detail)=>{
        res.send(detail.rows[0])
    })
    
})
app.post('/deletecomment',(req,res)=>{
    const query = {text: 'update comments set deleted= $1',values:[true]}
   client.query(query)
    res.send("Deleted")
})
// myfriends
app.post('/getfriends',(req,res)=>{
    let list = []
    const query = {text: 'select*from friendlist where username = $1',values:[ req.body.user]}
    client.query(query)
    .then((friends)=>{
        for(let i=0;i<friends.rows.length;i++){
            list.push(friends.rows[i])
        }
        res.send(list)
    })
   
})
app.post('/getrecipes',(req,res)=>{
    let list = []
    const query = {text: 'select* from recipes where uploader = $1',values:[req.body.Owner]}
    client.query(query)
    .then((recipes)=>{
        for(let i=0;i<recipes.rows.length;i++){
            list.push(recipes.rows[i])
        }
        res.send(list)
    })
   
})
app.post('/getchat',(req,res)=>{

    const query = {text:'select*from chats where (receiver = $1 and sender = $2) or (sender = $1 and receiver = $2)',values:[req.body.sender.trim(),req.body.receiver.trim()]}
    client.query(query)
    .then((chats)=>{
        let chatlist = []
  
        for(let i=0;i<chats.rows.length;i++){
            if((chats.rows[i].sender == req.body.sender && chats.rows[i].receiver == req.body.receiver) ||  (chats.rows[i].receiver == req.body.sender && chats.rows[i].sender == req.body.receiver)){
                chatlist.push(chats.rows[i])
            }
           
        }
    
        res.send(chatlist)
    })
 
})

app.post('/deletefriend',(req,res)=>{
    const query = {text:'delete from friendlist where username = $1 and friendname = $2',values:[req.body.user,req.body.friend]}
   client.query(query)
    res.send("Deleted")
})

 

server.listen(SERVER_PORT,()=>{
    console.log("Server at http://localhost:6789")
})


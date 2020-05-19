const express = require('express')
const session = require('express-session')
const http = require('http')
const path = require('path')
const {db,Users , Recipes ,Friendlist , Comments,Favourites , NotificationsRecipes,NotificationsComments} = require('./database')
const socketio = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const multer = require('multer')

app.use(express.json())
app.use(express.urlencoded({extended: true}))

// using multer to upload profile pictures of users
var storage = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null,'../Project1/profilepictures')
    },
    filename: (req,file,cb)=>{
       
        
            cb(null,file.fieldname + '-' + req.body.uname + path.extname(file.originalname) )
        
      
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
                  
                Users.create({
                    Firstname: req.body.fname,
                    Lastname: req.body.lname,
                    Username: req.body.uname,
                    Password: req.body.pword,
                    Dp: req.file.filename
                }).then((user)=>{
                    res.send("Signed up "+ req.body.uname +" succesfully")
                    
                    return
                }).catch((err)=>{
                   res.send("User " + req.body.uname + " Already Exists . Please login!!")
                    return
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
Users.findOne({
    where:{
        Username: req.body.username
    }
}).then((user)=>{
    if(!user){
        res.send("signup")
    }else if(user.Password != req.body.password){
        res.send("password")
    }else if(user.Username != req.body.username){
        res.send("username")
    }else{
      res.send("success")
    }
})


})

app.use(express.static('profilepictures'))
app.use(express.static('recipepics'))


// rendering content page if the user is signed up or logged in successfully
app.get('/content',(req,res)=>{
    if (!req.session.username) {
        res.redirect('/')
        return
      }
      Users.findOne({
          where:{
              Username: req.session.username
          }
      }).then((user)=>{
        const userinfo = {name: user.Username,
        image : user.Dp}
        console.log(userinfo)
        res.render('content',{userinfo})

      }).catch((err)=>{
          console.log(err)
      })
     
      
})
// establishing socket.io connection
io.on('connection',(socket)=>{
   
    socket.on('loggedin',(data)=>{
        socket.join(data.username)
        
    })
    socket.on('getfriends',(data)=>{


        let friendlist = []
        Friendlist.findAndCountAll({
            where:{
                Username : data.username
            }
        }).then((friends)=>{
            for(let i=0;i<friends.count;i++){
                friendlist.push(friends.rows[i].dataValues.Friendname)
            }
            io.to(data.username).emit('gotfriends',friendlist)
        })
    })

    socket.on('getrecipesoffriends',(data)=>{
       
     for(let i=0;i<data.length;i++){
        let recipes = []
        Recipes.findAndCountAll({
            where:{
                Uploader : data[i]
            }
        }).then((recipe)=>{
            if(recipe){
                for(let i=0;i<recipe.count;i++){
                    recipes.push(recipe.rows[i].dataValues.id)

                }
              
            }
            socket.emit('foundrecipes',recipes)
           

        })
        
     }
   
    })
    // returning recipes for given id
    socket.on('getrecipe',(data)=>{
        Recipes.findOne({
            where:{
                id:data
            }
        }).then((recipe)=>{
            socket.emit('foundrecipe',recipe.dataValues)
        })
    })
 
    socket.on('commentsend',(data)=>{
        Comments.create({
           Recipe : data.recipeid,
           Sender : data.sender,
           Owner: data.owner,
           Deleted: false,
           Comment: data.msg,
           ImageSender: data.senderimage

        }).then((comment)=>{
let commentdata = {msg:comment.Comment,
id: comment.id,
recipeid: data.recipeid,
sender: data.sender,
senderimage: data.senderimage}
            socket.broadcast.emit('commentreceive',commentdata)
        })
        NotificationsComments.create({
            Sender: data.sender,
            Notification: "Commented on Your Recipe",
            Date: new Date().getDay() + '-' + new Date().getMonth() + 1 + '-' + new Date().getFullYear(),
            Time: new Date().getHours() + ':' + new Date().getMinutes(),
            SenderImage: data.senderimage,
            Receiver: data.owner
        }).then((created)=>{
            io.to(data.owner).emit("notificationcomment",{sender: data.sender , image:data.senderimage , msg:"Commented On Your Recipe"})

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
        NotificationsRecipes.create({
            Sender: data.user,
            Notification: "Added a recipe",
            Date: new Date().getDay() + '-' + new Date().getMonth() + 1 + '-' + new Date().getFullYear(),
            Time: new Date().getHours() + ':' + new Date().getMinutes(),
            SenderImage: data.userimage
        })
        Friendlist.findAndCountAll({
            where: {Username : data.user}
        }).then((friends)=>{
            for(let i=0;i<friends.count;i++){
                io.to(friends.rows[i].dataValues.Friendname).emit("notificationrecipe",(data))
            }
        })
    })
    socket.on('getnotifications',(data)=>{
        for(let i=0;i<data.array.length;i++){
            NotificationsRecipes.findOne({
                where: {
                    Sender: data.array[i]
                }
            }).then((notification)=>{
                if(notification){
                    io.to(data.user).emit("gotnotifications",{msg : notification.Notification , image: notification.SenderImage ,sender: notification.Sender})
                }
            })

        }
        for(let i=0;i<data.array.length;i++){
            NotificationsComments.findOne({
                where: {
                    Sender: data.array[i],
                    Receiver: data.user
                }
            }).then((notification)=>{
                if(notification){
                    io.to(data.user).emit("gotnotifications",{msg : notification.Notification , image: notification.SenderImage ,sender: notification.Sender})
                }
            })
        }
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
    Users.findAndCountAll().then((users)=>{
for(let i=0;i<users.count;i++){
    userlistserver.push(users.rows[i].dataValues.Username + "=" + users.rows[i].dataValues.Dp)

}
res.send(userlistserver)

    })
  
    
})

// add recipe in database
var storagerecipe = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null,'../Project1/recipepics')
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
                console.log(err)
               res.send(err)
                return
            }else {
                if(req.file == undefined){
                    res.send("No file Selected")
                    return
                }else{
                  
           Recipes.create({
               Uploader: req.body.username,
               NameOfDish : req.body.nameofdish,
               Type: req.body.type,
                Image: req.file.filename,
                Ingredients : req.body.ingredients.toString(),
                Method : req.body.steps.toString(),
                Cuisine : req.body.cuisine,
                Deleted : false,
                Time: new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(),
                UploaderImage: req.body.uploaderimage
           })
           

               console.log("Uploaded Successfully")
               res.send("uploaded")
                  
                }
            }
        })
    })


// adding friends
app.post('/addfriend',(req,res)=>{
    Users.findOne({
        where:{
            Username: req.body.friendname
        }
    }).then((user)=>{
        if(user){
            Friendlist.create({
                Username: req.body.username,
                Friendname: req.body.friendname
            })
            res.send("Added")
        }else{
            res.send("Failed")
        }
    })

})

// my recipes
app.post('/myrecipes',(req,res)=>{
    let myrecipes = []
    Recipes.findAndCountAll({
        where:{
            Uploader: req.body.username
        }
    }).then((recipe)=>{
        for(let i=0;i<recipe.count;i++){
            myrecipes.push(recipe.rows[i].dataValues)
        }
        res.send(myrecipes)

    })
})

app.post('/getcomments',(req,res)=>{
    Comments.findAndCountAll({
        where:{
            Recipe: req.body.id
        }
    }).then((comments)=>{
        let commentlist = []
        for(let i=0;i<comments.count;i++){
            commentlist.push(comments.rows[i].dataValues)
        }
       
        res.send(commentlist)
    })
})
// editing a recipe
app.post('/getrecipedetails',(req,res)=>{
    Recipes.findOne({
        where:{
            id: req.body.id
        }
    }).then((recipe)=>{
        res.send(recipe)
    })
})
// editing
var storagerecipeedit = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null,'../Project1/recipepics')
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
                    Recipes.update({
                        Uploader: req.body.username,
                        NameOfDish : req.body.nameofdish,
                        Type: req.body.type,
                         Ingredients : req.body.ingredients.toString(),
                         Method : req.body.steps.toString(),
                         Cuisine : req.body.cuisine,
                         Deleted : false,
                         Time: new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()
                    },{where : { id: req.body.id}})
                    res.send("updated without image")
                    return
                }else{
                  
           Recipes.update({
               Uploader: req.body.username,
               NameOfDish : req.body.nameofdish,
               Type: req.body.type,
                Image: req.file.filename,
                Ingredients : req.body.ingredients.toString(),
                Method : req.body.steps.toString(),
                Cuisine : req.body.cuisine,
                Deleted : false,
                Time: new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()
           },{where : { id: req.body.id}})
           res.send("updated with image")
               console.log("Uploaded Successfully")
                  
                }
            }
        })
    })
// deleting a recipe
app.post('/deleterecipe',(req,res)=>{
    Recipes.update({Deleted: true},{where:{id:req.body.id}})
    res.send("deleted")
})
// notifications
app.post('/getnotifications',(req,res)=>{

})

db.sync().then(()=>{console.log("Database Created")})
server.listen(6789,()=>{
    console.log("Server at http://localhost:6789")
})


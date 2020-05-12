const express = require('express')
const session = require('express-session')
const http = require('http')
const path = require('path')
const {db,Users} = require('./database')
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




// rendering content page if the user is signed up or logged in successfully
app.get('/content',(req,res)=>{
    if (!req.session.username) {
        res.redirect('/')
        return
      }
      const user = {name: req.session.username}
        res.render('content',{user})
      
})

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









db.sync().then(()=>{console.log("Database Created")})
server.listen(6789,()=>{
    console.log("Server at http://localhost:6789")
})


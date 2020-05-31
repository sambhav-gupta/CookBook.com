$('#btnsignup').click(()=>{
    location.href = "/signup";
})
$('#btnhome').click(()=>{
    location.href = "/";
})

$('#btnsignin').click(()=>{
    $.post('/signin',{
        username: $('#inpusername').val(),
        password: $('#inppassword').val()
    },(data)=>{
        if(data=="signup"){
            alert("No such user exists. Please Signup")
        }else if(data == "username"){
            alert("Wrong username entered")
        }else if(data=="password"){
            alert("Wrong Password")
        }else if(data=="success"){
            $.post('/content',{username : $('#inpusername').val()},(data)=>{
                  
                window.location.replace('/content')
        })
    }
    })
})
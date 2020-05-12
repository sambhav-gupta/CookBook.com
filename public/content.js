$('#btn').click(()=>{
    $.post('/logout',(data)=>{
        console.log(data)
        if(data=="done"){
            window.location.replace('/')
        }
    })
   
 })
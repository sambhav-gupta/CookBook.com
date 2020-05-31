
$('#btnhome').click(()=>{
    location.href = "/";
})
$('#btnsignin').click(()=>{
    location.href = "/signin";
})

//show selected profile picture on screen//

let counter = 0
$('#btnupload').click(()=>{
   
    if($('#inpprofilephoto').prop('files').length ==0){
        alert("No Profile Photo Selected")
        return
    }else{
        let photo = $('#inpprofilephoto')[0].files[0]
        const source = URL.createObjectURL(photo);
        $('#showprofilephoto').append($(`
        <img src="${source}" class="img-fluid" alt="Responsive image"></img><br><br>
        <button onclick="remove()" class="btn btn-light btn-xsm">Remove</button>
        `))
    }
    $('#btnupload').attr('disabled',"true")


})
//change the selected profile picture//
function remove(){
    $('#showprofilephoto').empty()
    $('#inpprofilephoto').val("")
    $('#btnupload').removeAttr('disabled')
}
// submit the form to signup //
$('#frmsignup').submit(function(e){
  
    e.preventDefault()
    var formData  = new FormData(this)
    $.ajax({
            url: "/signup",
            type: 'POST',
            data: formData,
            
            success: function (data) {
               
                
                
                  if(data == "User " + $('#inpusername').val() + " Already Exists . Please login!!"){
                    alert("User " + $('#inpusername').val() + " Already Exists . Please login!!")
                    $('#inpusername').val("") 
                    return
                  
                  }else if(data == "Signed up "+  $('#inpusername').val() +" succesfully"){
                        alert("Signed up "+  $('#inpusername').val() +" succesfully")
                $.post('/content',{username : $('#inpusername').val()},(data)=>{
                  
                    window.location.replace('/content')
                   
                })
                return
                  }else if(data == "No file Selected"){
                      alert("No Profile Photo Selected")
                      return

                  }
                
               
                
                
            },
            failure: function(data){
              
            },
            catch: false,
            contentType: false,
            processData: false
        });

    });


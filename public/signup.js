
//show selected profile picture on screen//
$('#btnupload').click(()=>{
    if($('#inpprofilephoto').prop('files').length ==0){
        alert("No Profile Photo Selected")
        return
    }else{
        let photo = $('#inpprofilephoto')[0].files[0]
        const source = URL.createObjectURL(photo);
        $('#showprofilephoto').append($(`
        <img src="${source}" class="img-fluid" alt="Responsive image"></img><br>
        <button onclick="remove()">Change</button>
        `))
    }


})
//change the selected profile picture//
function remove(){
    $('#showprofilephoto').empty()
    $('#inpprofilephoto').val("")
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
                alert(data)
                
                $.post('/content',{username : $('#inpusername').val()},(data)=>{
                  
                    window.location.replace('/content')
                })
               
                
                
            },
            failure: function(data){
              
            },
            catch: false,
            contentType: false,
            processData: false
        });

    });


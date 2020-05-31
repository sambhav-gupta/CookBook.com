
$('#btnsignup').click(()=>{
    location.href = "/signup";
})

$('#btnsignin').click(()=>{
    location.href = "/signin";
})
    
$('#divcontent').append($(`
        <img src="content1.png" style="height:400px;width:400px;vertical-align:top;">
        <div style="display:inline-block;font-size:23pt;color:#c4c4c4;font-weight:bold;">
        Are you a Foodie ??<br>
        Do You Love Cooking ??
        <br>
      Want to share your Secret Recipes <br>
      with your Friends ??
        
       
        </div>
        `))
let counter = 0;
$('#btnnext').click(()=>{
    counter ++
    console.log(counter)
    if(counter == 0){
       $('#divcontent').empty()
       $('#divcontent').append($(`
        <img src="content1.png" style="height:400px;width:400px;vertical-align:top;">
        <div style="display:inline-block;font-size:23pt;color:#c4c4c4;font-weight:bold;">
        Are you a Foodie ??<br>
        Do You Love Cooking ??
        <br>
      Want to share your Secret Recipes <br>
      with your Friends ??
        
        
        </div>
        `))
        
    }else if(counter == 1){
        $('#divcontent').empty()
        $('#divcontent').append($(`
        <img src="content2.jpg" style="height:400px;width:400px;vertical-align:top">
        <div style="display:inline-block;font-size:23pt;color:#c4c4c4;font-weight:bold;">
        Create New and Exciting Dishes .<br>
        Share the Recipes with Your Friends .<br>
        Showcase your Cooking Skills !!!!<br>
        </div>

        `))
    }else if(counter == 2){
        $('#divcontent').empty()
        $('#divcontent').append($(`
        <img src="content3.jpg" style="height:400px;width:400px;vertical-align:top">
        <div style="display:inline-block;font-size:23pt;color:#c4c4c4;font-weight:bold;">
      Let your friends know how much you <br>liked their Recipe .
      <br>
      Suggest some tips to make <br>it even more Delicious by   commenting<br>
      on their Recipes !!
        </div>

        `))
    }else if(counter == 3){
        $('#divcontent').empty()
        $('#divcontent').append($(`
        <img src="content4.jpg" style="height:400px;width:400px;vertical-align:top">
        <div style="display:inline-block;font-size:23pt;color:#c4c4c4;font-weight:bold;">
      Chat with Friends and let them  <br>
      know what are you Cooking this week . <br>
      Discuss about Friday Night <br>Dinner Plans !!
        </div>

        `))
    }else if(counter == 4){
        $('#divcontent').empty()
        $('#divcontent').append($(`
        <img src="content5.jpg" style="height:400px;width:500px;vertical-align:top">
        <div style="display:inline-block;font-size:23pt;color:#c4c4c4;font-weight:bold;">
     
      Please Signup Here : <br>
      <button id="btnsignupp" class="btn btn-light" onclick="Signup()">Signup</button><br>
      Already A user ?<br>
      Sign In : <br>
        <button id="btnsigninn" class="btn btn-light" onclick="Signin()">Signin</button>
      
          </div>
        `))
    }else if(counter > 4){
        counter = 0
        $('#divcontent').empty()
        $('#divcontent').append($(`
            <img src="content1.png" style="height:400px;width:400px;vertical-align:top;">
            <div style="display:inline-block;font-size:23pt;color:#c4c4c4;font-weight:bold;">
            Are you a Foodie ??<br>
            Do You Love Cooking ??
            <br>
          Want to share your Secret Recipes <br>
          with your Friends ??
            
            
            </div>
            `))
    }

})
$('#btnprevious').click(()=>{
    counter --
    console.log(counter)
   if(counter ==0){
    $('#divcontent').empty()
    $('#divcontent').append($(`
        <img src="content1.png" style="height:400px;width:400px;vertical-align:top;">
        <div style="display:inline-block;font-size:23pt;color:#c4c4c4;font-weight:bold;">
        Are you a Foodie ??<br>
        Do You Love Cooking ??
        <br>
      Want to share your Secret Recipes <br>
      with your Friends ??
        
        
        </div>
        `))
   }
   else if(counter == 1){
    $('#divcontent').empty()
    $('#divcontent').append($(`
    <img src="content2.jpg" style="height:400px;width:400px;vertical-align:top">
    <div style="display:inline-block;font-size:23pt;color:#c4c4c4;font-weight:bold;">
    Create New and Exciting Dishes .<br>
    Share the Recipes with Your Friends .<br>
    Showcase your Cooking Skills !!!!<br>
    </div>

    `))
}else if(counter == 2){
    $('#divcontent').empty()
    $('#divcontent').append($(`
    <img src="content3.jpg" style="height:400px;width:400px;vertical-align:top">
    <div style="display:inline-block;font-size:23pt;color:#c4c4c4;font-weight:bold;">
  Let your friends know how much you <br>liked their Recipe .
  <br>
  Suggest some tips to make <br>it even more Delicious by   commenting<br>
  on their Recipes !!
    </div>

    `))
}else if(counter == 3){
    $('#divcontent').empty()
    $('#divcontent').append($(`
    <img src="content4.jpg" style="height:400px;width:400px;vertical-align:top">
    <div style="display:inline-block;font-size:23pt;color:#c4c4c4;font-weight:bold;">
  Chat with Friends and let them  <br>
  know what are you Cooking this week . <br>
  Discuss about Friday Night <br>Dinner Plans !!
    </div>

    `))
}else if(counter == 4){
    $('#divcontent').empty()
    $('#divcontent').append($(`
    <img src="content5.jpg" style="height:400px;width:500px;vertical-align:top">
    <div style="display:inline-block;font-size:23pt;color:#c4c4c4;font-weight:bold;">
 
  Please Signup Here : <br>
  <button id="btnsignupp" class="btn btn-light" onclick="Signup">Signup</button><br>
  Already A user ?<br>
  Sign In : <br>
    <button id="btnsigninn" class="btn btn-light" onclick="Signin()">Signin</button>
  
      </div>
    `))
}else if(counter < 0){
    counter = 4
    $('#divcontent').empty()
    $('#divcontent').append($(`
    <img src="content5.jpg" style="height:400px;width:500px;vertical-align:top">
    <div style="display:inline-block;font-size:23pt;color:#c4c4c4;font-weight:bold;">
 
  Please Signup Here : <br>
  <button id="btnsignupp" class="btn btn-light" onclick="Signup()">Signup</button><br>
  Already A user ?<br>
  Sign In : <br>
    <button id="btnsigninn" class="btn btn-light" onclick="Signin()">Signin</button>
  
      </div>
    `))
}
})

function Signup(){
    location.href = "/signup";
}

function Signin(){
    location.href = "/signin";
}




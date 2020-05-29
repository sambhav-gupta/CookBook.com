const socket = io()
socket.emit('loggedin',{username : $('#currentuser').text()})
socket.emit('getfriends',{username:$('#currentuser').text() })


$('#divposts').show()
let currentuser = $('#currentuser').text()
let imgusersrc = $('#imguser').attr("src")

    let userlist = []
    let friendlist =[]
    let arrayoffriends = []
    let clicknumber = 0
    let clickcounter = 0
    let countclick =0 
    let onemorecounter =0
    let counterr =0
    let btnuploadcount = 0
   
// get all users for search purpose for adding friends            
$.post('/getallusers',(data)=>{
console.log(data)
for(let i=0;i<data.length;i++){
let name = data[i].split("=")[0]
let image = data[i].split("=")[1]
userlist.push({id: name , ext : image})
$('#searcheduser').append($(`
<div id="div${name}" style="text-align:center;display:none;" class="append">${name}<img src = "${image}" style="height:40px;width:40px;border-radius:50%;" ></div>

`))
}

})
$('#searcheduser').on("click","div",function(){
$('#inpfriendusername').val($(this).text())
$('#searcheduser').hide()
})
$('#searcheduser').hide()

$('#inpfriendusername').keypress((e)=>{
$('#searcheduser').show()

let length = $('#inpfriendusername').val().length
console.log(length)

for(let i=0;i<userlist.length;i++){
if(userlist[i].id == currentuser){
    continue
    
}
else{


if(userlist[i].id.slice(0,length+1) == $('#inpfriendusername').val()+e.key){
 
    $('#div'+userlist[i].id).show()

}else{
    $('#div'+userlist[i].id).hide()
    continue
}
}
}
})


$('#inpfriendusername').keydown((e)=>{
if(e.which == 8){

if($('#inpfriendusername').val().length == 1){
$('.append').hide()
$('#searcheduser').hide()
}


}
})


// adding friends
$('#btnaddnewfriend').click(()=>{
    
if($('#inpfriendusername').val().length==0){
return
}else if(friendlist.indexOf($('#inpfriendusername').val())!=-1){
alert($('#inpfriendusername').val() + " is already your friend")
}
else{
$.post('/addfriend',{
username : currentuser,
friendname : $('#inpfriendusername').val(),
image: imgusersrc
},(data)=>{
if(data == "Added"){
    friendlist.push($('#inpfriendusername').val())
    
    alert("Added Friend " + $('#inpfriendusername').val())
    $('#inpfriendusername').val("")
    

    return
}else if(data=="Failed"){
    alert("No such User Exists")
     $('#inpfriendusername').val("")
    return
}

})
}

})


// creating a recipe


$('#share').hide()

$('#btnaddnewrecipe').click(()=>{
    for(let i=0;i<arrayoffriends.length;i++){
            
          
        arrayoffriends[i].status = false
    
}
clickcounter =0;
countclick = 0;
onemorecounter = 0;


console.log("test " +  clicknumber)

    clicknumber++
    console.log("test " +  clicknumber)
    if(clicknumber%2==0){
        $('#addnewrecipe').css("background-color", "transparent")
        $('#divposts').show()
        $('#divaddnewrecipe').hide()
        $('#divmyposts').hide()
        $('#diveditrecipe').hide()
        $('#divfriends').hide()
    }else{
        $('#addnewrecipe').css("background-color", "green")
        $('#myrecipes').css("background-color","transparent")
        $('#myfriends').css("background-color","transparent")
        $('#divfriendlist').hide()
        $('#diveditrecipe').hide()
        counterr = 0
        $('#divfriends').hide()
        $('#divposts').hide()
        $('#divmyposts').hide()
        $('#divaddnewrecipe').show()
    }
    
})
$('#btnaddtolist').click(()=>{


let Ingredient = $('#inpingredient').val()
let Quantity = $('#inpquantity').val()
let unit =  $('#unit option:selected').val()



if(Ingredient == "" || Quantity== ""){
return
}
$('#ulingredients').append($(`
<li style="background-color:white;">${Ingredient}(${Quantity} ${unit})   </li>
`))
$('#inpingredient').val("")
$('#inpquantity').val("")



})

$('#inpmethod').keypress((e)=>{
if(e.which == 13){
e.preventDefault()
let step = $('#inpmethod').val()
$('#olsteps').append($(`
<li style="background-color:white;"><t style="background-color:white;">${step}</t>  <button type="button"  onclick="up(this)" style="background-color:transparent;padding:0px;border:0px;"><svg style="background-color:transparent;" class="bi bi-arrow-up-square-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 8.354a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 6.207V11a.5.5 0 0 1-1 0V6.207L5.354 8.354z"/>
</svg></button><button type="button" onclick="down(this)" style="background-color:transparent;padding:0px;border:0px;"><svg style="background-color:transparent;" class="bi bi-arrow-down-square-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 5a.5.5 0 0 0-1 0v4.793L5.354 7.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 9.793V5z"/>
</svg></button></li>
`))
$('#inpmethod').val("")
}
})

function up(obj){
console.log("up")
$(obj).parent().insertBefore($(obj).parent().prev())
}
function down(obj){
console.log("down")
$(obj).parent().insertAfter($(obj).parent().next())
}
$('#inpingredient').keypress((e)=>{
if(e.which == 13){
e.preventDefault()

}
})
$('#inpquantity').keypress((e)=>{
if(e.which == 13){
e.preventDefault()

}
})


$("#ulingredients").on("click","li",function() {
$(this).remove();
})
$("#olsteps").on("click","li t",function() {
$(this).parent().remove();
})

$('#btnupload').click(()=>{
btnuploadcount++


let file = $('#inprecipeimage')[0].files[0]
if(file == undefined){
    alert("Please Select An Image To Upload It !!!!")
    btnuploadcount = 0
}
if(btnuploadcount == 1){
const source = URL.createObjectURL(file);
$('#showimage').append($(`
<img src="${source}"  class="img-fluid" alt="Responsive image">
`))
$('#share').show()

}

})
$('#showimage').on("click","img",function(e){
    btnuploadcount = 0
e.stopPropagation();
$(this).remove()
$('#inprecipeimage').val("")
$('#share').hide()
console.log($('#inprecipeimage').val())

})




$('#frmaddrecipe').submit(function(e){
e.preventDefault()
let ingredients = []
let steps = []
let cuisine = $('#cuisine option:selected').val()
let type = $("input:checked").val()
let uploaderimage = $('#imguser').attr("src")
var formData = new FormData(this)
$('#ulingredients li').each(function(index){
ingredients.push($(this).text())
})
$('#olsteps li').each(function(index){
steps.push($(this).text().split("updown")[0])
})
if(ingredients.length ==0 || ingredients.length == 1){
alert("There should be atleast 2 ingredients")
return
}
if(steps.length ==0 || steps.length ==1){
alert("Method should contain atleast 2 steps")
return
}
for(let i=0;i<ingredients.length;i++){
formData.append("ingredients",ingredients[i])
}
for(let i=0;i<steps.length;i++){
formData.append("steps",steps[i])
}

formData.append("uploaderimage",uploaderimage)
formData.append("cuisine",cuisine)
formData.append("type",type)
formData.append("username",currentuser)

console.log(formData.getAll("ingredients"))
console.log(formData.getAll("steps"))
console.log(formData.get("cuisine"))
console.log(formData.get("nameofdish"))
console.log(formData.get("type"))
$.ajax({
url: '/addrecipe',
type: 'POST',
data: formData,
success: function(data){
    console.log(data)
    socket.emit("notify",{user : currentuser,userimage : imgusersrc , details: data})
alert("Uploaded")

window.location.replace('/content')


},
catch: false,
contentType: false,
processData: false


})




})

// show posts of friends

socket.on('gotfriends',(data)=>{
for(let i=0;i<data.length;i++){
 friendlist.push(data[i])
}
let object = {}
object.array = data
object.user = currentuser
socket.emit('getnotificationsrecipes',object)
socket.emit('getnotificationscomments',object)
       socket.emit('getrecipesoffriends',data)
    })




let recipelist = []
socket.on('foundrecipes',(data)=>{
for(let i=0;i<data.length;i++){
recipelist.push(data[i])
socket.emit('getrecipe',data[i])

}

})



console.log(recipelist)
socket.on('foundrecipe',(data)=>{
    
if(data.Deleted == 1){
    return
}else{

$('#divposts').prepend($(`<div id="posts${data.id}"></div>`))

$('#posts'+data.id).append($(`
<div class="divname${data.id}" style="font-size:15pt;font-family: monospace;font-weight:bold;padding:5px;color:white"><img src="${data.UploaderImage}" style="height:40px;width:40px;border-radius:50%;"></img>  <t class="tname${data.id}" style="font-weight:bold;color:white;">${data.Uploader} </t></div>
<div class="divtime${data.id}" style="font-size:12pt;font-family: monospace;color:white;padding:5px;">${data.Date} at ${data.Time}</div>

<div class="divrecipe${data.id}" style="font-size:18pt;font-family: monospace;font-weight:bolder;color:white;padding:5px;">${data.NameOfDish}</div>

`))
let arrayofsteps = data.Method.split(",")
let arrayofingredients = data.Ingredients.split(",")
$('#posts'+data.id).append($(`
<br>
<div style="color: white;padding:5px;">
<t style="font-family:monospace;font-size:15pt;font-weight:bold;color: white;">Ingredients:</t><ul class="ulingredients${data.id}" style="color: white;">
</ul>

`))
for(let i=0;i<arrayofingredients.length;i++){
$('.ulingredients'+data.id).append($(`<li style="font-family:monospace;font-size:12pt;color: white;">${arrayofingredients[i]}</li>`))
}

$('#posts'+data.id).append($(`
<div style="color: white;padding:5px;">   
<t style="font-size:15pt;font-family:monospace;font-weight:bold;color: white;">Recipe:</t><ol class="ulmethod${data.id}" style="color: white;">
    </ol>
   
    `))

for(let i=0;i<arrayofsteps.length;i++){
$('.ulmethod'+data.id).append($(`<li style="color:white;">${arrayofsteps[i]}</li>`))

}
$('#posts'+data.id).append($(`<br><img src="${data.Image}" style="height:300px;width:300px;margin-left:110px;border:2px solid black;"></img>`))

$('#posts'+data.id).append($(`
<br><br><div class="commentbox${data.id}" style="height:200px;border:2px solid black;color: white;">
<t style="margin-left:230px;color: white;color:white;">Comments</t><br>
<ul class="comments${data.id}" style="height:120px;overflow-y:scroll;list-style-type:none;padding-left:10px;color: white;">
</ul>
<input class="inpcomment${data.id}" style="width:450px;margin-left:10px;color:black;" placeholder="Write A Comment About This Dish.....">
<button class="btncomment${data.id},btn btn-success btn-xsm" onclick="Send
(this)" >SEND</button>
</div><br>
<div style="height:2px;background-color:white;padding:0px;"></div><br>

`))

/*{{!-- socket.emit('getcomments',{recipeid: data.id})
socket.on('gotcomments',(data)=>{
$('.comments'+data.recipeid).append($(`<li id="${data.id}">${data.sender} : ${data.comment}</li>`))
}) --}}*/

$.post('/getcomments',{id : data.id},(data)=>{
console.log(data)
for(let i=0;i<data.length;i++){
    if(data[i].Deleted){
        continue
    }else{

    
    $('.comments'+data[i].Recipe).append($(`<li id="${data[i].id}" onclick="showoptions(this.id)" style="color:wh;">${data[i].Sender}<img src="${data[i].ImageSender}" style="height:20px;width:20px;border-radius:50%;"></img> : ${data[i].Comment}<div id="divcomment${data[i].id}" class= "divcommentspecific" style="color:black;display:none;background-color:yellow;font-size:8pt;border: 2px solid green;width:170px;padding:2px;"><button id="btn${data[i].id}" style="background-color: red;"  onclick="Removecomment(this.id)"><svg style="background-color:red;" class="bi bi-trash-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" d="M2.5 1a1 1 0 00-1 1v1a1 1 0 001 1H3v9a2 2 0 002 2h6a2 2 0 002-2V4h.5a1 1 0 001-1V2a1 1 0 00-1-1H10a1 1 0 00-1-1H7a1 1 0 00-1 1H2.5zm3 4a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7a.5.5 0 01.5-.5zM8 5a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7A.5.5 0 018 5zm3 .5a.5.5 0 00-1 0v7a.5.5 0 001 0v-7z" clip-rule="evenodd"/>
  </svg></button> on ${data[i].Date} at ${data[i].Time} </div></li>`))
  $('.comments'+data[i].Recipe).scrollTop($('.comments'+data[i].Recipe)[0].scrollHeight);
    }
}
})
}

})


// comments

function Send(obj){
   
let id = $(obj).attr('class')
console.log(id)
console.log(id)

id = id.split(",")[0]
id = id.split("btncomment")[1]
if($('.inpcomment'+id).val().length == 0){
    alert("Please Write A Comment")
    return
}else{

    console.log($('.divrecipe'+id).text())
$('.comments'+id).append($(`<li style="color: white">${currentuser} <img src="${imgusersrc}" style="height:20px;width:20px;border-radius:50%;"></img> : ${$('.inpcomment'+id).val()}</li>`))
$('.comments'+id).scrollTop($('.comments'+id)[0].scrollHeight);
socket.emit('commentsend',{msg: $('.inpcomment'+id).val(),
sender : currentuser,
senderimage: imgusersrc,
owner : $('.tname'+id).text(),
recipeid : id,
user: currentuser,
recipename: $('.divrecipe'+id).text()

})
 
$('.inpcomment'+id).val("")
}
}



$('.divcommentspecific').hide()


function showoptions(id){
    clicknumber = 0;
    countclick = 0;
    onemorecounter =0;

    clickcounter ++ 
    if(clickcounter%2==0){
        $('#divcomment'+id).hide()
        
        return
    }else{

    

    $.post('/getdetails',{user : currentuser , id : id},(data)=>
    {
      
        if(data.Sender.trim() == currentuser.trim()){
            console.log("sender == currentuser")
            $('#divcomment'+id).show()

        }else if(data.Owner.trim() == currentuser.trim()){
            console.log("owner == currentuser")
            $('#divcomment'+id).show()
        }else{
            console.log("else")
            return
        }
        

    })
}

}
function Removecomment(id){
    let r =  confirm("Are You sure you want to delete this Comment ??")
    if(r){
        id = id.split("btn")[1]
        $.post('/deletecomment',{id : id},(data)=>{
            $('#'+id).remove()
            alert(data)
        })
       
    }else{
        return
    }
 }
 

socket.on('commentreceive',(data)=>{
  
if(data.Owner.trim() == currentuser.trim()){
    $('#popup').empty()
    $('#audio').trigger("play")
    let timeout=  setTimeout(() => {
        $('#popup').append($(`<t style="font-size:10pt;color:black;background-color:yellow;text-align:center;font-weight:bolder;">${data.Sender} Commented On Your Recipe</t>`))
        $('#popup').show()
       }, 1000);
     
       setTimeout(() => {
          $('#popup').hide()
       },3000);
}
$('.comments'+data.Recipe).append($(`<li  style="color: white;"
 id="${data.id}" onclick="showoptions(this.id)">${data.Sender}<img src="${data.ImageSender}" style="height:20px;width:20px;border-radius:50%;"></img> : ${data.Comment}<div id="divcomment${data.id}" class= "divcommentspecific" style="color:black;display:none;background-color:yellow;font-size:8pt;border: 2px solid green;width:170px;padding:2px;"><button id="btn${data.id}" onclick="Removecomment(this.id)"></button>${data.Date} ${data.Time}</div></li>`))
 $('.comments'+data.Recipe).scrollTop($('.comments'+data.Recipe)[0].scrollHeight);
})

// my recipes


$('#myrecipes').click(()=>{
    for(let i=0;i<arrayoffriends.length;i++){
            
          
        arrayoffriends[i].status = false
    
}
clicknumber =0;
clickcounter = 0;
onemorecounter = 0;

countclick++
console.log(countclick)
if(countclick%2==0){
    $('#diveditrecipe').hide()
$('#divmyposts').hide()
$('#divaddnewrecipe').hide()
$('#divfriends').empty()
$('#divfriends').hide()
$('#myrecipes').css("background-color","transparent")
 $('#divposts').show()
 
}else{
    $('#divfriends').empty()
    $('#divfriends').hide()
  console.log("clicked")
  $('#myrecipes').css("background-color","green")
  $('#diveditrecipe').hide()
  $('#divmyposts').empty()
$('#divmyposts').show()
$('#addnewrecipe').css("background-color","transparent")
$('#myfriends').css("background-color","transparent")
counterr = 0
$('#divfriendlist').hide()
$('#divposts').hide()
$('#divaddnewrecipe').hide()
$.post('/myrecipes',{username: currentuser},(data)=>{


for(let i=0;i<data.length;i++){
    if(data[i].Deleted){
        continue
    }else{
        $('#divmyposts').prepend($(`<div id="myposts${data[i].id}"></div>`))
$('#myposts'+data[i].id).append($(`
<div class="divname${data[i].id}" style="font-size:15pt;font-family: monospace;font-weight:bold;color: white;padding:5px;"><img src="${data[i].UploaderImage}" style="height:40px;width:40px;border-radius:50%;"></img> ${data[i].Uploader} <button id="btnedit${data[i].id}" onclick="edit(this.id)" style="background-color:green;"><svg style="background-color: green" class="bi bi-pen" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" d="M5.707 13.707a1 1 0 01-.39.242l-3 1a1 1 0 01-1.266-1.265l1-3a1 1 0 01.242-.391L10.086 2.5a2 2 0 012.828 0l.586.586a2 2 0 010 2.828l-7.793 7.793zM3 11l7.793-7.793a1 1 0 011.414 0l.586.586a1 1 0 010 1.414L5 13l-3 1 1-3z" clip-rule="evenodd"/>
<path fill-rule="evenodd" d="M9.854 2.56a.5.5 0 00-.708 0L5.854 5.855a.5.5 0 01-.708-.708L8.44 1.854a1.5 1.5 0 012.122 0l.293.292a.5.5 0 01-.707.708l-.293-.293z" clip-rule="evenodd"/>
<path d="M13.293 1.207a1 1 0 011.414 0l.03.03a1 1 0 01.03 1.383L13.5 4 12 2.5l1.293-1.293z"/>
</svg></button>
<button id="btndelete${data[i].id}" onclick="deletemypost(this.id)" style="background-color:red;"><svg class="bi bi-trash-fill" width="1em" height="1em" style="background-color:red;" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" d="M2.5 1a1 1 0 00-1 1v1a1 1 0 001 1H3v9a2 2 0 002 2h6a2 2 0 002-2V4h.5a1 1 0 001-1V2a1 1 0 00-1-1H10a1 1 0 00-1-1H7a1 1 0 00-1 1H2.5zm3 4a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7a.5.5 0 01.5-.5zM8 5a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7A.5.5 0 018 5zm3 .5a.5.5 0 00-1 0v7a.5.5 0 001 0v-7z" clip-rule="evenodd"/>
</svg></button>
</div>
<div class="divtime${data[i].id}" style="font-size:12pt;font-family: monospace;color: white;padding:5px;">${data[i].Date} at ${data[i].Time}</div>
    <div class="divrecipe${data[i].id}" style="font-size:18pt;font-family: monospace;font-weight:bolder;color: white;padding:5px;">${data[i].NameOfDish}</div>
`))
let arrayofsteps = data[i].Method.split(",")
let arrayofingredients = data[i].Ingredients.split(",")
$('#myposts'+data[i].id).append($(`
<br>
<div style="color: white;padding:5px;">
<t style="font-family:monospace;font-size:15pt;font-weight:bold;color: white">Ingredients:</t><ul class="ulingredients${data[i].id}" style="color: white;">
</ul>
`))
for(let j=0;j<arrayofingredients.length;j++){
$('.ulingredients'+data[i].id).append($(`<li style="font-family:monospace;font-size:12pt;color: white;">${arrayofingredients[j]} </li>`))
}

$('#myposts'+data[i].id).append($(`
<div style="color: white;padding:5px;">
<t style="font-size:15pt;font-family:monospace;font-weight:bold;color: white;">Recipe:</t><ol class="ulmethod${data[i].id}" style="color: white;">
    </ol>
    `))

for(let j=0;j<arrayofsteps.length;j++){
$('.ulmethod'+data[i].id).append($(`<li style="color: white;">${arrayofsteps[j]}</li>`))

}
$('#myposts'+data[i].id).append($(` <br> <img src="${data[i].Image}" style="height:300px;width:300px;margin-left:110px;border:2px solid black;"></img>`))

$('#myposts'+data[i].id).append($(`<br><br>
<div class="commentbox${data[i].id}" style="height:200px;border:2px solid black;color: white;">
<t style="margin-left:230px;color: white;color:white;">Comments</t>
<ul class="comments${data[i].id}" style="height:120px;overflow:auto;list-style-type:none;padding-left:10px;color: white;">
</ul>

<input class="inpcomment${data[i].id}" style="width:450px;margin-left:10px;color:black;" placeholder="Write A Comment About This Dish.....">
<button class="btncomment${data[i].id},btn btn-success btn-xsm" onclick="Send(this)">SEND</button>
</div>
<br>
<div style="height:2px;background-color:black;padding:0px;"></div><br>


`))

/*{{!-- socket.emit('getcomments',{recipeid: data[i].id})

socket.on('gotcomments',(data)=>{

$('.comments'+data.recipeid).append($(`<li id="${data.id}">${data.sender} : ${data.comment}</li>`))
console.log(data)
}) --}}*/
$.post('/getcomments',{id : data[i].id},(list)=>{

console.log(list)
for(let i=0;i<list.length;i++){
    if(list[i].Deleted){
        continue
    }else{

    
   
 $('.comments'+list[i].Recipe).append($(`<li style="color: white;" id="${list[i].id}" onclick="showoptions(this.id)">${list[i].Sender}<img src="${list[i].ImageSender}" style="height:20px;width:20px;border-radius:50%;"></img> : ${list[i].Comment}<div id="divcomment${list[i].id}" class= "divcommentspecific" style="color:black;display:none;background-color:yellow;font-size:8pt;border: 2px solid green;width:170px;padding:2px;"><button id="btn${list[i].id}" style="background-color: red;" onclick="Removecomment(this.id)"><svg style="background-color:red;" class="bi bi-trash-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
 <path fill-rule="evenodd" d="M2.5 1a1 1 0 00-1 1v1a1 1 0 001 1H3v9a2 2 0 002 2h6a2 2 0 002-2V4h.5a1 1 0 001-1V2a1 1 0 00-1-1H10a1 1 0 00-1-1H7a1 1 0 00-1 1H2.5zm3 4a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7a.5.5 0 01.5-.5zM8 5a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7A.5.5 0 018 5zm3 .5a.5.5 0 00-1 0v7a.5.5 0 001 0v-7z" clip-rule="evenodd"/>
</svg></button> on ${list[i].Date} at  ${list[i].Time}</div></li>`))

$('.comments'+list[i].Recipe).scrollTop($('.comments'+list[i].Recipe)[0].scrollHeight);
    }
}
})

}
}

})

}


})

// editing myposts

function edit(id){

    $('#diveditrecipe').show()
    $('#divmyposts').hide()
    $('#divaddnewrecipe').hide()
    $('#divposts').hide()
    $('#showimageedit').empty()
    id = id.split("btnedit")[1]
    $.post('/getrecipedetails',{id : id},(data)=>{
    

        $('#inpeditnameofdish').val(data.NameOfDish)
        $('#editcuisine').val(data.Cuisine)
       $('#showimageedit').append($(`<img src="${data.Image}" class="img-fluid" alt="Responsive image"></img>`))
        let arraying = data.Ingredients.split(",")
        for( let i=0;i<arraying.length;i++){
            $('#ulingredientsedit').append($(`
            <li style="display:inline;background-color:white;">${arraying[i]}</li>
            `))
        }
        let arraysteps = data.Method.split(",")
        for(let i=0;i<arraysteps.length;i++){
            $("#olstepsedit").append($(`
            <li style="background-color:white;"><t style="background-color:white;">${arraysteps[i]} </t><button type="button"  onclick="up(this)" style="background-color:transparent;padding:0px;border:0px;"><svg style="background-color:transparent;" class="bi bi-arrow-up-square-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 8.354a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 6.207V11a.5.5 0 0 1-1 0V6.207L5.354 8.354z"/>
          </svg></button><button type="button" onclick="down(this)" style="background-color:transparent;padding:0px;border:0px;"><svg style="background-color:transparent;" class="bi bi-arrow-down-square-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 5a.5.5 0 0 0-1 0v4.793L5.354 7.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 9.793V5z"/>
        </svg></button></li>
            `))
        }
        $("#ulingredientsedit").on("click","li",function() {
            $(this).remove();
            })
            $("#olstepsedit").on("click","li t",function() {
            $(this).parent().remove();
            })
            $('#inprecipeimageedit').filename = data.Image

            $('#btnuploadedit').click(()=>{
                btnuploadcount++
                console.log(btnuploadcount)
                
                let file = $('#inprecipeimageedit')[0].files[0]
                if(file == undefined){
                    alert("No file Selected")
                    btnuploadcount = 0

                }else{
                    $('#showimageedit').empty()
                }
                if(btnuploadcount == 1){
                    
                    const source = URL.createObjectURL(file);
                    $('#showimageedit').append($(`
                    <img src="${source}"  class="img-fluid" alt="Responsive image">
                    `))
                    $('#shareedit').show()
                    $('#inprecipeimageedit')[0].files[0] = null
                  btnuploadcount = 0;
                }
               
                
                })
                $('#showimageedit').on("click","img",function(e){
                    btnuploadcount=0
                e.stopPropagation();
                $(this).remove()
                $('#inprecipeimageedit').val("")
                $('#shareedit').hide()
                console.log($('#inprecipeimageedit').val())
                
                })
                $('#inpeditingredient').keypress((e)=>{
                    if(e.which == 13){
                    e.preventDefault()
                    
                    }
                    })
                    $('#inpeditquantity').keypress((e)=>{
                    if(e.which == 13){
                    e.preventDefault()
                    
                    }
                    })
                    $('#inpmethodedit').keypress((e)=>{
                        if(e.which == 13){
                        e.preventDefault()
                        let step = $('#inpmethodedit').val()
                        $('#olstepsedit').append($(`
                        <li><t>${step}</t>  <button type="button"  onclick="up(this)" style="background-color:transparent;padding:0px;border:0px;"><svg style="background-color:transparent;" class="bi bi-arrow-up-square-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 8.354a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 6.207V11a.5.5 0 0 1-1 0V6.207L5.354 8.354z"/>
          </svg></button><button type="button" onclick="down(this)" style="background-color:transparent;padding:0px;border:0px;"><svg style="background-color:transparent;" class="bi bi-arrow-down-square-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 5a.5.5 0 0 0-1 0v4.793L5.354 7.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 9.793V5z"/>
        </svg></button></li>
                        `))
                        $('#inpmethodedit').val("")
                        }
                        })
                        $('#btnaddtolistedit').click(()=>{

                   
                            let Ingredient = $('#inpeditingredient').val()
                            let Quantity = $('#inpquantityedit').val()
                            let unit =  $('#editunit option:selected').val()
                            
                            
                            
                            if(Ingredient == "" || Quantity== ""){
                            return
                            }
                            $('#ulingredientsedit').append($(`
                            <li style="background-color:white;display:inline;">${Ingredient}(${Quantity} ${unit})   </li>
                            `))
                            $('#inpeditingredient').val("")
                            $('#inpquantityedit').val("")
                            
                            
                            
                            })

                $('#frmeditrecipe').submit(function(e){
                    e.preventDefault()
                    let ingredients = []
                    let steps = []
                    let cuisine = $('#editcuisine option:selected').val()
                    let type = $("input:checked").val()
                    var formData = new FormData(this)
                    $('#ulingredientsedit li').each(function(index){
                    ingredients.push($(this).text())
                    })
                    $('#olstepsedit li').each(function(index){
                    steps.push($(this).text().split("updown")[0])
                    })
                    if(ingredients.length ==0 || ingredients.length == 1){
                    alert("There should be atleast 2 ingredients")
                    return
                    }
                    if(steps.length ==0 || steps.length ==1){
                    alert("Method should contain atleast 2 steps")
                    return
                    }
                    for(let i=0;i<ingredients.length;i++){
                    formData.append("ingredients",ingredients[i])
                    }
                    for(let i=0;i<steps.length;i++){
                    formData.append("steps",steps[i])
                    }
                    
                    
                    formData.append("cuisine",cuisine)
                    formData.append("type",type)
                    formData.append("username",currentuser)
                    formData.append("id",data.id)
                    
                    console.log(formData.getAll("ingredients"))
                    console.log(formData.getAll("steps"))
                    console.log(formData.get("cuisine"))
                    console.log(formData.get("nameofdish"))
                    console.log(formData.get("type"))
                    $.ajax({
                    url: '/editrecipe',
                    type: 'POST',
                    data: formData,
                    success: function(data){
                    alert(data)
                    
                    },
                    catch: false,
                    contentType: false,
                    processData: false
                    
                    
                    })
                    
                    
                    
                    
                    })
                    
                
    })
   
}



// deleting myposts
function deletemypost(id){
    let r = confirm("Are You Sure ?")
    if(r){
        id = id.split("btndelete")[1]
        $.post('/deleterecipe',{id:id},(data)=>{
            alert(data)
            window.location.replace('/content')
        })
    }else{
        return
    }
}


//
socket.on("notificationrecipe",(data)=>{
    $('#audio').trigger("play")
    $('#ulnotificationrecipes').prepend($(`<li><t style="color: #000000;font-weight:bolder;background-color:yellow;">${data.user}  Posted A Recipe <img src="${data.userimage}" style="width:30px;height:30px;border-radius:50%";></img></li>`))
    
    $('#divposts').prepend($(`<div id="posts${data.details.id}"></div>`))

    $('#posts'+data.details.id).append($(`
    <div class="divname${data.details.id}" style="font-size:15pt;font-family: monospace;font-weight:bold;padding:5px;color:white"><img src="${data.details.UploaderImage}" style="height:40px;width:40px;border-radius:50%;"></img>  <t class="tname${data.details.id}" style="font-weight:bold;color:white;">${data.details.Uploader} </t></div>
    <div class="divtime${data.details.id}" style="font-size:12pt;font-family: monospace;color:white;padding:5px;">${data.details.Date} at ${data.details.Time}</div>
    
    <div class="divrecipe${data.details.id}" style="font-size:18pt;font-family: monospace;font-weight:bolder;color:white;padding:5px;">${data.details.NameOfDish}</div>
    
    `))
    let arrayofsteps = data.details.Method.split(",")
    let arrayofingredients = data.details.Ingredients.split(",")
    $('#posts'+data.details.id).append($(`
    <br>
    <div style="color: white;padding:5px;">
    <t style="font-family:monospace;font-size:15pt;font-weight:bold;color: white;">Ingredients:</t><ul class="ulingredients${data.details.id}" style="color: white;">
    </ul>
    
    `))
    for(let i=0;i<arrayofingredients.length;i++){
    $('.ulingredients'+data.details.id).append($(`<li style="font-family:monospace;font-size:12pt;color: white;">${arrayofingredients[i]}</li>`))
    }
    
    $('#posts'+data.details.id).append($(`
    <div style="color: white;padding:5px;">   
    <t style="font-size:15pt;font-family:monospace;font-weight:bold;color: white;">Recipe:</t><ol class="ulmethod${data.details.id}" style="color: white;">
        </ol>
       
        `))
    
    for(let i=0;i<arrayofsteps.length;i++){
    $('.ulmethod'+data.details.id).append($(`<li style="color:white;">${arrayofsteps[i]}</li>`))
    
    }
    $('#posts'+data.details.id).append($(`<br><img src="${data.details.Image}" style="height:300px;width:300px;margin-left:110px;border:2px solid black;"></img>`))
    
    $('#posts'+data.details.id).append($(`
    <br><br><div class="commentbox${data.details.id}" style="height:200px;border:2px solid black;color: white;">
    <t style="margin-left:230px;color: white;color:white;">Comments</t><br>
    <ul class="comments${data.details.id}" style="height:120px;overflow-y:scroll;list-style-type:none;padding-left:10px;color: white;">
    </ul>
    <input class="inpcomment${data.details.id}" style="width:450px;margin-left:10px;color:black;" placeholder="Write A Comment About This Dish.....">
    <button class="btncomment${data.details.id},btn btn-success btn-xsm" onclick="Send
    (this)" >SEND</button>
    </div><br>
    <div style="height:2px;background-color:white;padding:0px;"></div><br>
    
    `))
    
    /*{{!-- socket.emit('getcomments',{recipeid: data.id})
    socket.on('gotcomments',(data)=>{
    $('.comments'+data.recipeid).append($(`<li id="${data.id}">${data.sender} : ${data.comment}</li>`))
    }) --}}*/
    
    $.post('/getcomments',{id : data.details.id},(data)=>{
    console.log(data)
    for(let i=0;i<data.length;i++){
        if(data[i].Deleted){
            continue
        }else{
    
        
        $('.comments'+data[i].Recipe).append($(`<li id="${data[i].id}" onclick="showoptions(this.id)" style="color:wh;">${data[i].Sender}<img src="${data[i].ImageSender}" style="height:20px;width:20px;border-radius:50%;"></img> : ${data[i].Comment}<div id="divcomment${data[i].id}" class= "divcommentspecific" style="color:black;display:none;background-color:yellow;font-size:8pt;border: 2px solid green;width:170px;padding:2px;"><button id="btn${data[i].id}" style="background-color: red;"  onclick="Removecomment(this.id)"><svg style="background-color:red;" class="bi bi-trash-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M2.5 1a1 1 0 00-1 1v1a1 1 0 001 1H3v9a2 2 0 002 2h6a2 2 0 002-2V4h.5a1 1 0 001-1V2a1 1 0 00-1-1H10a1 1 0 00-1-1H7a1 1 0 00-1 1H2.5zm3 4a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7a.5.5 0 01.5-.5zM8 5a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7A.5.5 0 018 5zm3 .5a.5.5 0 00-1 0v7a.5.5 0 001 0v-7z" clip-rule="evenodd"/>
      </svg></button> on ${data[i].Date} at ${data[i].Time} </div></li>`))
      $('.comments'+data[i].Recipe).scrollTop($('.comments'+data[i].Recipe)[0].scrollHeight);
        }
    }
    })
})


socket.on("gotnotificationsrecipes",(data)=>{
  
    $('#ulnotificationrecipes').prepend($(`<li><t style="color: #000000;font-weight:bolder;">${data.sender} ${data.msg} on ${data.date} at ${data.time} <img src="${data.image}" style="width:30px;height:30px;border-radius:50%";></img></li>`))
})



socket.on("notifyfriend",(data)=>{
    $('#audio').trigger("play")
    $('#ulnotificationfriends').prepend($(`<li><t style="color: #000000;font-weight:bolder;background-color:yellow;">${data.sender} ${data.msg} <img src="${data.image}" style="width:30px;height:30px;border-radius:50%";></img> </li>`))
})
$.post("/getnotification",{user: currentuser},(data)=>{
    console.log(data)
    for(let i=0;i<data.length;i++){
        $('#ulnotificationfriends').prepend($(`<li><t style="color: #000000;font-weight:bolder;">${data[i].Sender} ${data[i].Notification} on ${data[i].Date} at ${data[i].Time} <img src="${data[i].SenderImage}" style="width:30px;height:30px;border-radius:50%";></img></li>`))
    }
})

// myfriends

function sendmessage(name){

    if( $('#inpmessage'+name).val().length ==0){
        return
    }else{
    socket.emit("msgsend",{from: currentuser , to: name , msg: $('#inpmessage'+name).val()})
    $('#ulchats'+name).append($(`<li style="color:white;margin-left:350px;background-color:green;border-radius:25px;text-align:center;">${$('#inpmessage'+name).val()}<t style="font-size:8pt;margin-left: 30px;color:white;">${new Date().getHours() + ':' + new Date().getMinutes()}</li><br>`))
    $('#inpmessage'+name).val("")
    $('.ulchats').scrollTop($('.ulchats')[0].scrollHeight);
}
}
socket.on("msgreceive",(data)=>{
  
    // alert("You receievd a Message From " + data.Sender)
    console.log(arrayoffriends)
   let index = arrayoffriends.findIndex(x => x.friend === data.Sender)
   console.log(index)
   if(arrayoffriends[index].status){
       console.log("openend your chat")
       $('#count'+data.Sender).hide()
       $('#audio2').trigger("play")

     
 $('.ulchats').scrollTop($('.ulchats')[0].scrollHeight);
   }else{
    
     $('#popup').empty()
       
       $('#audio').trigger("play")
       
      let timeout=  setTimeout(() => {
        $('#popup').append($(`<t style="font-size:10pt;color:black;background-color:yellow;text-align:center;font-weight:bolder;">You have received a message from ${data.Sender}</t>`))
        $('#popup').show()
       }, 1000);
     
       setTimeout(() => {
          $('#popup').hide()
       },3000);
       let msgs =  $('#count'+data.Sender).text()
  msgs = parseInt(msgs) + 1
  $('#count'+data.Sender).text(`${msgs}`)
  $('#count'+data.Sender).show()
  $('.ulchats').scrollTop($('.ulchats')[0].scrollHeight);
    //    alert("You have received a message from " + data.Sender)
   }
 
$('#ulchats'+data.Sender).append($(`<li style="color:white;background-color:red;margin-right:350px;border-radius:25px;text-align:center;">${data.Message}<t style="font-size:8pt;margin-left: 30px;color:white;">${new Date().getHours() + ':' + new Date().getMinutes()}</li><br>`))
$('.ulchats').scrollTop($('.ulchats')[0].scrollHeight);

})

function sendmessage2(id){
    if(event.key ===  "Enter"){
        sendmessage(id.split("inpmessage")[1])
    }
}

function showrecipes(id){
 console.log(arrayoffriends[0])
 countclick =0;
 clickcounter =0;
 clicknumber =0;

 


 console.log(onemorecounter)
    onemorecounter++
    console.log(onemorecounter)
    if(onemorecounter%2==0){
        let name = id.split(",")[0]
       
    let index = arrayoffriends.findIndex(x => x.friend === name)
    console.log(index)
       arrayoffriends[index].status = false
       console.log(arrayoffriends[index])

        $('#count'+name).text("0")
        $('#divposts').show()
        $('#divfriends').empty()
        $('#divfriends').hide()
        $('#divaddnewrecipe').hide()
        $('#diveditrecipe').hide()
        $('#divmyposts').hide()
 
    }else{
     
        
        $('#divaddnewrecipe').hide()
        $('#diveditrecipe').hide()
        $('#divmyposts').hide()
        $('#divposts').hide()
        $('#divfriends').show()
        $('#myrecipes').css("background-color","transparent")
        $('#addnewrecipe').css("background-color","transparent")
    
   
        let name = id.split(",")[0]
        let srcimage = id.split(",")[1]
     
    let index = arrayoffriends.findIndex(x => x.friend === name)
    console.log(index)
    for(let i=0;i<arrayoffriends.length;i++){
        if(i==index){
            arrayoffriends[index].status = true
        }else{
            arrayoffriends[i].status = false
        }
    }
      
       console.log(arrayoffriends[index])
        
        $('#count'+name).hide()
   
        $.post('/getchat',{receiver : name , sender: currentuser},(data)=>{
            let firsttime = data[0].Date
            $('#ulchats'+name).append(`<div class="date" style="height:30px;text-align:center;font-weight:bold;color:white;background-color:black;border-radius:25px;">${firsttime}</div><br>`)
            for(let i=0;i<data.length;i++){
                if(data[i].Date != firsttime){
                    $('#ulchats'+name).append(`<div class="date" style="height:30px;text-align:center;font-weight:bold;color:white;background-color:black;border-radius:25px;">${data[i].Date}</div><br>`)
firsttime = data[i].Date
                }

                if(data[i].Sender == name){
                   
                        $('#ulchats'+name).append($(`<li style="color:white;background-color:red;margin-right:350px;border-radius:25px;text-align:center;">${data[i].Message}<t style="font-size:8pt;margin-left: 30px;color:white;">${data[i].Time}</li><br>`))
                        continue;
                    
                 
                   
                }else{

                    $('#ulchats'+name).append($(`<li style="color:white;margin-left:350px;background-color:green;border-radius:25px;text-align:center;">${data[i].Message}<t style="font-size:8pt;margin-left: 30px;color:white;">${data[i].Time}</li><br>`))
                }
            }
            $('.ulchats').scrollTop($('.ulchats')[0].scrollHeight);

        })
        $('#divfriends').append($(`
        <div style="text-align:center;color:white;font-size:15pt;height:50px;background-color: #700e09;border-radius:30px;position:sticky;top:10px;" class="divreceiver">${name}   <img src="${srcimage}" style="height:40px;width:40px;border-radius:50%;margin-top:5px;"></img><br></div>
        <br><div style="height:575px;color:white">
        <ul id="ulchats${name}" style="height:500px;overflow:auto;padding:0px;" class="ulchats">
        </ul>
        </div>
        <div style="position:sticky;bottom:10px;">
<input placeholder="Write a Message...." id="inpmessage${name}"  onkeypress="sendmessage2(this.id)"  style="width:400px;margin-left:50px;color:white;background-color:black;border-radius: 30px;"></input>
<button class="btn btn-danger btn-xsm" class="btnsend" id="${name}" onclick="sendmessage(this.id)" style="margin-bottom:10px;">Send</button>

        </div>
        `))

    
  
      
    }
  
}





$.post('/getfriends',{user : currentuser},(data)=>{
       
    for(let i=0;i<data.length;i++){
        let friend = data[i].Friendname
        let status = false
       arrayoffriends.push({friend , status})
       
      
    $('#divfriendlist').append($(`
    <div id="${data[i].Friendname},${data[i].Image}" style="text-align:center;font-size:15pt;border-bottom:1px solid black;" onclick="showrecipes(this.id)">  ${data[i].Friendname} <img src="${data[i].Image}" style="height:20px;width:20px;border-radius:50%"><img>
    <span style="height:10px;background-color:red;font-size:12pt;display:none;font-weight:bold;" id="count${data[i].Friendname}">0</span>
  </div>
    `))
    }
})
$('#myfriends').click(()=>{
    
    for(let i=0;i<arrayoffriends.length;i++){
            
          
        arrayoffriends[i].status = false
    
}
clickcounter =0;
clicknumber = 0;
onemorecounter = 0;
countclick = 0;
    counterr ++ 
    console.log(counterr)
    if(counterr%2==0){
        
          
        $('#divfriendlist').hide()
        $('#divfriends').hide()
        $('#divposts').show()
        $('#myfriends').css("background-color","transparent")
    
    }else{
        $('#myfriends').css("background-color","red")
      
    $('#divfriendlist').show()
    
   
}
})

// function hoverthis

function hoverthis(id){
    $('#'+id).css("background-color", "#01535c")
}

function donthoverthis(id){
    $('#'+id).css("background-color","transparent")
}
// logout 
$('#btnlogout').click(()=>{
    let descision = confirm("Are you sure to Sign Out ??")
    if(descision){
        $.post('/logout',(data)=>{
            console.log(data)
            if(data=="done"){
            window.location.replace('/')
            }
            })
    }else{
        return
    }

})
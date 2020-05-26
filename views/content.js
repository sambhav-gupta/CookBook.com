const socket = io()
socket.emit('loggedin',{username : $('#currentuser').text()})
socket.emit('getfriends',{username:$('#currentuser').text() })


$('#divposts').show()
let currentuser = $('#currentuser').text()
let imgusersrc = $('#imguser').attr("src")

    let userlist = []
    let friendlist =[]
   
   
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

let count = 0
$('#addnewrecipe').click(()=>{
count++
if(count%2==0){
$('#divaddnewrecipe').hide()
}else{
$('#divaddnewrecipe').show()
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
let clicknumber = 0
$('#btnaddnewrecipe').click(()=>{
    clicknumber++
    if(clicknumber%2==0){
        $('#divposts').show()
        $('#divaddnewrecipe').hide()
        $('#divmyposts').hide()
        $('#diveditrecipe').hide()
        $('#divfriends').hide()
    }else{
        $('#diveditrecipe').hide()
        $('#divfriends').hide()
        $('#divposts').hide()
        $('#divmyposts').hide()
        $('#divaddnewrecipe').show()
    }
    
})
$('#btnaddtolist').click(()=>{

$('#divaddnewrecipe').show()
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
let btnuploadcount = 0
$('#btnupload').click(()=>{
btnuploadcount++
console.log(btnuploadcount)

let file = $('#inprecipeimage')[0].files[0]

const source = URL.createObjectURL(file);
$('#showimage').append($(`
<img src="${source}"  class="img-fluid" alt="Responsive image">
`))
$('#share').show()
btnuploadcount=0

})
$('#showimage').on("click","img",function(e){
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
    socket.emit("notify",{user : currentuser,userimage : imgusersrc})
alert(data)


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



$('#divposts').append($(`
<div class="divname${data.id}" style="font-size:15pt;font-family: monospace;font-weight:bold;background-color:grey;padding:5px;"><img src="${data.UploaderImage}" style="height:40px;width:40px;border-radius:50%;"></img>  <t class="tname${data.id}" style="font-weight:bold;background-color:grey;">${data.Uploader} </t></div>
<div class="divtime${data.id}" style="font-size:12pt;font-family: monospace;background-color:grey;padding:5px;">${data.createdAt.split("T")[0]}</div>

<div class="divrecipe${data.id}" style="font-size:18pt;font-family: monospace;font-weight:bolder;background-color:grey;padding:5px;">${data.NameOfDish}</div>

`))
let arrayofsteps = data.Method.split(",")
let arrayofingredients = data.Ingredients.split(",")
$('#divposts').append($(`
<br>
<div style="background-color: grey;padding:5px;">
<t style="font-family:monospace;font-size:15pt;font-weight:bold;background-color:grey;">Ingredients:</t><ul class="ulingredients${data.id}" style="background-color:grey;">
</ul>

`))
for(let i=0;i<arrayofingredients.length;i++){
$('.ulingredients'+data.id).append($(`<li style="font-family:monospace;font-size:12pt;background-color:grey;">${arrayofingredients[i]}</li>`))
}

$('#divposts').append($(`
<div style="background-color: grey;padding:5px;">   
<t style="font-size:15pt;font-family:monospace;font-weight:bold;background-color:grey;">Recipe:</t><ol class="ulmethod${data.id}" style="background-color:grey;">
    </ol>
   
    `))

for(let i=0;i<arrayofsteps.length;i++){
$('.ulmethod'+data.id).append($(`<li style="background-color:grey;">${arrayofsteps[i]}</li>`))

}
$('#divposts').append($(`<br><img src="${data.Image}" style="height:300px;width:300px;margin-left:110px;border:2px solid black;"></img>`))

$('#divposts').append($(`
<br><br><div class="commentbox${data.id}" style="height:200px;border:2px solid black;background-color: grey;">
<t style="margin-left:230px;background-color: grey;color:white;">Comments</t><br>
<ul class="comments${data.id}" style="height:120px;overflow-y:scroll;list-style-type:none;padding-left:10px;background-color:grey;">
</ul>
<input class="inpcomment${data.id}" style="width:450px;margin-left:10px;color:white;" placeholder="Write A Comment About This Dish.....">
<button class="btncomment${data.id},btn btn-success btn-xsm" onclick="Send
(this)" >SEND</button>
</div><br>
<div style="height:2px;background-color:black;padding:0px;"></div><br>

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

    
    $('.comments'+data[i].Recipe).append($(`<li id="${data[i].id}" onclick="showoptions(this.id)" style="background-color:grey;">${data[i].Sender}<img src="${data[i].ImageSender}" style="height:20px;width:20px;border-radius:50%;"></img> : ${data[i].Comment}<div id="divcomment${data[i].id}" class= "divcommentspecific" style="display:none;background-color:yellow;font-size:8pt;border: 2px solid green;width:170px;padding:2px;"><button id="btn${data[i].id}" style="background-color: red;"  onclick="Removecomment(this.id)"><svg style="background-color:red;" class="bi bi-trash-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" d="M2.5 1a1 1 0 00-1 1v1a1 1 0 001 1H3v9a2 2 0 002 2h6a2 2 0 002-2V4h.5a1 1 0 001-1V2a1 1 0 00-1-1H10a1 1 0 00-1-1H7a1 1 0 00-1 1H2.5zm3 4a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7a.5.5 0 01.5-.5zM8 5a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7A.5.5 0 018 5zm3 .5a.5.5 0 00-1 0v7a.5.5 0 001 0v-7z" clip-rule="evenodd"/>
  </svg></button> on ${data[i].Date} at ${data[i].Time} </div></li>`))
    }
}
})
}

})


// comments

function Send(obj){
   
let id = $(obj).attr('class')
console.log(id)

id = id.split(",")[0]
id = id.split("btncomment")[1]
if($('.inpcomment'+id).val().length == 0){
    alert("Please Write A Comment")
    return
}else{

    console.log($('.divrecipe'+id).text())
$('.comments'+id).append($(`<li style="background-color:grey">${currentuser} <img src="${imgusersrc}" style="height:20px;width:20px;border-radius:50%;"></img> : ${$('.inpcomment'+id).val()}</li>`))
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

let clickcounter = 0
function showoptions(id){
    clickcounter ++ 
    if(clickcounter%2==0){
        $('#divcomment'+id).hide()
        
        return
    }else{

    

    $.post('/getdetails',{user : currentuser , id : id},(data)=>
    {
      
        if(data.Sender == currentuser){
            console.log("sender == currentuser")
            $('#divcomment'+id).show()
        }else if(data.Owner == currentuser){
            console.log("owner == currentuser")
            $('#divcomment'+id).show()
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
   

$('.comments'+data.Recipe).append($(`<li  style="background-color:grey;"
 id="${data.id}" onclick="showoptions(this.id)">${data.Sender}<img src="${data.ImageSender}" style="height:20px;width:20px;border-radius:50%;"></img> : ${data.Comment}<div id="divcomment${data.id}" class= "divcommentspecific" style="display:none;background-color:yellow;font-size:8pt;border: 2px solid green;width:170px;padding:2px;"><button id="btn${data.id}" onclick="Removecomment(this.id)"></button>${data.Date} ${data.Time}</div></li>`))

})

// my recipes

let countclick =0 
$('#myrecipes').click(()=>{

countclick++
console.log(countclick)
if(countclick%2==0){
    $('#diveditrecipe').hide()
$('#divmyposts').hide()
$('#divaddnewrecipe').hide()


 $('#divposts').show()
 
}else{

  console.log("clicked")
  $('#diveditrecipe').hide()
$('#divmyposts').show()
$('#divposts').hide()
$('#divaddnewrecipe').hide()
$.post('/myrecipes',{username: currentuser},(data)=>{
console.log(data)
for(let i=0;i<data.length;i++){
    if(data[i].Deleted){
        continue
    }else{
$('#divmyposts').append($(`
<div class="divname${data[i].id}" style="font-size:15pt;font-family: monospace;font-weight:bold;background-color:grey;padding:5px;"><img src="${data[i].UploaderImage}" style="height:40px;width:40px;border-radius:50%;"></img> ${data[i].Uploader} <button id="btnedit${data[i].id}" onclick="edit(this.id)" style="background-color:green;"><svg style="background-color: green" class="bi bi-pen" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" d="M5.707 13.707a1 1 0 01-.39.242l-3 1a1 1 0 01-1.266-1.265l1-3a1 1 0 01.242-.391L10.086 2.5a2 2 0 012.828 0l.586.586a2 2 0 010 2.828l-7.793 7.793zM3 11l7.793-7.793a1 1 0 011.414 0l.586.586a1 1 0 010 1.414L5 13l-3 1 1-3z" clip-rule="evenodd"/>
<path fill-rule="evenodd" d="M9.854 2.56a.5.5 0 00-.708 0L5.854 5.855a.5.5 0 01-.708-.708L8.44 1.854a1.5 1.5 0 012.122 0l.293.292a.5.5 0 01-.707.708l-.293-.293z" clip-rule="evenodd"/>
<path d="M13.293 1.207a1 1 0 011.414 0l.03.03a1 1 0 01.03 1.383L13.5 4 12 2.5l1.293-1.293z"/>
</svg></button>
<button id="btndelete${data[i].id}" onclick="deletemypost(this.id)" style="background-color:red;"><svg class="bi bi-trash-fill" width="1em" height="1em" style="background-color:red;" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" d="M2.5 1a1 1 0 00-1 1v1a1 1 0 001 1H3v9a2 2 0 002 2h6a2 2 0 002-2V4h.5a1 1 0 001-1V2a1 1 0 00-1-1H10a1 1 0 00-1-1H7a1 1 0 00-1 1H2.5zm3 4a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7a.5.5 0 01.5-.5zM8 5a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7A.5.5 0 018 5zm3 .5a.5.5 0 00-1 0v7a.5.5 0 001 0v-7z" clip-rule="evenodd"/>
</svg></button>
</div>
<div class="divtime${data[i].id}" style="font-size:12pt;font-family: monospace;background-color:grey;padding:5px;">${data[i].Time}</div>
    <div class="divrecipe${data[i].id}" style="font-size:18pt;font-family: monospace;font-weight:bolder;background-color:grey;padding:5px;">${data[i].NameOfDish}</div>
`))
let arrayofsteps = data[i].Method.split(",")
let arrayofingredients = data[i].Ingredients.split(",")
$('#divmyposts').append($(`
<br>
<div style="background-color:grey;padding:5px;">
<t style="font-family:monospace;font-size:15pt;font-weight:bold;background-color:grey">Ingredients:</t><ul class="ulingredients${data[i].id}" style="background-color:grey;">
</ul>
`))
for(let j=0;j<arrayofingredients.length;j++){
$('.ulingredients'+data[i].id).append($(`<li style="font-family:monospace;font-size:12pt;background-color:grey;">${arrayofingredients[j]} </li>`))
}

$('#divmyposts').append($(`
<div style="background-color:grey;padding:5px;">
<t style="font-size:15pt;font-family:monospace;font-weight:bold;background-color:grey;">Recipe:</t><ol class="ulmethod${data[i].id}" style="background-color:grey;">
    </ol>
    `))

for(let j=0;j<arrayofsteps.length;j++){
$('.ulmethod'+data[i].id).append($(`<li style="background-color:grey;">${arrayofsteps[j]}</li>`))

}
$('#divmyposts').append($(` <br> <img src="${data[i].Image}" style="height:300px;width:300px;margin-left:110px;border:2px solid black;"></img>`))

$('#divmyposts').append($(`<br><br>
<div class="commentbox${data[i].id}" style="height:200px;border:2px solid black;background-color:grey;">
<t style="margin-left:230px;background-color:grey;color:white;">Comments</t>
<ul class="comments${data[i].id}" style="height:120px;overflow-y:scroll;list-style-type:none;padding-left:10px;background-color:grey;">
</ul>
<input class="inpcomment${data[i].id}" style="width:450px;margin-left:10px;color:white;" placeholder="Write A Comment About This Dish.....">
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

    
   
 $('.comments'+list[i].Recipe).append($(`<li style="background-color:grey;" id="${list[i].id}" onclick="showoptions(this.id)">${list[i].Sender}<img src="${list[i].ImageSender}" style="height:20px;width:20px;border-radius:50%;"></img> : ${list[i].Comment}<div id="divcomment${list[i].id}" class= "divcommentspecific" style="display:none;background-color:yellow;font-size:8pt;border: 2px solid green;width:170px;padding:2px;"><button id="btn${list[i].id}" style="background-color: red;" onclick="Removecomment(this.id)"><svg style="background-color:red;" class="bi bi-trash-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
 <path fill-rule="evenodd" d="M2.5 1a1 1 0 00-1 1v1a1 1 0 001 1H3v9a2 2 0 002 2h6a2 2 0 002-2V4h.5a1 1 0 001-1V2a1 1 0 00-1-1H10a1 1 0 00-1-1H7a1 1 0 00-1 1H2.5zm3 4a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7a.5.5 0 01.5-.5zM8 5a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7A.5.5 0 018 5zm3 .5a.5.5 0 00-1 0v7a.5.5 0 001 0v-7z" clip-rule="evenodd"/>
</svg></button> on ${list[i].Date} at  ${list[i].Time}</div></li>`))
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
    id = id.split("btnedit")[1]
    $.post('/getrecipedetails',{id : id},(data)=>{
        console.log(data)

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
                
                const source = URL.createObjectURL(file);
                $('#showimageedit').append($(`
                <img src="${source}"  class="img-fluid" alt="Responsive image">
                `))
                $('#shareedit').show()
                btnuploadcount=0
                
                })
                $('#showimageedit').on("click","img",function(e){
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
                        <li><t>${step}</t><button type="button"  onclick="up(this)">up</button><button type="button" onclick="down(this)">down</button></li>
                        `))
                        $('#inpmethodedit').val("")
                        }
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
        })
    }else{
        return
    }
}


//
socket.on("notificationrecipe",(data)=>{
    $('#ulnotificationrecipes').prepend($(`<li style="background-color:#b667c2">${data.user}  Posted A Recipe <img src="${data.userimage}" style="width:30px;height:30px;border-radius:50%";></img></li>`))
})


socket.on("gotnotificationsrecipes",(data)=>{
  
    $('#ulnotificationrecipes').prepend($(`<li style="background-color:  #b667c2 ">${data.sender} ${data.msg} on ${data.date} at ${data.time} <img src="${data.image}" style="width:30px;height:30px;border-radius:50%";></img></li>`))
})



socket.on("notifyfriend",(data)=>{
    
    $('#ulnotificationfriends').prepend($(`<li style="background-color: #468503">${data.sender} ${data.msg} <img src="${data.image}" style="width:30px;height:30px;border-radius:50%";></img> </li>`))
})
$.post("/getnotification",{user: currentuser},(data)=>{
    console.log(data)
    for(let i=0;i<data.length;i++){
        $('#ulnotificationfriends').prepend($(`<li style="background-color:#468503 ">${data[i].Sender} ${data[i].Notification} on ${data[i].Date} at ${data[i].Time} <img src="${data[i].SenderImage}" style="width:30px;height:30px;border-radius:50%";></img></li>`))
    }
})

// myfriends
let arrayoffriends = []
function sendmessage(name){
    socket.emit("msgsend",{from: currentuser , to: name , msg: $('#inpmessage'+name).val()})
    $('#ulchats'+name).append($(`<li style="color:white">${$('#inpmessage'+name).val()}</li>`))
    $('#inpmessage'+name).val("")
   
}
socket.on("msgreceive",(data)=>{
    // alert("You receievd a Message From " + data.Sender)
    console.log(arrayoffriends)
   let index = arrayoffriends.findIndex(x => x.friend === data.Sender)
   console.log(index)
   if(arrayoffriends[index].status){
       console.log("openend your chat")
       $('#audio2').trigger("play")
   }else{
      
       console.log("closed at the moment")
       $('#audio').trigger("play")
       alert("You have received a message from " + data.Sender)
   }
    
$('#ulchats'+data.Sender).append($(`<li style="color:green">${data.Message}</li>`))
  let msgs =  $('#count'+data.Sender).text()
  msgs = parseInt(msgs) + 1
  $('#count'+data.Sender).text(`${msgs}`)

})
let onemorecounter =0

function showrecipes(id){
 console.log(arrayoffriends[0])
    onemorecounter++
    if(onemorecounter%2==0){
        let name = id.split("div,")[1]
       
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
        let name = id.split("div,")[1]
       
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
        $('#count'+name).text("0")
        // $('#count'+name).hide()
        
        $.post('/getchat',{receiver : name , sender: currentuser},(data)=>{
            let firsttime = data[0].Date
            $('#ulchats'+name).append(`<div class="date" style="height:100px;text-align:center;font-weight:bold;">${firsttime}</div>`)
            for(let i=0;i<data.length;i++){
                if(data[i].Date != firsttime){
                    $('#ulchats'+name).append(`<div class="date" style="height:50px;text-align:center;font-weight:bold;">${data[i].Date}</div>`)
firsttime = data[i].Date
                }

                if(data[i].Sender == name){
                   
                        $('#ulchats'+name).append($(`<li style="color:green">${data[i].Message}</li>`))
                        continue;
                    
                 
                   
                }else{

                    $('#ulchats'+name).append($(`<li style="color:white;margin-left:400px;">${data[i].Message}</li>`))
                }
            }

        })
        $('#divfriends').append($(`
        <div style="text-align:center;color:white;font-size:15pt;height:50px;" class="divreceiver">${name}<br></div>
        <div style="height:575px;color:white">
        <ul id="ulchats${name}" style="height:500px;overflow-y:scroll;">
        </ul>
        </div>
        <div>
<input placeholder="Write a Message...." id="inpmessage${name}" style="width:400px;margin-left:50px;color:white;"></input>
<button class="btn btn-danger btn-xsm" class="btnsend" id="${name}" onclick="sendmessage(this.id)">Send</button>

        </div>
        `))

    
  
      
    }
}


let counterr =0

$.post('/getfriends',{user : currentuser},(data)=>{
      
    for(let i=0;i<data.length;i++){
       
        let friend = data[i].Friendname
        let status = false
       arrayoffriends.push({friend , status})
    }
})
$('#myfriends').click(()=>{
    counterr ++ 
    if(counterr%2==0){
        $('#divfriendlist').hide()
        $('#divfriendlist').empty()
        return
    }else{
    $('#divfriendlist').show()
    $.post('/getfriends',{user : currentuser},(data)=>{
       
        for(let i=0;i<data.length;i++){
            
           
          
        $('#divfriendlist').append($(`
        <div id="div,${data[i].Friendname}" style="background-color:green;text-align:center;font-size:15pt;border-bottom:1px solid black;" onclick="showrecipes(this.id)">  ${data[i].Friendname} <img src="${data[i].Image}" style="height:20px;width:20px;border-radius:50%"><img>
        <span style="height:10px;width:10px;background-color:white;font-size:8pt;" id="count${data[i]}">0</span>
      </div>
        `))
        }
    })
   
}
})



// logout 
$('#btnlogout').click(()=>{
$.post('/logout',(data)=>{
console.log(data)
if(data=="done"){
window.location.replace('/')
}
})
})
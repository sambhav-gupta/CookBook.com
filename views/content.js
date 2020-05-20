const socket = io()
socket.emit('loggedin',{username : $('#currentuser').text()})
socket.emit('getfriends',{username:$('#currentuser').text() })

$('#divmyposts').hide()

$('#divaddnewrecipe').hide()
$('#diveditrecipe').hide()
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

$('#btnaddtolist').click(()=>{
$('#divmyposts').hide()
$('#divaddnewrecipe').show()
let Ingredient = $('#inpingredient').val()
let Quantity = $('#inpquantity').val()
let unit =  $('#unit option:selected').val()



if(Ingredient == "" || Quantity== ""){
return
}
$('#ulingredients').append($(`
<li>${Ingredient}(${Quantity} ${unit})   </li>
`))
$('#inpingredient').val("")
$('#inpquantity').val("")



})

$('#inpmethod').keypress((e)=>{
if(e.which == 13){
e.preventDefault()
let step = $('#inpmethod').val()
$('#olsteps').append($(`
<li><t>${step}</t><button type="button"  onclick="up(this)">up</button><button type="button" onclick="down(this)">down</button></li>
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
socket.emit('getnotifications',object)
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
<div class="divrecipe${data.id}" style="font-size:18pt;font-family: monospace">${data.NameOfDish}</div>
<div class="divname${data.id}" style="font-size:15pt;font-family: monospace">Uploaded By : <t class="tname${data.id}">${data.Uploader}</t><img src="${data.UploaderImage}" style="height:40px;width:40px;></img>"</div>
<div class="divtime${data.id}" style="font-size:12pt;font-family: monospace">On : ${data.createdAt.split("T")[0]}</div>
    
`))
let arrayofsteps = data.Method.split(",")
let arrayofingredients = data.Ingredients.split(",")
$('#divposts').append($(`

<t style="font-family:monospace;font-size:15pt">Ingredients:</t><ul class="ulingredients${data.id}">
</ul>
`))
for(let i=0;i<arrayofingredients.length;i++){
$('.ulingredients'+data.id).append($(`<li style="font-family:monospace;font-size:12pt">${arrayofingredients[i]}</li>`))
}

$('#divposts').append($(`

<t style="font-size:15pt;font-family:monospace;">Recipe:</t><ol class="ulmethod${data.id}">
    </ol>
    `))

for(let i=0;i<arrayofsteps.length;i++){
$('.ulmethod'+data.id).append($(`<li>${arrayofsteps[i]}</li>`))

}
$('#divposts').append($(`<img src="${data.Image}" style="height:300px;width:300px;"></img>`))

$('#divposts').append($(`
<br><br><div class="commentbox${data.id}" style="height:200px;border:2px solid black;">
<t style="margin-left:230px;">Comments</t><br>
<ul class="comments${data.id}" style="height:120px;overflow-y:scroll;">
</ul>
<input class="inpcomment${data.id}" style="width:450px;margin-left:10px;" placeholder="Write A Comment About This Dish.....">
<button class="btncomment${data.id}" onclick="Send
(this)">SEND</button>
</div><br>
<div style="height:2px;background-color:red;"></div>
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

    
    $('.comments'+data[i].Recipe).append($(`<li id="${data[i].id}" onclick="showoptions(this.id)">${data[i].Sender}<img src="${data[i].ImageSender}" style="height:40px;width:40px;"></img> : ${data[i].Comment}<div id="divcomment${data[i].id}" class= "divcommentspecific" style="display:none;"><button id="btn${data[i].id}" onclick="Removecomment(this.id)"></button>${data[i].Date} ${data[i].Time}</div></li>`))
    }
}
})
}

})


// comments

function Send(obj){
   
let id = $(obj).attr('class')
console.log(id)

id = id.split("btncomment")[1]
if($('.inpcomment'+id).val().length == 0){
    alert("Please Write A Comment")
    return
}else{

    console.log($('.divrecipe'+id).text())
$('.comments'+id).append($(`<li>${currentuser} <img src="${imgusersrc}" style="height:40px;width:40px;"></img> : ${$('.inpcomment'+id).val()}</li>`))
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
        clickcounter = 0
        return
    }else{

    

    $.post('/getdetails',{user : currentuser , id : id},(data)=>
    {
      
        if(data.Owner == currentuser ){
           console.log("Owner")
           $('#divcomment'+id).show()
           
        }else if(data.Sender == currentuser){
            console.log("Sender")
            $('#divcomment'+id).show()
            
        }else{
          
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

$('.comments'+data.Recipe).append($(`<li 
 id="${data.id}" onclick="showoptions(this.id)">${data.Sender}<img src="${data.ImageSender}" style="height:40px;width:40px;"></img> : ${data.Comment}<div id="divcomment${data.id}" class= "divcommentspecific" style="display:none;"><button id="btn${data.id}" onclick="Removecomment(this.id)"></button>${data.Date} ${data.Time}</div></li>`))

})

// my recipes

let countclick =0 
$('#myrecipes').click(()=>{
$('#divaddnewrecipe').hide()
countclick++
console.log(countclick)
if(countclick%2==0){
 $('#divmyposts').empty()
$('#divmyposts').hide()


 $('#divposts').show()
 
}else{
  console.log("clicked")

$('#divmyposts').show()
$('#divposts').hide()
$.post('/myrecipes',{username: currentuser},(data)=>{
console.log(data)
for(let i=0;i<data.length;i++){
    if(data[i].Deleted){
        continue
    }else{
$('#divmyposts').append($(`
<div class="divname${data[i].id}" style="font-size:15pt;font-family: monospace">${data[i].Uploader}<img src="${data[i].UploaderImage}" style="height:40px;width:40px;"></img><button id="btnedit${data[i].id}" onclick="edit(this.id)">Edit</button>
<button id="btndelete${data[i].id}" onclick="deletemypost(this.id)">Delete</button>
</div>
<div class="divtime${data[i].id}" style="font-size:12pt;font-family: monospace">${data[i].Time}</div>
    <div class="divrecipe${data[i].id}" style="font-size:15pt;font-family: monospace">${data[i].NameOfDish}</div>
`))
let arrayofsteps = data[i].Method.split(",")
let arrayofingredients = data[i].Ingredients.split(",")
$('#divmyposts').append($(`

<t style="font-family:monospace;font-size:15pt">Ingredients:</t><ul class="ulingredients${data[i].id}">
</ul>
`))
for(let j=0;j<arrayofingredients.length;j++){
$('.ulingredients'+data[i].id).append($(`<li style="font-family:monospace;font-size:12pt">${arrayofingredients[j]} </li>`))
}

$('#divmyposts').append($(`

<t style="font-size:15pt;font-family:monospace;">Recipe:</t><ol class="ulmethod${data[i].id}">
    </ol>
    `))

for(let j=0;j<arrayofsteps.length;j++){
$('.ulmethod'+data[i].id).append($(`<li>${arrayofsteps[j]}</li>`))

}
$('#divmyposts').append($(`<img src="${data[i].Image}" style="height:300px;width:300px;"></img>`))

$('#divmyposts').append($(`
<div class="commentbox${data[i].id}" style="height:200px;border:2px solid black;">
<t>Comments</t>
<ul class="comments${data[i].id}" style="height:120px;overflow-y:scroll;">
</ul>
<input class="inpcomment${data[i].id}" >
<button class="btncomment${data[i].id}" onclick="Send(this)">SEND</button>
</div>

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

    
   
 $('.comments'+list[i].Recipe).append($(`<li id="${list[i].id}" onclick="showoptions(this.id)">${list[i].Sender}<img src="${list[i].ImageSender}" style="height:40px;width:40px;"></img> : ${list[i].Comment}<div id="divcomment${list[i].id}" class= "divcommentspecific" style="display:none;"><button id="btn${list[i].id}" onclick="Removecomment(this.id)"></button>${list[i].Date} ${list[i].Time}</div></li>`))
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
    id = id.split("btnedit")[1]
    $.post('/getrecipedetails',{id : id},(data)=>{
        console.log(data)

        $('#inpeditnameofdish').val(data.NameOfDish)
        $('#editcuisine').val(data.Cuisine)
       $('#showimageedit').append($(`<img src="${data.Image}" class="img-fluid" alt="Responsive image"></img>`))
        let arraying = data.Ingredients.split(",")
        for( let i=0;i<arraying.length;i++){
            $('#ulingredientsedit').append($(`
            <li style="display:inline;">${arraying[i]}</li>
            `))
        }
        let arraysteps = data.Method.split(",")
        for(let i=0;i<arraysteps.length;i++){
            $("#olstepsedit").append($(`
            <li><t>${arraysteps[i]} </t><button type="button"  onclick="up(this)">up</button><button type="button" onclick="down(this)">down</button></li>
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
    $('#ulnotificationrecipes').prepend($(`<li>${data.user}  Posted A Recipe <img src="${data.userimage}" style="width:30px;height:30px;border-radius:50%";></img></li>`))
})
socket.on("notificationcomment",(data)=>{
    $('#ulnotificationcomments').prepend($(`<li>${data.sender} ${data.msg} <img src="${data.image}" style="width:30px;height:30px;border-radius:50%";></img></li>`))
})


socket.on("gotnotificationsrecipes",(data)=>{
  
    $('#ulnotificationrecipes').prepend($(`<li>${data.sender} ${data.msg} on ${data.date} at ${data.time} <img src="${data.image}" style="width:30px;height:30px;border-radius:50%";></img></li>`))
})

socket.on("gotnotificationscomments",(data)=>{
  
    $('#ulnotificationcomments').prepend($(`<li>${data.sender} ${data.msg} on ${data.date} at ${data.time} <img src="${data.image}" style="width:30px;height:30px;border-radius:50%";></img></li>`))
})

socket.on("notifyfriend",(data)=>{
    $('#ulnotificationfriends').prepend($(`<li>${data.sender} ${data.msg} <img src="${data.image}" style="width:30px;height:30px;border-radius:50%";></img> </li>`))
})
$.post("/getnotification",{user: currentuser},(data)=>{
    console.log(data)
    for(let i=0;i<data.length;i++){
        $('#ulnotificationfriends').prepend($(`<li>${data[i].Sender} ${data[i].Notification} on ${data[i].Date} at ${data[i].Time} <img src="${data[i].SenderImage}" style="width:30px;height:30px;border-radius:50%";></img></li>`))
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
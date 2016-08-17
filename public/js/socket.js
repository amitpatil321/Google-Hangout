$(document).ready(function(){

	// Set window title
	document.title += " - "+myname;
	// Send user online event to server
	socket.emit("userOnline",{id:myid,name:myname,pic:mypic});

	// Get list on all online users
	socket.on("userOnline",function(obj){
		var list = '';
		window.onlineusers = obj.users;
		console.log(obj.users);
		for (var key in obj.users) {
		  if (obj.users.hasOwnProperty(key)) {
		  	// Dont list logged in user(sender) in list
		  	if(obj.users[key].id != myid){
		  		name = obj.users[key].name
		  		pic  = obj.users[key].pic

		  		//list += '<a class="item user" id="'+obj.users[key].id+'"><img src="https://randomuser.me/api/portraits/men/'+pic+'.jpg">'+name+'</a>';
		  		//list += '<a class="item user" id="'+obj.users[key].id+'"><img class="ui avatar image" src="https://randomuser.me/api/portraits/men/'+pic+'.jpg">'+name+'</a>';
		  		list += '<a class="item user" id="'+obj.users[key].id+'"><img class="ui avatar image" src="/'+pic+'.png">'+name+'</a>';
		  	}
		  }
		}
		// Upate online users list
		$(".onlineusers").html(list);
	});
  
	// Get new message
	socket.on("message",function(msgObj){
		var sender    =  msgObj.sender;
		var receiver  =  msgObj.receiver;
		var timestamp =  msgObj.timestamp;
		var msg 	  =  msgObj.msg; 

		// Check if i am a receiver and chat window is not open, then open window and append message
		if(receiver == myid){ 
			// Trigger click event and open senders windows as i am the receiver
			// Check if window already open ? 
			var chatwin = $(document).find(".chatwindow[id='"+sender+"'] .messages");
			if(chatwin.length <= 0) { 
				// Trigget click event on senders name to open window
				$(".onlineusers").find("a[id='"+sender+"']").click();
			}
			// Append new message
			$(document).find(".chatwindow[id='"+sender+"'] .messages").append(tplmsg(msgObj,msgObj.sendername));
		}else{
			// I am sender that means window already open, so just append the message to existing message list 
			//$(document).find(".chatwindow[id='"+receiver+"'] .messages").append(tplmsg(msgObj,"self"));
		}
		scroll(); 
	}); 
 
	// Get 'user is typing..' message
	socket.on("typing", function(dataObj){
		console.log("typing event received"+dataObj.sender+" for "+dataObj.receiver);
		var chatwin = $(document).find(".chatwindow[id='"+dataObj.sender+"'] .messages");
		chatwin.find(".typing").html(dataObj.msg).fadeIn();
		setTimeout(function(){ chatwin.find(".typing").hide(); }, 1000);
	});
}) 
 
function tplmsg(msgObj,msgsender){
	//return '<div class="comment"><div class="content"><a class="author">'+msgObj.sendername+'</a><div class="metadata"><span class="date">Today at 5:42PM</span></div><div class="text">'+msgObj.msg+'</div></div></div>';
	var msgalign = "left";
	//console.log(msgsender);
	if(msgObj.sender == myid) { 
		msgalign = "right";
		//ppic = "https://randomuser.me/api/portraits/men/"+pic+".jpg";
		ppic = "/"+pic+".png";
	}else {
		ppic = getPic(msgObj,msgObj.receiver);
		//ppic = 'https://randomuser.me/api/portraits/men/1.jpg' 
	}

	// if(msgsender == "self"){
	// 	msgalign = "right";
	// 	ppic = "/"+mypic+".png";
	// }
	// else{
	// 	alert("receiver got message");
	// 	ppic = getPic(msgObj,msgObj.receiver);
	// }

	//ppic = getPic(msgObj,msgObj.receiver);

	return '<div class="message '+msgalign+'"><img src="'+ppic+'"><div class="bubble">'+msgObj.msg+'<div class="corner"></div><span class="msgtime">'+moment(msgObj.timestamp).format("h:mm:ss A")+'</span></div></div>';
}

function scroll(){
	$(".messages").scrollTop(1000);
}

function getPic(msgObj,user){
	//alert("Receiver :"+user);
	var ousers =  window.onlineusers
	//console.log(ousers);
	for (var key in ousers) {
	  if (ousers.hasOwnProperty(key)) {
	  	if(ousers[key].id == user){
	  		//alert("/"+ousers[key].pic+".png");
	  		//ppic = "https://randomuser.me/api/portraits/men/"+ousers[key].pic+".jpg";
	  		return "/"+ousers[key].pic+".png";
	  	}
	  }
	}
}
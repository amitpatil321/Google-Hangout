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
		//console.log("typing event received"+dataObj.sender+" for "+dataObj.receiver);
		var chatwin = $(document).find(".chatwindow[id='"+dataObj.sender+"'] .messages");
		chatwin.find(".typing").html(dataObj.msg).fadeIn();
		setTimeout(function(){ chatwin.find(".typing").hide(); }, 1000);
	});

	// Handle user logout
	socket.on("logout",function(user){
		tplmsglogout(user.name);
		if(myname == user)
			window.location.reload();
	});
}) 

// Message template 
function tplmsg(msgObj,msgsender){
	var msgalign = "left";

	if(msgsender == "self"){
		msgalign = "right";
		ppic = "/"+mypic+".png";
	}
	else{
		ppic = getPic(msgObj,msgObj.sender);
	}
	return '<div class="message '+msgalign+'"><img src="'+ppic+'"><div class="bubble">'+msgObj.msg+'<div class="corner"></div><span class="msgtime">'+moment(msgObj.timestamp).format("h:mm:ss A")+'</span></div></div>';
}

// Logout action teplate
tplmsglogout = function (user) {
	// User should get notification only if he's not the one who logged out
	if (user != myname) {
		var chatwin = $(document).find(".chatwindow .messages");
		chatwin.find(".typing").html(user+" is logged out and cannot see your message").addClass("red").fadeIn();
	}
}

// Scroll to bottom everytime new message gets append
function scroll(){
	$(".messages").scrollTop(1000);
}

// Get users profile pic
function getPic(msgObj,user){
	var ousers =  window.onlineusers
	for (var key in ousers) {
	  if (ousers.hasOwnProperty(key)) {
	  	if(ousers[key].id == user){
	  		return "/"+ousers[key].pic+".png";
	  	}
	  }
	}
}
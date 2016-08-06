$(document).ready(function(){

	// Send user online event to server
	socket.emit("userOnline",{id:myid,name:myname});

	// Get list on all online users
	socket.on("userOnline",function(obj){
		var list = '';
		for (var key in obj.users) {
		  if (obj.users.hasOwnProperty(key)) {
		  	// Dont list logged in user(sender) in list
		  	if(obj.users[key].id != myid)
		  		list += '<a class="item user" id="'+obj.users[key].id+'">'+obj.users[key].name+'</a>';
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
			console.log("inside");
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
			$(document).find(".chatwindow[id='"+receiver+"'] .messages").append(tplmsg(msgObj,"self"));
		}
		scroll();
	});

	// Get 'user is typing..' message
	socket.on("typing", function(dataObj){
		$(document).find(".chatwindow[id='"+dataObj.receiver+"'] .messages").append(dataObj.msg);
	});
})

function tplmsg(msgObj,msgsender){
	//return '<div class="comment"><div class="content"><a class="author">'+msgObj.sendername+'</a><div class="metadata"><span class="date">Today at 5:42PM</span></div><div class="text">'+msgObj.msg+'</div></div></div>';
	var msgalign = "left";
	if(msgObj.sender == myid) msgalign = "right";

	return '<div class="message '+msgalign+'"><img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/245657/1_copy.jpg"><div class="bubble">'+msgObj.msg+'<div class="corner"></div><span>3 min</span></div></div>';
}

function scroll(){
	$("#chat-messages").scrollTop(1000);
}
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
			$(document).find(".chatwindow[id='"+receiver+"'] .messages").append(tplmsg(msgObj,"Me"));
		}	
	});	
})

function tplmsg(msgObj){
	return '<div class="comment"><div class="content"><a class="author">'+msgObj.sendername+'</a><div class="metadata"><span class="date">Today at 5:42PM</span></div><div class="text">'+msgObj.msg+'</div></div></div>';	
}
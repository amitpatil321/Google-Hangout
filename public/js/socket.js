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
			// Trigger click event and open senders windows as i am the receiver
			// Check if window already open ? 
			var chatwin = $(document).find(".chatwindow[id='"+sender+" .messages']");
			console.log(chatwin.length);
			if(!chatwin.length){
				$(".onlineusers").find("a[id='"+sender+"']").click();
			}
			chatwin.append(msg);
		}else{
			// I am sender that means window already open, so just append the message to existing message list 
			$(document).find(".chatwindow[id='"+receiver+"'] .messages").append(msg);
		}	
	});	
})
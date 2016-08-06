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
			$(document).find(".chatwindow[id='"+receiver+"'] .messages").append(msg);
		}
		// Find that window by receiver id 
		$(document).find(".chatwindow[id='"+receiver+"'] .messages").append(msg);
	});	
})
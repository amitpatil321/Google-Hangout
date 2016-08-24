$(document).ready(function(){

    $(".useslist").draggable({ containment: "window" });

    // Create new chat window
    $(document).on("click",".user",function(){
      var username = $(this).html();
      var userid   = $(this).attr("id");

      if(!$(document).find(".chatwindow [id='"+userid+"']").length){
    		var $div = $('<div />').appendTo('body');
    		$div.attr('class', 'ui card chatwindow comments');
    		$div.attr('id', userid);
    		$div.attr('style', 'position:absolute;left:'+randomx()+"px;top:"+randomy()+"px;");
    		$div.html('<div class="content drag uwheader"><div class="header">'+username+'<i class="icon right floated minibtn disabled remove"></i><i class="icon right floated minibtn disabled chevron up"></i></div></div><div class="content messages" id="chat-messages"><div class="typing">Shrikant is typing...</div></div><div class="extra content"><div class="ui large transparent right icon ui fluid input"><i class="comment outline icon"></i><input class="txtmsg" id="'+userid+'" value="" placeholder="Message..." type="text" autofocus></div>');
      }  
      // <span class="ui right floated minibtn close">x</span><span class="ui right floated minibtn">-</span>

		  // attach draging
      $div.draggable({
          containment      : [window.width],
          refreshPositions : true,
          handle           : 'div.drag'
      });
    }); 

    // Close chat winow
    $(document).on("click",".remove",function(){
      $(this).closest(".chatwindow").fadeOut(function(){
        $(this).remove();
      });
    });     

    // Close chat winow
   	$(document).on("click",".up,.down",function(){ 
      var self = $(this);
      if($(this).hasClass('chevron up'))
        $(this).removeClass("chevron up").addClass('chevron down'); 
      else
        $(this).removeClass("chevron down").addClass('chevron up'); 
      self.closest(".chatwindow").find(".messages,.extra").fadeToggle("fast",function(){
        //self.closest('.chatwindow').find(".extra").slideToggle('fast');
      });
   		//$(this).closest(".extra").slideUp();
   	}); 

   	// Handle enter key press event on chat window input text element
   	$(document).on("keydown",".txtmsg",function(event){
   		if(event.keyCode == 13){
   			var receiver = $(this).attr("id");
   			var msg  	 = $(this).val();
        if(msg.length){
          $(document).find(".chatwindow[id='"+receiver+"'] .messages").append(tplmsg({sender: myid, receiver: receiver, msg: msg},"self"));
          socket.emit("message",{sender: myid, receiver: receiver, msg: msg});
     			// Clear text box
     			$(this).val('');
        }
   		}
   	})

    // Send typing.... event
    $(document).on("keypress",".txtmsg",function(event) {
      // ignore special keys
      if (event.which !== 0 && !event.ctrlKey && !event.metaKey && !event.altKey){
       var keycode = (event.keyCode ? event.keyCode : event.which); 
       if(keycode != 13){
          socket.emit("typing",{
            sender   : myid,
            receiver : $(this).attr("id")
          });
        }
      }
    });

    $(document).on("click",".logout",function(){
      socket.emit("logout",{id:myid});
    });
    // Profile pics
    var pics = '';
    for(var i =10; i<=20; i++){
        pics += '<div class="item" data-value="'+i+'"><img class="ui avatar image" src="https://randomuser.me/api/portraits/men/'+i+'.jpg"></div>';
    }
    $(".ppic").append(pics);    
});

// Get random number relative to document width 
randomx = function(){
	return Math.floor(Math.random() * ($(document).width() - 300));
}

// Get random number relative to document height 
randomy = function(){
	return Math.floor(Math.random() * ($(document).height() - ($(document).height()/2)));
}
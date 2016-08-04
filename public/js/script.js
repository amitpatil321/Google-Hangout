$(document).ready(function(){
    $(".useslist").draggable({ containment: "window" });

    // Create new chat window
    $(".user").click(function(){
    	var username = $(this).attr("id");
		var $div = $('<div />').appendTo('body');
		$div.attr('class', 'ui card chatwindow');
		$div.attr('user-id', username);
		$div.attr('style', 'position:absolute;left:'+randomx()+"px;top:"+randomy()+"px;");
		$div.html('<div class="content"><div class="header teal ui">'+username+'<span class="ui right floated close">x</span></div></div><div class="content messages">sss</div><div class="extra content"><div class="ui large transparent left icon input"><i class="comment outline icon"></i><input placeholder="Message..." type="text"></div>');

		// attach draging
		$div.draggable({
	        containment: [window.width],
	        refreshPositions: true
    	});
    });

    // Close chat winow
   	$(document).on("click",".close",function(){
   		$(this).closest(".chatwindow").remove()
   	});
});

randomx = function(){
	console.log(Math.random());
	console.log($(document).width());
	return Math.floor(Math.random() * ($(document).width() - 300));
}
randomy = function(){
	return Math.floor(Math.random() * ($(document).height() - 300));
}

//define(["jquery", "cookie"], function($){
//	$.cookie.json = true;
//	$.get("/html/header.html", function(data){
//		var _user = $.cookie("loginUser");
//		if (_user){
//			$(data).filter(".login_reg").hide().end()
//				   .filter(".user_info").show().html().end()
//				   .appendTo(".header");
//		} else {
//			$(data).appendTo(".header");
//		}
//	});
//
//	$.get("/html/footer.html", function(data){
//		$(data).appendTo(".footer");
//	})
//});
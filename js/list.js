$(function(){
	$.getJSON("/mock/list.json",function(responseData){
			var data = {
				list : responseData
			};
			var html = template("index_html", data);
			$(".one2").append(html);
		})
	
})

		


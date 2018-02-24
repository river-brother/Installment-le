$(function(){
		// var headerHeight = $("#header").outerHeight();
			var headerHeight = $(".louti:eq(0)").offset().top, // 头部布局结构的高度
				winHeight = $(window).height(), // 窗口高度
				isMoving = false, // 标记是否是由于点击导航发生的滚动行为，true:点击触发  false:非点击
				currentFloorIndex = 0; // 当前显示楼层的索引

			// 绑定页面滚动的事件
			$(window).on("scroll", function(){
				if (!isMoving) {
					var _scrollTop = $(window).scrollTop(); // 获取页面滚动高度
					// 判断滚动距离
					if (_scrollTop >= headerHeight - winHeight / 2) {
						$("#floor").stop().fadeIn();
					} else {
						$("#floor").stop().fadeOut();
					}

					// 遍历每个楼层
					$(".louti .top2").each(function(index, element){
						// 求当前遍历到楼层在文档中距离文档顶部的绝对定位
						var _top = $(element).offset().top;
						// 与滚动距离判断
						if (_scrollTop >= _top - winHeight / 2) {
							$("#floor li").eq(index).children("span").show().end()
										 .siblings().children("span").hide();
							currentFloorIndex = index; // 标记当前正显示楼层的索引
						}
					});
				}
			});

			// 点击导航楼层跳转
			$("#floor li:not()").click(function(){  //#floor li:not(:last)表示最后一个不被选中
				var floorIndex = $(this).index(),
					_top = $(".louti .top2").eq(floorIndex).offset().top; // 计算应该页面滚动的高度
				isMoving = true;

				$(this).children("span").show().end()
					   .siblings().children("span").hide();

				// 实现页面滚动效果
				$("html,body").stop().animate({scrollTop: _top}, 1000, function(){
					isMoving = false;
				});
			}).hover(function(){
				$(this).children("span").show();
			}, function(){
				if ($(this).index() !== currentFloorIndex)
					$(this).children("span").hide();
			});
//			$("#floor li:last").click(function(){
//				$(window).scrollTop(0);
//				// $("html,body").animate({scrollTop:0}, 1000);
//			});
        
})
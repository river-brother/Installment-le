$(function () {
		var $imgs = $("#banner li"),//首先获取图片数组
			len = $imgs.length,//获取到这个图片数组的个数
			imgWidth = $imgs.eq(0).outerWidth(),//获取到单个图片的宽
			currentIndex = 1,
			nextIndex = currentIndex + 1,
			circle=[],
			html="",//为添加小圆点准备
			isMoving=true,
			timer = null;
		timer = setInterval(move,3000)//三秒换一张图片
		/*克隆图片*/
		var first=$imgs.eq(0).clone(true),
			last=$imgs.eq(len-1).clone(true);
		$("#banner ul").append(first).prepend(last)
					   .css({
					   	width: (len+2)*imgWidth,
					   	left:-imgWidth
					   });;
		len+=2;
		/*创建小圆点*/
		for(var i = 0; i < len-2; i++){//计算需要创建多少个小圆点
			html += "<div></div>";
		};
		$(html).appendTo('#pages').addClass('circle').eq(0).addClass('current');
		var circleWidth = $(".circle").eq(0).outerWidth()+10;
			$("#pages").css({
				width: (len*circleWidth)+"px"
			});
		/*添加小圆点移入事件*/
		$("#pages").on("mouseover",".circle",function () {
			if ((currentIndex-1) === $(this).index()) {
				return;
			}
			nextIndex = $(this).index()+1;
			move();
		})
		/*添加鼠标移入暂停，移出继续*/
		$("#banner").hover(function() {
			clearInterval(timer);
			$("#prev").show(400);
			$("#next").show(400);
		}, function() {
			timer = setInterval(move,3000);
			$("#prev").hide();
			$("#next").hide();
		});
		/*添加上下翻页*/
			$("#prev").click(function() {
				if (isMoving===false) {
					nextIndex = currentIndex - 1;
					if (nextIndex < 1) {
						nextIndex = len -2;
					}
					move()
				};
			});
			$("#next").click(function(){
				if (isMoving===false) {
					move()
				};
			});
		/* 轮播动画创建*/
		function move() {
			isMoving=true;
			var _left=-1*imgWidth*nextIndex;
			$("#banner ul").stop().animate({
				left: _left}, function() {
				isMoving = false;
				if (nextIndex >=len) {
					$("#banner ul").css({
						left:-imgWidth
					});
					currentIndex=1;
					nextIndex=2;
				}
			});
			//实现小圆点的颜色与当前图片对应
			$(".circle").eq(currentIndex-1).removeClass('current').end()
						.eq(nextIndex-1).addClass('current');
			/********************************************/
			currentIndex = nextIndex;
			nextIndex++;
		}
	});

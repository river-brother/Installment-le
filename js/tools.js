// 根据参数选择器字符串内容查询元素
// 参数：
//		selector: 选择器，可以是 #id/.classname/element
//		context: 查询上下文对象，可选，不传递则默认为 document
// 返回值：
// 		查找到的元素，如果是id查找，返回具体的元素对象或 null，如果其它方式查找，返回集合
function $(selector, context) {
	context = context || document; // 默认上下文查找环境为 document
	/* 判断 selector 选择器的类型 */
	// if (selector.startsWith("#"))
	// if (selector.charAt(0) === "#")
	// if (selector.slice(0, 1) === "#")
	if (selector.indexOf("#") === 0) // id选择器
		return document.getElementById(selector.slice(1));
	if (selector.indexOf(".") === 0) // 类选择器
		return byClass(selector.slice(1), context);
	// 元素选择器
	return context.getElementsByTagName(selector);
}

// 解决根据类名查找元素兼容问题的函数
// 参数：
//		className: 待查找元素的类名
//		context: 查找上下文环境的DOM对象
// 返回值：
//		根据类名查找到的元素集合
function byClass(className, context) {
	// 判断是否支持使用 getElementsByClassName() 方法
	if (context.getElementsByClassName) // 返回值为true则表示支持使用
		return context.getElementsByClassName(className);
	/* 不支持使用 getElementsByClassName() 时： */
	// 存放所有查找到的元素的数组
	var result = [];
	// 查找查询上下文环境中的所有元素
	var allTags = context.getElementsByTagName("*");
	// 遍历所有元素，匹配查询是否存在待查询的类名对应的元素
	for (var i = 0, len = allTags.length; i < len; i++) {
		// 获取当前遍历到的页面元素
		var element = allTags[i];
		// 获取当前页面元素的 class 属性值，使用 DOM 对象的 className 属性名
		// 分割为一个一个的类名放到数组中保存
		var classNames = element.className.split(" ");
		// 判断 classNames 中是否存在待查询的类名 className
		if (inArray(className, classNames) !== -1) // 说明当前遍历到的页面元素是要查找的元素其中之一
			result.push(element);
	}

	return result;
}

// 定义函数查找 value 值在数组 array 中的下标
// -1表示不存在
function inArray(value, array) {
	if (Array.prototype.indexOf) // 支持使用数组的 indexOf() 方法
		return array.indexOf(value);

	// 不支持使用 indexOf() 方法时，遍历数组中每个元素
	// 当遍历到的元素和查找元素一致时，返回元素在数组中的下标
	for (var i = 0, len = array.length; i < len; i++) {
		if (array[i] === value)
			return i;
	}

	// 如果数组中不存在查找元素，则返回-1
	return -1;
}

// 封装用于获取/设置CSS样式属性值的函数
// 参数：
//		element: 待获取/设置的DOM元素对象
//		attr: 属性名，用于设置CSS时，attr也可以是对象类型
//		value: 用于设置属性的值
function css(element, attr, value) {
	/*if (window.getComputedStyle) // 支持 getComputedStyle() 方法
		return getComputedStyle(element)[attr];
	return element.currentStyle[attr];*/

	// 获取
	if (typeof attr === "string" && typeof value === "undefined")
		return window.getComputedStyle 
				? getComputedStyle(element)[attr] 
				: element.currentStyle[attr];

	// 设置
	if (typeof attr === "string" && typeof value !== "undefined"){
		element.style[attr] = value;
	} else if (typeof attr === "object") {
		for (var prop in attr){
			element.style[prop] = attr[prop];
		}
	}
}

// 为指定元素添加 css 类名
function addClass(element, className) {
	// element.className += " " + className;
	var classNames = element.className.split(" ");
	var index = inArray(className, classNames);
	if (index !== -1) {
		classNames.splice(index, 1);
	}
	classNames.push(className);

	element.className = classNames.join(" ");
}

// 删除指定元素的 css 类名
function removeClass(element, className) {
	// element.className = element.className.replace(className, "");
	var classNames = element.className.split(" ");
	var index = inArray(className, classNames);
	if (index !== -1) {
		classNames.splice(index, 1);
	}

	element.className = classNames.join(" ");
}

// 显示元素
function show(element) {
	element.style.display = "block";
}

// 隐藏元素
function hide(element) {
	element.style.display = "none";
}

// 绑定事件，注册事件监听，解决 addEventListener 与 attachEvent 兼容
// 参数：
//		element: 待注册事件监听的元素
//		type: 事件类型字符串
// 		callback: 事件响应程序
function on(element, type, callback) {
	if (element.addEventListener) { // 支持使用 addEventListener 方法
		if (type.indexOf("on") === 0) // 表示传递的事件类型字符串以 "on" 开头
			type = type.slice(2);
		element.addEventListener(type, callback, false);
	} else { // 不支持 addEventListener
		if (type.indexOf("on") !== 0)
			type = "on" + type;
		element.attachEvent(type, callback);
	}
}

function off(element, type, callback) {

}

// 获取/设置指定元素在文档中的定位坐标
// 参数：
// 		element: DOM元素对象
//		coordinates: 待设置的坐标定位，对象，包含 top 与 left 两个属性
// 返回值：
//		返回查找到在文档中坐标对象，该对象是包含 top 和 left 两个属性的对象
function offset(element, coordinates) {
	if (!coordinates) { // 未设置坐标，则获取元素在文档中坐标
		var _left = 0, _top = 0;
		while(element) {
			_left += element.offsetLeft;
			_top += element.offsetTop;

			element = element.offsetParent;
		}

		return {
			top : _top,
			left : _left
		};
	} else { // 设置元素在文档中坐标
		// 暂存当前元素父元素
		var curr = element.offsetParent;
		// 求父元素在文档中坐标定位
		var _left = 0, _top = 0;
		while(curr) {
			_left += curr.offsetLeft;
			_top += curr.offsetTop;

			curr = curr.offsetParent;
		}
		// 计算当前元素在其父元素中的定位坐标
		css(element, {
			top : coordinates.top - _top + "px",
			left : coordinates.left - _left + "px"
		});
	}
}

// 获取元素内部宽度
function innerWidth(element) {
	if (css(element, "display") !== "none")
		return element.clientWidth;

	// 未完善
	return parseFloat(css(element, "paddingLeft"))
			+ parseFloat(css(element, "paddingRight"))
			+ parseFloat(css(element, "width"));
}

// 获取元素内部高度
function innerHeight(element) {
	if (css(element, "display") !== "none")
		return element.clientHeight;

	// 未完善
	return parseFloat(css(element, "paddingTop"))
			+ parseFloat(css(element, "paddingBottom"))
			+ parseFloat(css(element, "height"));
}


// 获取元素外部宽度
function outerWidth(element) {
	if (css(element, "display") !== "none")
		return element.offsetWidth;

	// 未完善
	return parseFloat(css(element, "paddingLeft"))
			+ parseFloat(css(element, "paddingRight"))
			+ parseFloat(css(element, "width"))
			+ parseFloat(css(element, "borderLeftWidth"))
			+ parseFloat(css(element, "borderRightWidth"));
}

// 获取元素外部高度
function outerHeight(element) {
	if (css(element, "display") !== "none")
		return element.offsetHeight;

	// 未完善
	return parseFloat(css(element, "paddingTop"))
			+ parseFloat(css(element, "paddingBottom"))
			+ parseFloat(css(element, "height"))
			+ parseFloat(css(element, "borderTopWidth"))
			+ parseFloat(css(element, "borderBottomWidth"));
}

// 保存 cookie
// options 可配置 cookie 保存时参数
// options = {expires:7, path:"/", domain:"", secure:true}
function setCookie(key, value, options) {
	options = options || {};
	var cookie = encodeURIComponent(key) + "=" + encodeURIComponent(value);
	// 判断是否有其它配置
	if (options.expires) { // 失效时间
		var date = new Date();
		date.setDate(date.getDate() + options.expires);
		cookie += ";expires=" + date.toUTCString();
	}

	if (options.path) // 路径
		cookie += ";path=" + options.path;

	if (options.domain) // 域名
		cookie += ";domain=" + options.domain;

	if (options.secure) // 安全链接
		cookie += ";secure";

	// 保存
	document.cookie = cookie;
}

// 删除 cookie
function removeCookie(key, options) {
	options = options || {};
	options.expires = -1;
	setCookie(key, "", options);
}

// 查找 cookie
function getCookie(key) {
	var cookies = document.cookie.split("; ");
	for (var i = 0, len = cookies.length; i < len; i++) {
		var cookie = cookies[i].split("=");
		var name = decodeURIComponent(cookie.shift()); // 当前遍历到cookie的名称
		if (name === key) // 找到 cookie
			return decodeURIComponent(cookie.join("="));
	}

	return null;
}

// 封装运动框架函数
// 参数：
//		element: 待添加运动动画的元素
//		options: 元素运动动画中的运动目标终值对象
//		speed: 设定运动动画总时间
//		fn: 函数，可选参数，表示运动动画执行结束后要继续执行到的函数
function animate(element, options, speed, fn){
	/* 停止当前元素上已有的运动动画计时器 */
	clearInterval(element.timer);
	/* 计算各运动属性的初始值与运动区间值 */
	var _start = {}, _range = {};
	for (var attr in options) {
		_start[attr] = parseFloat(css(element, attr));
		_range[attr] = options[attr] - _start[attr];
	}
	/* 实现运动运动计时器 */
	var _startTime = +new Date(); // 记录启动计时器前的时间
	element.timer = setInterval(function(){
		console.log("animate 中计时器任务")
		// 计算运动消耗时间
		var _elapsed = Math.min(+new Date() - _startTime, speed);
		// 使得每个属性都代入公式计算当前运动动画值
		for (var attr in options) {
			var _result = _elapsed * _range[attr] / speed + _start[attr];
			css(element, attr, _result + (attr === "opacity" ? "" : "px"));
		}
		// 判断是否停止计时器
		if (_elapsed === speed) {
			clearInterval(element.timer);
			// 停止计时器后如果有继续执行到的函数，则调用该函数
			fn && fn();
		}
	}, 1000/60);
}

// 基于 animate() 函数，封装淡入函数
function fadeIn(element, speed, fn) {
	show(element);
	element.style.opacity = 0;
	animate(element, {opacity:1}, speed, fn);
}
// 基于 animate() 函数，封装淡出函数
function fadeOut(element, speed, fn) {
	animate(element, {opacity:0}, speed, function(){
		hide(element);
		fn && fn();
	});
}

// 基于 animate() 函数，封装向上滑动函数
function slideUp(element, speed, fn) {
	var _height = innerHeight(element);
	animate(element, {height: 0}, speed, function(){
		hide(element);
		css(element, "height", _height + "px");
		fn && fn();
	});
}
// 基于 animate() 函数，封装向下滑动函数
function slideDown(element, speed, fn) {
	var _height = innerHeight(element);
	css(element, {
		display : "block",
		height : "0px"
	});
	animate(element, {height: _height}, speed, fn);
}
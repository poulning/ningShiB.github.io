window.onload = function(){
/*********************************************************/
	(function(){

		var hdNav = getElement(document,'.header-nav');
		var targs = hdNav.children;
		var len = targs.length;

		for(var i = 0; i<len; i++){
			var menu = getElement(targs[i],'.header-nav-item-menu-wrap');

			if(menu){
				bind(targs[i],'mouseover', function(){
					this.className = 'header-nav-item-hover';
				});
				bind(targs[i],'mouseout', function(){
					this.className = '';
				});
			}
			
		}

	})();
/*********************************************************/
	(function(){
		var search = getElement(document, '#search');
		var wrap = getElement(search, '.search-wrap');
		var btnList = getElement(search, '.tab-btns');
		var tabBtns = getElement(btnList, 'li');
		var len = tabBtns.length;
		var form = getElement(search, '.search-form');
		var text = getElement(form, '.text');
		var placeholder = getElement(search, '.placeholder');
		var placeholText = getElement(placeholder, '.placehol-text');
		var cameraIco = getElement(search, '.camera-icon');
		var textData = ['踏青帐篷' , '一定不会买错的化妆品',''];
		var timer = null;
		var b = offset(text).bottom;
		var tabH = 0;

		tabBtns[0].className = 'active';
		placeholText.innerHTML = textData[0];

		bind(text, 'keydown',function(){
			clearTimeout(timer);
			var myThis = this;
			timer = setTimeout(
				function(){

					if( myThis.value === ''){
						placeholder.style.display= 'block';
					}else{
						placeholder.style.display= 'none';
					}
				},
				10
			)

		});

		for(var i = 0; i < len; i++){
			tabBtns[i].index = i;

			bind(tabBtns[i], 'click', function(){
				var parent = this.parentNode;
				placeholText.innerHTML = textData[this.index];

				for(var i = 0; i < len; i++){
					removeClass(tabBtns[i], 'active');
					removeClass(tabBtns[i], 'tm-active');
				}

				if(this.innerHTML.substring(0,2) == '天猫'){  //ie6,7下相邻浮动元素换行末尾多出一个空格字符

					addClass(this, 'tm-active');
					addClass(form, 'search-form-tmall');

				}else{

					addClass(this, 'active');
					removeClass(form, 'search-form-tmall');

				}

				if (wrap.className === 'search-fixed') {

					parent.insertBefore(this, parent.children[0]);
				}

				cameraIco.style.display = this.index != 0?'none':'block';

			});
		}

		bind(window, 'scroll', search_fixed);

		bind(btnList, 'mouseover', function(){
			addClass(this, 'tab-btns-hover');

		});

		bind(btnList, 'mouseout', function(){
			removeClass(this, 'tab-btns-hover');
		});

		function search_fixed(){
			var scrollT = document.documentElement.scrollTop|| document.body.scrollTop;
			tabH = btnList.clientHeight;
			if(scrollT > b){
				wrap.className = 'search-fixed';
			}else{
				wrap.className = 'search-wrap';
			}
		}

	})();
/*********************************************************/
	(function(){
		var $Dd = $('.nav-items').find('dd');
		var $icon = $Dd.find('.nav-items-icon');
		var $category = $('.category');
		var $cateItem = $('.category-item');
		var prevDd = null;
		var prevCate = null;
		var timer = null;

		$cateItem.each(function(index){
			$(this).hover(function(){
				clearTimeout(timer);
				$category.css('display', 'block');
			},function(){
				$category.css('display', 'none');
				$(prevDd).removeClass('hover');
			});
		});

		$Dd.each(function(index){

			$(this).hover(function(){

				var myThis = this

				clearTimeout(timer);

				timer = setTimeout(function(){
							$(prevDd).removeClass('hover');
							$(myThis).addClass('hover');
							prevDd = myThis;

							if(prevCate){
								prevCate.css('display', 'none');
							}

							prevCate = $cateItem.eq(index);
							prevCate.css('display', 'block');

						},130);

				$category.stop().fadeIn('100');
				$category.css('display', 'block');

				
			},function(){
				
				clearTimeout(timer);

				timer = setTimeout(function(){
							$(prevDd).removeClass('hover');
							$category.css('display', 'none');
						},50);

			});
		});

		
	})();
/********************************************************/

/***************************/
(function(){

	var playArea = getElement(document, '.pics-play');
	var playList = getElement(playArea, '.pics-list');
	var pics = getElement(playList, 'li');
	var prevBtn = getElement(playArea, '.prev-btn');
	var nextBtn = getElement(playArea,'.next-btn');
	var navBtns = getElement( getElement(playArea, '.promo-nav'), 'span')
	var moveSwitch = hasTrans();
	var transTimer = null;
	var autoTimer = null;
	var w = pics[0].offsetWidth;
	var len = pics.length;
	var btnsLen = navBtns.length;
	var iNow = 1;
	var lastBtn = null;
	
	playList.appendChild(pics[0].cloneNode(true));
	playList.insertBefore(pics[len-1].cloneNode(true), pics[0]);
	len = pics.length;
	playList.style.width = w*len + 'px';
	navBtns[0].className = 'active';
	lastBtn = navBtns[0];
	
	if(moveSwitch){

		playList.style.transform = 'translate3d('+ -w +'px, 0px, 0.1px)';
		
	}else{

		playList.style.left = -w +'px';

	}

	autoPlay();
	bind(prevBtn, 'click', prev());
	bind(nextBtn,'click', next());

	bind(playArea, 'mouseenter', function(){
		prevBtn.style.display = nextBtn.style.display = 'block';
		clearInterval(autoTimer);
	} );

	bind(playArea, 'mouseleave', function(e){
		prevBtn.style.display = nextBtn.style.display = 'none';
		autoPlay();
	} );

	for(var i = 0; i < btnsLen; i++){

		navBtns[i].index = i;

		bind(navBtns[i], 'click', function(){

			lastBtn.className = '';

			if(lastBtn.index >= this.index){
				iNow = this.index+2;
				prev()()

			}else{
				iNow = this.index;
				next()();
			}

		});

	}

	function autoPlay(){
		autoTimer = setInterval(next(), 4000);
	}

	function prev(){
		
		return moveSwitch?function(){
							
							lastBtn.className = '';
							navBtns[(iNow+len-4)%btnsLen].className = 'active';
							lastBtn = navBtns[(iNow+len-4)%btnsLen];

							if(iNow == 0){
								playList.style.transform = 'translate3d(' + -(len-2)*w + 'px, 0px, 0.1px)';
								playList.style.transition = 'none';
								iNow = len-2;
							}

							iNow--;
							transTimer =  setTimeout(function(){
								playList.style.transform = 'translate3d('+(-iNow*w)+'px, 0px, 0.1px)';
								playList.style.transition = '.3s transform';
								clearTimeout(transTimer);
							},10);	

						}:function(){

							lastBtn.className = '';
							navBtns[(iNow+len-4)%btnsLen].className = 'active';
							lastBtn = navBtns[(iNow+len-4)%btnsLen];

							if(iNow == 0){
								playList.style.left = -(len-2)*w + 'px'; 
								iNow = len-2;
							}

							iNow--;
							startMove(playList, {left: -iNow*w}, 300,'easeOut');

						}

	}
	
		
	function next(){
		
		return moveSwitch?function(e){

							lastBtn.className = '';
							navBtns[iNow%btnsLen].className = 'active';
							lastBtn = navBtns[iNow%btnsLen];

							if(iNow == len-1){
								playList.style.transform = 'translate3d(' + -w + 'px, 0px, 0.1px)';
								playList.style.transition = 'none';
								iNow = 1;
							}

							iNow++;
							transTimer =  setTimeout(function(){
								playList.style.transform = 'translate3d('+(-iNow*w)+'px, 0px, 0.1px)';
								playList.style.transition = '.3s transform';
								clearTimeout(transTimer);
							},12);


						}:function(){

							lastBtn.className = '';
							navBtns[iNow%btnsLen].className = 'active';
							lastBtn = navBtns[iNow%btnsLen];

							if(iNow == len-1){
								playList.style.left = -w + 'px'; 
								iNow = 1;
							}

							iNow++;
							startMove(playList, {left: -iNow*w}, 300, 'easeOut');

						}
		
	}


})();


/***********************/
(function(){
	var tab = getElement(document, '.side-tab');
	var tabNav = getElement(tab, '.tab-nav');
	var btns = getElement(tabNav, 'a');
	var len = btns.length;
	var tabMods = getElement(tab, '.tab-mod');

	btns[0].className = 'active';
	tabMods[0].style.display = 'block';

	for(var i = 0; i < len; i++ ){

		bind(btns[i], 'mouseover', function(){

			for(var i = 0; i < len; i++){

				tabMods[i].style.display = 'none';
				
				if(getData(this,'title') == getData(tabMods[i], 'index')){
					
					tabMods[i].style.display = 'block';

				}

			}

			for(var i = 0; i < len; i++){
				btns[i].className = '';
			}

			this.className = 'active';

		});

	}

})();


// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// MIT license
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() {
            callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };
    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
    };
}());

/*************************************************/
(function(){
	var service = getElement(document, '.service');
	var firstEles  = getElement(service, '.first');
	var len = firstEles.length;
	
	for(var i = 0; i < len; i++ ){

		bind(firstEles[i], 'mouseover', function(){

			for(var i = 0; i < len; i++ ){

				removeClass(firstEles[i], 'hover');

			}

			addClass(this, 'hover');

		});

	}

})()

}

function getData(obj, name){

	return obj.dataset? obj.dataset[name.replace(/\-\w?/g, function(str){
																return str.charAt(1).toUpperCase()
															})] : obj.getAttribute('data-'+name);

}

function hasTrans(){
	var browser = ['Webkit', 'Moz', 'O'];
	var style = document.body.style;
	var transition = [];

	for(var i = 0; i < browser.length; i++){
		transition[i] = browser[i] + 'Transition';
	}

	for(var i = 0; i < transition.length; i++){

		if(transition[i] in style){
			return true;
		}
	}
}

function startMove(obj,json,times,fx,fn){

  var Tween = {
    linear: function (t, b, c, d){  //匀速
      return c*t/d + b;
    },
    easeIn: function(t, b, c, d){  //加速曲线
      return c*(t/=d)*t + b;
    },
    easeOut: function(t, b, c, d){  //减速曲线
      return -c *(t/=d)*(t-2) + b;
    },
    easeBoth: function(t, b, c, d){  //加速减速曲线
      if ((t/=d/2) < 1) {
        return c/2*t*t + b;
      }
      return -c/2 * ((--t)*(t-2) - 1) + b;
    },
    easeInStrong: function(t, b, c, d){  //加加速曲线
      return c*(t/=d)*t*t*t + b;
    },
    easeOutStrong: function(t, b, c, d){  //减减速曲线
      return -c * ((t=t/d-1)*t*t*t - 1) + b;
    },
    easeBothStrong: function(t, b, c, d){  //加加速减减速曲线
      if ((t/=d/2) < 1) {
        return c/2*t*t*t*t + b;
      }
      return -c/2 * ((t-=2)*t*t*t - 2) + b;
    },
    elasticIn: function(t, b, c, d, a, p){  //正弦衰减曲线（弹动渐入）
      if (t === 0) { 
        return b; 
      }
      if ( (t /= d) == 1 ) {
        return b+c; 
      }
      if (!p) {
        p=d*0.3; 
      }
      if (!a || a < Math.abs(c)) {
        a = c; 
        var s = p/4;
      } else {
        var s = p/(2*Math.PI) * Math.asin (c/a);
      }
      return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    },
    elasticOut: function(t, b, c, d, a, p){    //正弦增强曲线（弹动渐出）
      if (t === 0) {
        return b;
      }
      if ( (t /= d) == 1 ) {
        return b+c;
      }
      if (!p) {
        p=d*0.3;
      }
      if (!a || a < Math.abs(c)) {
        a = c;
        var s = p / 4;
      } else {
        var s = p/(2*Math.PI) * Math.asin (c/a);
      }
      return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
    },    
    elasticBoth: function(t, b, c, d, a, p){
      if (t === 0) {
        return b;
      }
      if ( (t /= d/2) == 2 ) {
        return b+c;
      }
      if (!p) {
        p = d*(0.3*1.5);
      }
      if ( !a || a < Math.abs(c) ) {
        a = c; 
        var s = p/4;
      }
      else {
        var s = p/(2*Math.PI) * Math.asin (c/a);
      }
      if (t < 1) {
        return - 0.5*(a*Math.pow(2,10*(t-=1)) * 
            Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
      }
      return a*Math.pow(2,-10*(t-=1)) * 
          Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
    },
    backIn: function(t, b, c, d, s){     //回退加速（回退渐入）
      if (typeof s == 'undefined') {
         s = 1.70158;
      }
      return c*(t/=d)*t*((s+1)*t - s) + b;
    },
    backOut: function(t, b, c, d, s){
      if (typeof s == 'undefined') {
        s = 3.70158;  //回缩的距离
      }
      return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    }, 
    backBoth: function(t, b, c, d, s){
      if (typeof s == 'undefined') {
        s = 1.70158; 
      }
      if ((t /= d/2 ) < 1) {
        return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
      }
      return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    },
    bounceIn: function(t, b, c, d){    //弹球减振（弹球渐出）
      return c - Tween['bounceOut'](d-t, 0, c, d) + b;
    },       
    bounceOut: function(t, b, c, d){
      if ((t/=d) < (1/2.75)) {
        return c*(7.5625*t*t) + b;
      } else if (t < (2/2.75)) {
        return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
      } else if (t < (2.5/2.75)) {
        return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
      }
      return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
    },      
    bounceBoth: function(t, b, c, d){
      if (t < d/2) {
        return Tween['bounceIn'](t*2, 0, c, d) * 0.5 + b;
      }
      return Tween['bounceOut'](t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
    },
   	quitOut: function(t, b, c, d){
      return c*((t=t/d-1)*t*t*t*t + 1) + b;
    },
    cubicOut: function(t, b, c, d){
      return c*((t=t/d-1)*t*t + 1) + b;
    }
  } 
   	var iCur = {};
    var startTime = nowTime();
     
    if( typeof times == 'undefined' ){
      times = 200;
      fx = 'linear';
    }
    
    if( typeof times == 'string' ){
      if(typeof fx == 'function'){
        fn = fx;
      }
      fx = times;
      times = 200;
    }
    else if(typeof times == 'function'){
      fn = times;
      times = 200;
      fx = 'linear';
    }
    else if(typeof times == 'number'){
      if(typeof fx == 'function'){
        fn = fx;
        fx = 'linear';
      }
      else if(typeof fx == 'undefined'){
        fx = 'linear';
      }
    }
    
    for(var attr in json){
      iCur[attr] = 0;
      if( attr == 'opacity' ){
        iCur[attr] = Math.round(getStyle(obj,attr)*100);
      }
      else{
        iCur[attr] = parseInt(getStyle(obj,attr));
      }
    }
    

   obj.animId = window.requestAnimationFrame(action);

    function action(){
      
      var changeTime = nowTime();
      //startTime changeTime
      var t = times-Math.max(0, startTime + times - changeTime); //2000 - 0 -> 1-0 -> 0-1
     	
      for(var attr in json){
       
        var value = Tween[fx](t,iCur[attr],json[attr] - iCur[attr],times);

        if(attr == 'opacity'){
          obj.style.filter = 'alpha(opacity='+ value +')';
          obj.style.opacity = value/100;
        }
        else{
          obj.style[attr] = value + 'px';
        }
        
      }
      
      if(t != times){

      	window.requestAnimationFrame(action);

      }else{

      	window.cancelAnimationFrame(obj.animId);

      }
      

      
    }

	
}   
    
function nowTime(){
	return (new Date()).getTime();
} 

function getStyle(obj,attr){
  if(obj.currentStyle){

    return obj.currentStyle[attr];
  }
  else{
    return getComputedStyle(obj,false)[attr];
  }
}



function bind(obj, event, fn){
	if(typeof event != 'string'){
		throw'Uncaught TypeError: event is not a string';
	}
	obj.addEventListener?obj.addEventListener(event,fn,false):obj.attachEvent('on'+event, function(){ fn.call(obj) });

}

function unbind(obj, event, fn){
	if(typeof event != 'string'){
		throw'Uncaught TypeError: event is not a string';
	}
	obj.removeEventListener?obj.removeEventListener(event,fn,false):obj.detachEvent('on'+event, fn);

}

function getElement(obj,str){

	if(typeof str != 'string'){
		throw'Uncaught TypeError: str is not a string';
	}

	var elems = null;

	switch(str.charAt(0)){
		case '#': 
			elems = document.getElementById(str.substring(1));
		break;
		case '.':
			elems = obj.getElementsByClassName?obj.getElementsByClassName(str.substring(1)):getByClassName(obj, str.substring(1));
		break;
		default: 
			elems = obj.getElementsByTagName(str); 
	}

	if(elems.length <= 1){
		return elems[0];
	}

	return elems;

}


function getByClassName(obj, str){
	var elems = null;
	var len = 0;
	var result = [];
	elems = obj?obj.getElementsByTagName('*'):elems;
	len = elems.length;

	for(var i = 0; i < len; i++){
		var className = elems[i].className;
		var classStr = className.split(' ');
		for(var j = 0; j<classStr.length; j++){
			if(classStr[j]==str){
				result.push(elems[i]); 
				break;
			}
		}
	}

	return result;
}


function addClass(obj, name){
	if(obj == null) throw Error('obj is undefined');
	if( typeof name != 'string' ) throw 'Uncaught TypeError: name is not a string';

	obj.className = obj.className + ' ' +name;
}

function removeClass(obj, name){
	if(obj == null) throw 'obj is undefined';
	if( typeof name != 'string' ) throw 'Uncaught TypeError: name is not a string';

	var nameArr = obj.className.split(' ');
	var len = nameArr.length;
	
	for(var i = 0; i < len; i++){

		if(nameArr[i] == name){

			nameArr.splice(i,1);
			i--;                 //splice删除后，后面的元素会自动替代被删除的元素，这步操作可删除重复的class
			
		};
	}
	obj.className = nameArr.join(' ');
}


function offset(obj){
	var result = {left: 0, right: 0, top: 0, bottom: 0};
	var w = obj.offsetWidth;
	var h = obj.offsetHeight;

	while(obj){
		result.left += obj.offsetLeft;
		result.top += obj.offsetTop;

		obj = obj.offsetParent;
	}

	result.right = result.left + w;
	result.bottom = result.top + h;

	return result;
}
(function(b){window.MBP=window.MBP||{};MBP.viewportmeta=b.querySelector&&b.querySelector('meta[name="viewport"]');MBP.ua=navigator.userAgent;MBP.scaleFix=function(){if(MBP.viewportmeta&&/iPhone|iPad/.test(MBP.ua)&&!/Opera Mini/.test(MBP.ua))MBP.viewportmeta.content="width=device-width, minimum-scale=1.0, maximum-scale=1.0",b.addEventListener("gesturestart",MBP.gestureStart,!1)};MBP.gestureStart=function(){MBP.viewportmeta.content="width=device-width, minimum-scale=0.25, maximum-scale=1.6"};MBP.hideUrlBar=
function(){var a=window,c=a.document;if(!location.hash||!a.addEventListener){window.scrollTo(0,1);var b=1,d=setInterval(function(){c.body&&(clearInterval(d),b="scrollTop"in c.body?c.body.scrollTop:1,a.scrollTo(0,b===1?0:1))},15);a.addEventListener("load",function(){setTimeout(function(){a.scrollTo(0,b===1?0:1)},0)},!1)}};MBP.fastButton=function(a,c){this.element=a;this.handler=c;a.addEventListener&&(a.addEventListener("touchstart",this,!1),a.addEventListener("click",this,!1))};MBP.fastButton.prototype.handleEvent=
function(a){switch(a.type){case "touchstart":this.onTouchStart(a);break;case "touchmove":this.onTouchMove(a);break;case "touchend":this.onClick(a);break;case "click":this.onClick(a)}};MBP.fastButton.prototype.onTouchStart=function(a){a.stopPropagation();this.element.addEventListener("touchend",this,!1);b.body.addEventListener("touchmove",this,!1);this.startX=a.touches[0].clientX;this.startY=a.touches[0].clientY;this.element.style.backgroundColor="rgba(0,0,0,.7)"};MBP.fastButton.prototype.onTouchMove=
function(a){(Math.abs(a.touches[0].clientX-this.startX)>10||Math.abs(a.touches[0].clientY-this.startY)>10)&&this.reset()};MBP.fastButton.prototype.onClick=function(a){a.stopPropagation();this.reset();this.handler(a);a.type=="touchend"&&MBP.preventGhostClick(this.startX,this.startY);this.element.style.backgroundColor=""};MBP.fastButton.prototype.reset=function(){this.element.removeEventListener("touchend",this,!1);b.body.removeEventListener("touchmove",this,!1);this.element.style.backgroundColor=""};
MBP.preventGhostClick=function(a,c){MBP.coords.push(a,c);window.setTimeout(function(){MBP.coords.splice(0,2)},2500)};MBP.ghostClickHandler=function(a){for(var c=0,b=MBP.coords.length;c<b;c+=2){var d=MBP.coords[c+1];Math.abs(a.clientX-MBP.coords[c])<25&&Math.abs(a.clientY-d)<25&&(a.stopPropagation(),a.preventDefault())}};b.addEventListener&&b.addEventListener("click",MBP.ghostClickHandler,!0);MBP.coords=[];MBP.splash=function(){b.write('<link rel="apple-touch-startup-image" href="/img/'+(navigator.platform===
"iPad"?"h/":"l/")+'splash.png" />')};MBP.autogrow=function(a,c){function b(){var a=this.scrollHeight;if(a>this.clientHeight)this.style.height=a+3*e+"px"}var d=c?c:12,e=a.currentStyle?a.currentStyle.lineHeight:getComputedStyle(a,null).lineHeight,e=e.indexOf("px")==-1?d:parseInt(e,10);a.style.overflow="hidden";a.addEventListener?a.addEventListener("keyup",b,!1):a.attachEvent("onkeyup",b)}})(document);
window.log=function(){log.history=log.history||[];log.history.push(arguments);if(this.console){arguments.callee=arguments.callee.caller;var a=[].slice.call(arguments);typeof console.log==="object"?log.apply.call(console.log,console,a):console.log.apply(console,a)}};
(function(a){function c(){}for(var d="assert,clear,count,debug,dir,dirxml,error,exception,firebug,group,groupCollapsed,groupEnd,info,log,memoryProfile,memoryProfileEnd,profile,profileEnd,table,time,timeEnd,timeStamp,trace,warn".split(","),b;b=d.pop();)a[b]=a[b]||c})(function(){try{return console.log(),window.console}catch(a){return window.console={}}}());


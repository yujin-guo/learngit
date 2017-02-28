define(['text!module/personal/result.html','css!module/personal/style/personal.css'],function(tpl){
	var controller=function(){
		appView.html(tpl);
	};
	return controller;
});
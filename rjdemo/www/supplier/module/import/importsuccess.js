define(['text!module/import/importSuccess.html','css!module/import/style/import.css'],function(tpl){
	var controller=function(){
		appView.html(tpl);
	}
	return controller;
});
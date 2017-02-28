define(['text!module/addProduct/addSuccess.html','css!module/addProduct/style/add.css'],function(tpl){
	var controller=function(){
		appView.html(tpl);
		$(".add-failed").hide();
	}
	return controller;
});
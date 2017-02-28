/*create by lijinhua*/
define(['text!module/login/login.html','text!module/header/nav.html','js/login2','common','css!module/home/style/style.css?','css!module/login/style/login.css'],function(tpl,nav,login,common){
	var controller=function(){
		var allDatas={
            nav:nav
        };
        appView.html(_.template(tpl,allDatas));
//		appView.html(nav+tpl);
		login(); 
		
	};
	return controller;
});
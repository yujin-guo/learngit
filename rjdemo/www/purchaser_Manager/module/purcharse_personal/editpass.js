define(['text!module/purcharse_personal/editpass.html', 'module/purcharse_personal/personalevent', 'css!module/purcharse_personal/style/personal.css'], function(tpl, event) {
	var controller = function() {

			//模块内容
			$('#right-container').html(tpl);
			
			common.tabFocus("修改密码");
			
			//面包屑导航
			$(".bread").html("<span class='bread-span'><a href='index.html' class='purchase-bread'>管理中心</a></span><span class='bread-span'>&gt;&nbsp;<a href='#personal' class='purchase-bread'>基本信息</a></span><span class='bread-span'>&gt;&nbsp;修改密码</span>");
			event();
		}
	return controller;
});
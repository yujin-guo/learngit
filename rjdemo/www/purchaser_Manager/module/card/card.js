define(['text!module/card/card.html', 'css!module/card/style/card.css'], function(tpl) {
	var controller = function() {
		var callbackCardFun = function(datas) {
			if(datas.code == "0000") {
				if(datas.departmentModels.length){
					datas.flag=true;
				}else{
					datas.flag=false;
				}
				$('#right-container').html(_.template(tpl, datas));
				
				common.tabFocus("经费卡号");
				//面包屑导航
				$(".bread").html("<span class='bread-span'><a href='index.html' class='purchase-bread'>管理中心</a></span><span class='bread-span'>&gt;&nbsp;经费卡列表</span>");
			} else {
				dialog({
					title: '提示',
					modal: true,
					content: datas.message,
					ok: function() {},
					cancel: false,
				}).width(320).show();
			}
			common.tabFocus("经费卡号");
		};
		common.postData(baseUrl + urls.allUrls.getFundCard, {}, callbackCardFun, true);
	}
	return controller;
});
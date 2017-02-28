define(['text!module/product/list.html', 'text!module/header/header02.html', 'text!module/product/common_nav.html', 'js/secondary', 'css!module/product/style/product.css'], function(tpl, header, nav, secondary) {
	var controller = function() {
		appView.html(_.template(header));
		var commonFun = function(listData, callback) {
			common.postData(testUrl + urls.allUrls.getPurcharseList, listData, callback, true);
		};
		var listData = {};

		/*初始化回调函数*/
		var callbackListFun = function(datas) {
			if(datas.code == "0000") {
				if(datas.purchaseApplys) {
					datas.flag = true;
					datas.nav=nav;
					//模块内容
					$('#right-container').html(_.template(tpl,datas));
					secondary();
				}else{
					datas.flag=false;
					datas.nav=nav;
					$('#right-container').html(_.template(tpl,datas));
				}

			} else if(datas.code == "0002") {
				window.location.href = testUrl + urls.allUrls.outLogin;
			}
		};
		commonFun(listData, callbackListFun);

	};
	return controller;
});
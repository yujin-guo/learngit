define(['text!module/productList/details.html', 'css!module/productList/style/details.css'], function(tpl) {
	var controller = function(id) {
		$("body").html('');
		var base = common.serverBaseUrl,
			resultData={},
			url = base +urls.allUrls.getProductInfo, //商品详情
			supplierUrl=base+urls.allUrls.getProviderPerson,//获取供应商基本信息
			callback = function(r) {
				if(r.code = "0000") {
					resultData.details=r.product;
					common.postData(supplierUrl,{},suppCallback,true);
				} else {
					dialog({
						title: "提示",
						modal: true,
						content: r.message,
						ok: function() {},
						cancel: false
					})
				}
			},
			suppCallback=function(r){
				if(r.code = "0000") {
					resultData.supp=r;
					$("body").html(_.template(tpl, resultData));
					$("body").append('<div id="mask" style="position:absolute;top:0;z-index:100;width:100%;height:100%;background-color:rgba(204,204,204,0.1)"></div>')
					$("#mask").height($(document).height());
				} else {
					dialog({
						title: "提示",
						modal: true,
						content: r.message,
						ok: function() {},
						cancel: false
					})
				}
			};
		common.postData(url, {sn: id}, callback, true);
	}
	return controller;
});
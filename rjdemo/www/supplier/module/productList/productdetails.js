define(['text!module/productList/productDetails.html', 'css!module/productList/style/productDetails.css', "pagination"], function(tpl) {
	var controller = function(id) {
		var base = common.serverBaseUrl;
		var url = base + "/api/product/getProductInfo"; //商品列表
		var callback = function(r) {
			if(r.code = "0000") {
				var data = {
					p: r.product,
					url: common.imgUrl
				}
				appView.html(_.template(tpl, data));
				$(".product-details-desc img").css("height","");//显示富文本上传的图片显示尺寸
			} else if(r.code == "1020") {
				$("#out-provider").click();
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
		common.postData(url, {
			sn: id
		}, callback, true);
	}
	return controller;
});
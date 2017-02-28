define(['text!module/import/importDesc.html', 'css!module/import/style/import.css'], function(tpl) {
	var controller = function() {
		var url = common.serverBaseUrl + "/api/product/getProductInputSupport",
			datas = {}, //返回数据
			brandData = {
				type: "BRAND"
			},
			categoryData = {
				type: "CATEGORY"
			},
			mouldData = {
				type: "MOULD"
			},
			brandCallback = function(r) {
				if(r.code == "0000") {
					datas.brandPath = r.path;
					common.postData(url, categoryData, categoryCallback, true);
				} else {
					dialog({
						title: '提示',
						modal: true,
						content: r.message,
						ok: function() {},
						cancel: false,
					}).width(320).show();
				}
			},
			categoryCallback = function(r) {
				if(r.code == "0000") {
					datas.categoryPath = r.path;
					common.postData(url, mouldData, mouldCallback, true);
				} else {
					dialog({
						title: '提示',
						modal: true,
						content: r.message,
						ok: function() {},
						cancel: false,
					}).width(320).show();
				}
			},
			mouldCallback = function(r) {
				if(r.code == "0000") {
					datas.mouldPath = r.path;
					appView.html(_.template(tpl, datas));
				} else {
					dialog({
						title: '提示',
						modal: true,
						content: r.message,
						ok: function() {},
						cancel: false,
					}).width(320).show();
				}
			}
		common.postData(url, brandData, brandCallback, true);

	}

	return controller;
});
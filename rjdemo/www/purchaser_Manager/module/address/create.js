define(['text!module/address/create.html', 'js/libs/area', 'module/address/formValidate', 'css!module/address/style/address.css?', 'css!module/purcharse_personal/style/personal.css?'], function(tpl, area, event) {
	var controller = function() {
		//console.log(urls.allUrls.getSimpleAddress);
		var key = common.getQueryString("keyword");
		var editId = common.getQueryString("id");
		var datas = {
			id: editId
		};
		var createData = {
			consignee: '',
			address: '',
			mobile: '',
			telephone: ''
		};

		var editFun = function(datas) {
			if(datas.code == "0000") {

				/*载入页面*/
				$('#right-container').html(_.template(tpl, datas));
				
				common.tabFocus("收货地址");
				
				//面包屑导航
				$(".bread").html("<span class='bread-span'><a href='index.html' class='purchase-bread'>管理中心</a></span><span class='bread-span'>&gt;&nbsp;<a href='#list' class='purchase-bread'>收货地址</a></span><span class='bread-span'>&gt;&nbsp;修改收货地址</span>")
				event();
				_init_area();
				
				$("#s_province").val(datas.province);
				change(1);
				$("#s_city").val(datas.city);
				change(2);
				$("#s_county").val(datas.district);
			} else {
				dialog({
					title: '提示',
					modal: true,
					content: datas.message,
					ok: function() {},
					cancel: false,
				}).width(320).show();
			}
		};
		switch(key) {
			case 'create':
				$('#right-container').html(_.template(tpl, createData));

				//面包屑导航
				$(".bread").html("<span class='bread-span'>管理中心</span><span class='bread-span'>&gt;&nbsp;<a href='#list' class='purchase-bread'>收货地址</a></span><span class='bread-span'>&gt;&nbsp;新建收货地址</span>");
				$('.icon02').html('新增收货地址');
				event();
				//opt0=["广东省","广州市","市、县级市"];
				_init_area();

				$("#s_province").val("广东省");
				change(1);
				$("#s_city").val("广州市");
				change(2);
				$("#s_county").val("市、县级市");
				break;
			case 'edit':
				common.postData(baseUrl + urls.allUrls.getSimpleAddress, datas, editFun, true);
				break;
			default:
				dialog({
					title: '提示',
					modal: true,
					content: '页面出错',
					ok: function() {},
					cancel: false,
				}).width(320).show();
		}
	};
	return controller;
});
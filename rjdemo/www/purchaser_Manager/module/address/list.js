define(['text!module/address/list.html', 'common', 'css!module/address/style/address.css?'], function(tpl, common) {
	var controller = function() {
		var addressFun = (function() {
			var addrDatas = {};
			var getAddressList = urls.allUrls.getAddressList;
			var deleteAddress = urls.allUrls.deleteAddress;
			var setDefaultAddress = urls.allUrls.setDefaultAddress;
			var callbackAddrFun = function(datas) {
				if(datas.code == "0000") {
					
					$('#right-container').html(_.template(tpl, datas));
					
					common.tabFocus("收货地址");
					//面包屑导航
					$(".bread").html("<span class='bread-span'><a href='index.html' class='purchase-bread'>管理中心</a></span><span class='bread-span'>&gt;&nbsp;收货地址</span>");

					/*删除收货地址*/
					var callbackConFun = function(datas) {
						if(datas.code == "0000") {
							common.postData(baseUrl + getAddressList, addrDatas, callbackAddrFun, true);
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
					$(".delete-address").on("click", function() {
						if($(".table-div tbody tr").length>1) {
							if(confirm("是否删除该地址？")) {
								var DelData = {
									id: parseInt($(this).prevAll(".address-id").val())
								};
								common.postData(baseUrl + deleteAddress, DelData, callbackConFun, true);
							} else {
								return false;
							}
						} else {
							dialog({
                                title: '提示',
                                modal: true,
                                content: "不能清空地址",
                                ok: function() {},
                                cancel: false,
                            }).width(320).show();
						}
					});

					/*设置默认地址*/
					$(".set-default").on("click", function() {
						var DefaultData = {
							id: parseInt($(this).prevAll(".address-id").val())
						};
						common.postData(baseUrl + setDefaultAddress, DefaultData, callbackConFun, true);
					});
				} else {
					dialog({
                        title: '提示',
                        modal: true,
                        content: datas.message,
                        ok: function() {
                            window.location.href='../purchaser/index.html';
                        },
                        cancel: false,
                    }).width(320).show();
				}
				common.tabFocus("收货地址");
			};
			return {
				addressMethod: function() {
					common.postData(baseUrl + getAddressList, addrDatas, callbackAddrFun, true);
				}
			}
		})();
		addressFun.addressMethod();
	};
	return controller;
});
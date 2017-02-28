define(['text!module/transaction/detail.html', 'text!module/transaction/address.html', 'module/transaction/transaction', 'module/transaction/laydate.dev', 'js/libs/area', 'js/libs/jquery.validate.min', 'css!module/transaction/style/transaction.css?'], function(tpl, addrHTML, deal, area) {
	var controller = function() {
		//清掉邮箱地址
		$.cookie("saveSuppLoginUrl", '', {
			path: "/"
		});

		var detailData = {
			id: parseInt(common.getQueryString("id"))
		};
		var callbackDetail = function(datas) {
			if(datas.code == "0000") {
				appView.html(_.template(tpl, datas));
				deal();

				//菜单栏tab选中
				common.tabFocus("订单管理");

				function callbackFun(updateDatas) {
					if(updateDatas.code == '0000') {
						window.location.reload();
					} else {
						dialog({
							title: '提示',
							modal: true,
							content: updateDatas.message,
							ok: function() {},
							cancel: false,
						}).width(320).show();
					}
				};

				$(".link-event").on("click", function() {
					$(".info-wrap").addClass("show");
				});

				$(".transaction-center-right").on("click", ".sure-link", function(event) {

					/*确认订单*/
					var orderData = {
						id: parseInt(datas.orderInfo.order.orderId),
						orderOperate: "ORDERCONFIRM"
					};

					/*拒绝取消订单*/
					var refuseData = {
						id: parseInt(datas.orderInfo.order.orderId),
						orderOperate: "REFUSECANCEL",
						refuseReason: $("#refuse-textarea").val()
					};

					/*同意取消订单*/
					var agreeData = {
						id: parseInt(datas.orderInfo.order.orderId),
						orderOperate: "AGREECANCEL"
					};

					switch($(this).attr("data-flag")) {
						case 'order-sure':
							common.postData(baseUrl + urls.allUrls.updateOrderStatus, orderData, callbackFun, true);
							break;
						case 'order-refuse':
							if(!$('#refuse-textarea').val()) {
								$('#refuse-textarea').focus();
								return false;
							} else {
								common.postData(baseUrl + urls.allUrls.updateOrderStatus, refuseData, callbackFun, true);
							}
							break;
						case 'order-cancel':
							common.postData(baseUrl + urls.allUrls.updateOrderStatus, agreeData, callbackFun, true);
							break;
					}

					event.stopPropagation();

				});

				/*发货信息验证*/
				$("#deliver-form").validate({
					rules: {
						deliverorder: {
							required: true
						},
						deliverNum: {
							required: true
						}
					},
					messages: {
						deliverorder: {
							required: null
						},
						deliverNum: {
							required: null
						}
					},
					submitHandler: function() {
						/*确认发货*/
						var deliverData = {
							id: parseInt(datas.orderInfo.order.orderId),
							orderOperate: "DELIVERY",
							deliveryDate: $("#deliver-date").val(),
							deliveryNo: $("#deliver-num").val(),
							deliveryInfo: $("#deliver-decr").val()
						};
						common.postData(baseUrl + urls.allUrls.updateOrderStatus, deliverData, callbackFun, true);
					}
				});

				//修改地址
				$("#address-change").on("click", function() {
					common.postData(baseUrl + urls.allUrls.getAddressInfo, {
						id: datas.orderInfo.order.addressid
					}, updateAddress, true);
				});

				//地址编辑
				function updateAddress(a) {
					if(a.code == "0000") {
						if(a.consignee == undefined) {
							a.consignee = null;
						}
						if(a.address == undefined) {
							a.address = null;
						}
						if(a.mobile == undefined) {
							a.mobile = null;
						}
						if(a.telephone == undefined) {
							a.telephone = null;
						}
						if(a.province == undefined) {
							a.province = null;
						}
						if(a.city == undefined) {
							a.city = null;
						}
						if(a.district == undefined) {
							a.district = null;
						}
						$("#address-div").html(_.template(addrHTML, a));
						$(".address-change-wrap").addClass("show");
						_init_area();
						if(a.province) {
							$("#s_province").val(a.province);
							change(1);
							$("#s_city").val(a.city);
							change(2);
							$("#s_county").val(a.district);
						}

						$(".cancel-address").on("click", function() {
							$(".address-change-wrap").removeClass("show");
						});

						//修改地址
						$("#addr-change-form").validate({
							rules: {
								addrname: {
									required: true
								},
								addrpro: {
									required: true
								},
								addrcity: {
									required: true
								},
								addrarea: {
									required: true
								},
								addrtextarea: {
									required: true
								},
								addrmobile: {
									required: true
								},
								phone: {
									digits: true
								}
							},
							messages: {
								addrname: {
									required: null
								},
								addrpro: {
									required: null
								},
								addrcity: {
									required: null
								},
								addrarea: {
									required: null
								},
								addrtextarea: {
									required: null
								},
								addrmobile: {
									required: null
								},
								phone: {
									digits: null
								}
							},
							highlight: function(element, error) {
								$(element).css("border-color", "#ff5555");
							},
							submitHandler: function() {
								$(".address-change-wrap").removeClass("show");

								var addressData = {
									id: parseInt(common.getQueryString("id")),
									consignee: $.trim($("#addr-change-name").val()),
									province: $("#s_province").val(),
									city: $("#s_city").val(),
									district: $("#s_county").val(),
									address: $("#addr-change-textarea").val(),
									mobile: $("#addr-change-mobie").val()
								};
								common.postData(baseUrl + urls.allUrls.changeAddress, addressData, callbackFun, true);
							}
						});
					} else {
						dialog({
							title: '提示',
							modal: true,
							content: a.message,
							ok: function() {},
							cancel: false,
						}).width(320).show();
					}
				}

				//时间控件
				if(datas.orderInfo.order.status == 4) {
					laydateTran({
						elem: '#deliver-date',
						choose: function(dates) {
							$("#begin-time").attr("disabled", false);
						}
					});
				}
			} else if(datas.code == "1020") {
				$.cookie("saveSuppLoginUrl", window.location.href, {
					expires: 0.004,
					path: "/"
				});
				common.getOutFun();
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
		common.postData(baseUrl + urls.allUrls.getOrderDetail, detailData, callbackDetail, true);
	};
	return controller;
});
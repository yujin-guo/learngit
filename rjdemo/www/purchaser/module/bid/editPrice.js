define(["text!module/bid/editPrice.html", "text!module/header/bidHeader.html", "text!module/header/bidnavigation.html", "text!module/bid/comLoad.html", "text!module/bid/goods.html", "text!littleLogin.html", "module/bid/littleLogin", 'js/libs/jquery.validate.min', 'js/libs/additional.methods', "css!module/bid/style/bid.css?", "css!style/littleLogin.css?"], function(tpl, header, nav, comHtml, goodsHtml, littleLogin, load) {
	var controler = function() {
		var bidBaseUrl = common.bidBaseUrl;
		var bidUrl = bidBaseUrl + urls.allUrls.getBidCommodityDetail;
		var comUrl = bidBaseUrl + urls.allUrls.getSuppCommodity;
		var hUrl = bidBaseUrl + urls.allUrls.hangUpBid;
		var giveUpUrl = bidBaseUrl + urls.allUrls.updateBidPrice;
		var getCommondityUrl = bidBaseUrl + urls.allUrls.getBidCommodity;
		var fileUrl = bidBaseUrl + urls.allUrls.fileUPload;
		var bidId = common.getQueryString("id");
		var unit = common.getQueryString("unit");

		var data = {
			id: bidId
		}

		common.postData(bidUrl, data, getListCallbackFun, true, true, function(response) {
			return response.isLogin == false;
		});

		function conditionCallback(d) {
			if(d.resultCode === "0000") {
				if(d.entities != undefined || d.entities.length) {
					d.flag = true;
					d.nav = header + nav;
					$("#bid-content-table").html(_.template(loadHtml, d));
				}
			} else {
				dialog({
					title: '提示',
					modal: true,
					content: d.message,
					ok: function() {},
					cancel: false,
				}).width(320).show();

			}
		}

		function getListCallbackFun(datas) {
			if(datas.resultCode === "0000") {
				datas.nav = header + nav;
				//datas.unit = unit;
				datas.little = littleLogin;
				$("#container").html(_.template(tpl, datas));

				//采购人/供应商/未登录的导航头部判断
				if($.cookie('id') != undefined && $.cookie('id') != '' && $.cookie('id') != null) {
					$("#f").css({
						"display": "inline-block"
					});
					$("#s").css({
						"display": "none"
					});
				} else {
					$("#f").css({
						"display": "none"
					});
					$("#s").css({
						"display": "inline-block"
					});
				}

				if(datas.bid) {
					var productSn = datas.bid.sn;

					//下载报价链接
					$("#price-path").prop("href", bidBaseUrl + datas.bid.attachmentUrl);
				} else {
					datas.bid = null;
				}

				//下载附加链接
				$("#load-link").prop("href", bidBaseUrl + datas.item.fileUrl);

				//上传附加
				common.bidUpload(fileUrl, datas);

				//竞价报价总价
				var to = null;
				$("#count").on("blur", function() {
					var p = $.trim($(this).val());
					if(!/^[1-9]*[0-9]*$/.test(p) || !p) {
						//$(this).val("请输入正整数");
						$("#bid-accont-text").html('竞价采用报总价的方式，报价金额不能超过总销售价。');
					} else {
						var y = parseFloat($.trim($("#bid-account").text()).split('元')[0]);
						if(y) {
							to = (parseFloat(p) * y).toFixed(2);
							$("#bid-accont-text").html('≤&nbsp;&nbsp;商品总价：<span class="active test" style="font-size: 16px;">' + to +
								'</span>&nbsp;元');
						} else {
							return false;
						}
					}
				});

				//提交后未选择商品的情形
				$("#price").on("focus", function() {
					var p = parseFloat($.trim($("#count").val()));
					if(p) {
						var y = parseFloat($.trim($("#bid-account").text()).split('元')[0]);
						if(y) {
							to = (p * y).toFixed(2);
							$("#bid-accont-text").html('≤&nbsp;&nbsp;商品总价：<span class="active test" style="font-size: 16px;">' + to +
								'</span>&nbsp;元');
						} else {
							return false;
						}
					} else {
						$("#bid-accont-text").html('竞价采用报总价的方式，报价金额不能超过总销售价。');
					}
				});

				/*选择商品弹出*/
				$("#bid-price-common").on("click", "#bid-chose-com", function() {
					common.postData(comUrl, {}, comCallback, true);

					function comCallback(d) {
						if(d.resultCode == "0000") {
							$("#com-list").html(_.template(comHtml, d));
							$(".chose-product-window").css("display", "block");

							//选择商品
							$("#com-list").on("click", "#com-tbody tr", function() {
								$(this).addClass("bid-selected").siblings("tr").removeClass("bid-selected");
								productSn = $(this).children("input[type=hidden]").val();
							});

							//搜索
							$(".bid-search-btn").on("click", function() {
								//if($.trim($(".bid-search-box").val())) {
								var t = {
									search: $.trim($(".bid-search-box").val())
								};
								common.postData(comUrl, t, searchCallback, true);

								function searchCallback(r) {
									if(r.resultCode == "0000") {
										var com = '<% _.each(products,function(R){%><tr><td class="bid-window-td01"><%= R.code %></td><td class="bid-window-td02"><%= R.name %></td><td class="bid-window-td03"><%= R.price %></td><input type="hidden" value="<%= R.id %>" /></tr><%}) %>';
										$("#com-tbody").html(_.template(com, r));
									}
								}
								//} else {
								$(".bid-search-box").focus();
								//}
							});

							$("#bid-com-search").on("keydown", function(e) {
								if(e.keyCode == 13) {
									$(".bid-search-btn").click();
								}
							});
						} else {
							dialog({
								title: '提示',
								modal: true,
								content: d.message,
								ok: function() {},
								cancel: false,
							}).width(320).show();
						}
					}

				});

				//取消商品弹出
				$("#com-list").on("click", ".control-link02", function() {
					$(".chose-product-window").css("display", "none");
					productSn = datas.bid.sn;
				});

				//确定商品
				$("#com-list").on("click", ".control-link01", function() {
					function changeComCallback(d) {
						if(d.resultCode == "0000") {
							$("#bid-price-common").html(_.template(goodsHtml, d));
							var c = parseFloat($.trim(d.price).split('元')[0]);
							var cp = $.trim($("#count").val())
							if(cp) {
								var cc = (parseFloat(cp) * c).toFixed(2);
								$("#bid-accont-text").html('≤&nbsp;&nbsp;商品总价：<span class="active test" style="font-size: 16px;">' + cc +
									'</span>&nbsp;元');
							}
						} else {
							$("#out").click();
						}
					}
					if(productSn) {
						common.postData(getCommondityUrl, {
							sn: productSn
						}, changeComCallback, true);
					}
					$(".chose-product-window").css("display", "none");
				});

				$(".price-wrap-info-input").bind({
					focus: function() {
						$(this).css("border-color", "#008cd0");
					},
					blur: function() {
						$(this).css("border-color", "#ccc");
					}
				});

				//公共回调
				function priceCallback(d) {
					if(d.resultCode == "0000") {
						window.location.href = "#biddetail?id=" + bidId;
					} else if(d.resultCode == "3000") {
						dialog({
							title: '报价提示',
							modal: true,
							content: d.msg,
							okValue: "关闭窗口",
							cancelValue: "修改商品库存",
							ok: function() {},
							cancel: function() {
								window.open("../supplier/index.html#add/" + productSn);
							},
						}).width(320).show();
					} else {
						dialog({
							title: '提示',
							modal: true,
							content: d.msg,
							ok: function() {},
							cancel: false,
						}).width(320).show();
					}
				}

				//提交竞价
				$("#bid-price-form").validate({
					rules: {
						bidcount: {
							required: true,
							checkDigits: true,
							max: 1000
						},
						bidprice: {
							required: true,
							checkPositive: true,
							max: 10000000
						},
						bidday: {
							required: true,
							checkDigits: true,
							max: 100
						},
						advan: {
							maxlength: 2000
						}
					},
					messages: {
						bidcount: {
							required: "此项为必填项",
							max: "商品数量不能大于1000"
						},
						bidprice: {
							required: "此项为必填项",
							max: "总报价不能大于10000000元"
						},
						bidday: {
							required: "此项为必填项",
							max: "发货天数不能大于100天"
						},
						advan: {
							maxlength: "字数不能大于2000字"
						}
					},
					errorPlacement: function(error, element) {
						$(element).nextAll(".bid-error").html($(error));
					},
					highlight: function(element, errorClass) {
						$(element).css({
							"border-color": "#ff5555"
						});
					},
					submitHandler: function() {
						if(productSn == undefined || productSn == null || productSn == '') {
							dialog({
								title: '提示',
								modal: true,
								content: "请选择您需要竞价的商品",
								ok: function() {},
								cancel: false,
							}).width(320).show();
						} else if(parseFloat($.trim($("#price").val())) > parseFloat(to)) {
							dialog({
								title: '提示',
								modal: true,
								content: "竞价报价不能大于商品总报价",
								ok: function() {
									$("#price").focus();
								},
								cancel: false,
							}).width(320).show();
						} else {
							var h = {
								id: datas.bid.id,
								productSn: productSn,
								itemId: bidId,
								count: $.trim($("#count").val()),
								price: $.trim($("#price").val()),
								deliveryTime: $.trim($("#day").val()),
								attachmentUrl: $.trim($("#file-path").attr("data-id")),
								remark: $.trim($("#adv").val())
							};
							common.postData(hUrl, h, priceCallback, true);
						}
					}
				});

				//登录
				$("#bid-login").on("click", function() {
					$(".login-litte-wrap,.login-litte-content").show();
				});
				$(".login-litte-wrap").on("click", function() {
					$(".login-litte-wrap,.login-litte-content").hide();
				});
				if(datas.isLogin == false) {
					load();
				}
			} else {
				dialog({
					title: '提示',
					modal: true,
					content: datas.message,
					ok: function() {},
					cancel: false,
				}).width(320).show();

			}
		}

	};
	return controler;
});
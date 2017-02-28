define(['text!module/purcharse_list/detail.html', 'js/libs/clamp', 'css!module/home/style/style.css?', 'css!module/purcharse_list/style/purcharselist.css?'], function(tpl) {
	var controller = function() {
		//清掉邮箱地址
		$.cookie("saveLoginUrl", '', {
			path: "/"
		});

		var keyWord = common.getQueryString("id");
		var alldatas = {
			id: parseInt(keyWord)
		};
		var saveCardUrl = baseUrl + urls.allUrls.addCard;

		//经费卡信息
		function callbackCardFun(dataC) {
			if(dataC.code === "0000") {
				common.postData(baseUrl + urls.allUrls.getPurcharseDetail, alldatas, callbackFun, true);

				//采购申请单详情
				function callbackFun(datas) {
					if(datas.code == "0000") {
						datas.cardList = dataC;
						var fmoney = function(s, n) {
							n = n > 0 && n <= 20 ? n : 2;
							s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
							var l = s.split(".")[0].split("").reverse(),
								r = s.split(".")[1];
							t = "";
							for(i = 0; i < l.length; i++) {
								t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
							}
							return t.split("").reverse().join("") + "." + r;
						};
						var m = fmoney(datas.purchaseApply.fprevbudgetamount, 2);
						var data = {
							caigoutotalmoney: m
						}
						$.extend(datas, data);
						$('#right-container').html(_.template(tpl, datas));
						/*var module = $(".card-div")[0];
						$clamp(module, {
							clamp: 3
						});*/

						common.tabFocus("我的采购");

						//面包屑导航
						$(".bread").html("<span class='bread-span'><a href='index.html' class='purchase-bread'>管理中心</a></span><span class='bread-span'>&gt;&nbsp;<a href='#purcharselist' class='purchase-bread'>我的采购</a></span><span class='bread-span'>&gt;&nbsp;采购单详情</span>");

						/*修改经费卡*/
						$(".card-choose").unbind().on("click", function() {
							$(".purchase-card-wrap,.card-wrap").addClass("show");
						});

						//关闭经费卡
						$(".card-head-icon").unbind().on("click", function() {
							$(".purchase-card-wrap,.card-wrap").removeClass("show");
						});

						//选择经费卡
						$(".class-card-icon").unbind().on("click", function() {
							var that = $(this);
							if(that.hasClass("card-flag")) {
								that.removeClass("card-flag");
								that.addClass("choose");
								that.nextAll(".card-num").addClass("choose");

								//
								var str = '<span><span class="has-choose-card">' + that.nextAll(".card-num").text() + '</span><input class="card-hidden' + that.nextAll(".card-hidden").attr("data-id") + '" type="hidden" value="' + that.nextAll(".card-hidden").val() + '" data-id="' + that.nextAll(".card-hidden").attr("data-id") + '" data-num="' + that.nextAll(".card-num").text() + '" /></span>';
								$(".card-has").append(str);
							} else {
								that.addClass("card-flag");
								that.removeClass("choose");
								that.nextAll(".card-num").removeClass("choose");

								//
								var cardId = that.nextAll(".card-hidden").attr("data-id");
								var classCard = $(".card-has").find(".card-hidden" + cardId).parent().remove();
							}
						});

						//保存经费卡
						$(".card-sure-link").unbind().on("click", function() {
							var hasCard = $(".card-has input[type='hidden']");
							var fundCards = [];
							if(hasCard.length) {
								for(var i = 0; i < hasCard.length; i++) {
									var d = {
										id: parseInt($(hasCard[i]).attr("data-id")),
										cardNo: $.trim($(hasCard[i]).attr("data-num")),
										name: $(hasCard[i]).val()
									}
									fundCards.push(d);
								}
								var cardData = {
									fundCards: fundCards,
									id: parseInt(keyWord)
								}
								$(".purchase-card-wrap,.card-wrap").removeClass("show");
								common.postData(baseUrl + urls.allUrls.updatePurchaseCard, cardData, callbackUpFun, true);
							} else {
								dialog({
									title: '提示',
									modal: true,
									content: "请选择经费卡",
									ok: function() {},
									cancel: false,
								}).width(320).show();
							}
						});

						function callbackUpFun(dataC) {
							if(dataC.code == "0000") {
								common.postData(baseUrl + urls.allUrls.getPurcharseDetail, alldatas, callbackFun, true);
							} else {
								dialog({
									title: '提示',
									modal: true,
									content: dataC.message,
									ok: function() {},
									cancel: false,
								}).width(320).show();
							}
						}

						//申请驳回加入购物车
						$("#list-detail-addcard").unbind().on("click", function() {
							var addCardData = {
								shoppingCarts: [],
								isSet: false
							};
							$.each(datas.purchaseApplyDetails, function(key, value) {
								var cd = {
									productSn: value.sn.toString(),
									amount: 1
								}
								addCardData.shoppingCarts.push(cd);
							});

							function callback(r) {
								if(r.code == "0000") {
									dialog({
										title: '提示',
										modal: true,
										content: '商品已成功加入购物车',
										ok: function() {},
										cancel: false,
									}).width(320).show();

									//监听购物车数量
									common.postData(baseUrl + urls.allUrls.getCartList, {
										showData: false
									}, function(d) {
										if(d.total) {
											$(".basket-num").html("(" + d.total + ")");
										}
									}, true);
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
							common.postData(saveCardUrl, addCardData, callback, true)
						});

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
			} else if(dataC.code == "1020") {
				$.cookie("saveLoginUrl", window.location.href, {
					expires: 0.004,
					path: "/"
				});
				common.getOutFun();

			} else {
				dialog({
					title: '提示',
					modal: true,
					content: dataC.message,
					ok: function() {},
					cancel: false,
				}).width(320).show();
			}
		}
		common.postData(baseUrl + urls.allUrls.getPurchaseCardList, alldatas, callbackCardFun, true);
	};
	return controller;
});
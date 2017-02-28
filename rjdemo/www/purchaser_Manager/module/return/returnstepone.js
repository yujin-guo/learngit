define(['text!module/return/returnStepone.html', 'text!module/header/header01.html', 'css!module/return/style/return.css'], function(tpl, header) {
	var controller = function() {
		//清掉邮箱地址
		$.cookie("saveLoginUrl", '', {
			path: "/"
		});

		var base = common.serverBaseUrl,
			data, //ajax获得的数据
			url = base + "/api/order/getOrderInfo", //订单详情页地址
			returnUrl = base + "/api/order/getReturnInfo", //退货单详情地址
			data = {
				id: decodeURIComponent(common.getQueryString("orderId")),
			},
			returnOrderId = decodeURIComponent(common.getQueryString("returnOrderId")), //修改退货申请需要的退货id
			callback = function(r) {
				if(r.code == "0000") {
					data = {
						header: header,
						main: r.orderInfo.order,
						details: r.orderInfo.orderDetails,
						id: decodeURIComponent(common.getQueryString("itemId")),
					}
					appView.html(_.template(tpl, data));
					$(".content-container").hide(); //引入的头部面包屑隐藏
					returnReason();
					if(returnOrderId) {
						returnInfo();
					}
				} else if(r.code == "1020") {
					$.cookie("saveLoginUrl", window.location.href, {
						expires: 0.004,
						path: "/"
					});
					common.getOutFun();
				}
			};
		common.postData(url, data, callback, true);
		//修改退货详情时信息加载
		function returnInfo() {
			var returnCallback = function(r) {
				if(r.code == "0000") {
					$(".return-info-reason").text(r.returnReason);
					$(".return-info-apply-number").val(r.quantity);
					$(".return-info-apply-desc").val(r.remark);
					var imgs = '<%_.each(r.goodsReturnImages,function(i){%><a href="<%=i.imageUrl%>" target="_blank" style="position:relative"><img src="<%=i.imageUrl%>" class="add-column-img" style="margin-right:10px" ><span class="close-photo">X</span></a><%})%>';
					$("#addImage").append(_.template(imgs, {
						r: r
					}))
					$(".close-photo").bind("click", function(e) {
						$(this).parent("a").remove();
						e.preventDefault();
					})
				}
			}
			common.postData(returnUrl, {
				id: returnOrderId
			}, returnCallback, true);
		}

		function returnReason() {
			/*cookie信息*/
			if($.cookie('id') != undefined && $.cookie('id') != '' && $.cookie('id') != null) {
				$("#user-nav").append("<a href='../purchaser_Manager/index.html' id='user-name'>" + $.cookie('username') +
					"</a><a href='javascript:void(0)' class='pd-lf-8' id='out'>退出</a>")
				if($("#login")) {
					$("#login").remove();
				}
			} else {
				$("#user-nav").append("<a href='#login' id='login'>登录</a><em class='pd-lf-10 pd-rg-10'>|</em><a href='#providerfirst?key=login'>供应商注册</a>");
			}
			/*退出登录*/
			$("#out").unbind().on("click", function() {
				common.getOutFun();
			});
			/* 收藏本页 */
			$("#shoucang").bind("click", function() {
				var title = document.title;
				var URL = document.URL;
				try {
					window.external.addFavorite(URL, title); //ie
				} catch(e) {
					try {
						window.sidebar.addPanel(title, URL, ""); //firefox
					} catch(e) {
						dialog({
							title: '提示',
							modal: true,
							content: '加入收藏失败，请使用Ctrl+D进行添加',
							ok: function() {},
							cancel: false,
						}).width(320).show(); //chrome opera safari
					}
				}
			});
			//面包屑返回退货单
			$(".return-list").bind("click", function() {
					window.location.href = "#returnlist";
					window.location.reload();
				})
				//退货说明
			$(".return-info-apply-desc").keyup(function() {
					var spec = $(this).val();
					$("#returnWords").html(spec.length);
					if(spec.length > 200) {
						$(this).css({
							'border-color': 'red'
						})
					} else {
						$(this).css({
							'border-color': '#e4e4e4'
						})
					}
				})
				//退货原因点击效果
			$(".return-info-apply-reason").bind("click", function() {
				$(this).find("ul").slideToggle();
			})
			$(".return-info-apply-reason ul li").bind("click", function() {
					var text = $(this).text();
					$(this).parent("ul").siblings("p").text(text)
				})
				//退货申请
			$(".return-apply-btn-submit").bind("click", function() {
					if($(".return-info-reason").text() == "请选择退货原因" || $(".return-info-apply-number").val() == "" || $(".return-info-apply-desc").val() == "") {
						dialog({
							title: '提示',
							modal: true,
							content: "带*为必填项。",
							ok: function() {},
							cancel: false,
						}).width(320).show();
						return false;
					};
					if($(".return-info-apply-number").val() == 0) {
						dialog({
							title: '提示',
							modal: true,
							content: "退货数量不能为0。",
							ok: function() {},
							cancel: false,
						}).width(320).show();
						return false;
					};
					var returnNumber = $(".return-info-apply-number").val();
					var totalNumber = $(".return-total-num").text();
					if(parseInt(returnNumber) < 0 || /^[0-9]*$/.test(returnNumber) == false) {
						dialog({
							title: '提示',
							modal: true,
							content: "退货数量必须为大于零的整数。",
							ok: function() {},
							cancel: false,
						}).width(320).show();
						return false;
					};
					if(parseInt(returnNumber) > parseInt(totalNumber)) {
						dialog({
							title: '提示',
							modal: true,
							content: "退货数量超出。",
							ok: function() {},
							cancel: false,
						}).width(320).show();
						return false;
					};
					if($.trim($(".return-info-apply-desc").val()).length > 200) {
						dialog({
							title: '提示',
							modal: true,
							content: "退货说明不可超过200字。",
							ok: function() {},
							cancel: false,
						}).width(320).show();
						return false;
					}
					var goodsReturnImages = [];
					var $imgs = $("#addImage .add-column-img");
					$imgs.each(function() {
						var that = this;
						var obj = {
							imageUrl: that.src
						};
						goodsReturnImages.push(obj)
					});
					var detailId = $("#return-item-id").val(),
						url = base + "/api/order/addGoodsReturn", //退货提交地址
						data = {
							detailId: decodeURIComponent(common.getQueryString("itemId")),
							id: decodeURIComponent(common.getQueryString("returnOrderId")),
							returnReason: $.trim($(".return-info-apply-reason p").text()),
							quantity: $.trim($(".return-info-apply-number").val()),
							remark: $.trim($(".return-info-apply-desc").val()),
							goodsReturnImages: goodsReturnImages
						},
						callback = function(r) {
							if(r.code == "0000") {
								window.location.href = "#returnsteptwo?id=" + encodeURIComponent(detailId);
							} else {
								dialog({
									title: '提示',
									modal: true,
									content: r.message,
									ok: function() {},
									cancel: false,
								}).width(320).show();
							}
						};
					common.postData(url, data, callback, true);
				})
				//取消并返回
			$(".return-apply-btn-cancel").bind("click", function() {
					window.location.href = "#order";
					window.location.reload();
				})
				//退货凭证选择
			$(".return-info-apply-spec-photo").bind("click", function() {
				if($("#addImage .add-column-img").length == 5) {
					dialog({
                        title: '提示',
                        modal: true,
                        content: "最多只能上传五张图片。",
                        ok: function() {},
                        cancel: false
                    }).width(320).show();
					return false;
				}
				$("#returnForm input:file").click();
			})
			$("#returnFile").change(function() {
				//图片格式判断
				var picPath = $(this).val();
				if(/.+\.(jpeg|jpg|png||JPEG|JPG|PNG)$/.test(picPath) == false) {
					dialog({
						title: '提示',
						modal: true,
						content: "请上传jpg/png/jpeg格式的图片。",
						ok: function() {},
						cancel: false,
					}).width(320).show();
					return false;
				};
				//图片大小判断
				if(this.files[0].size / 1024 / 1024 > 10) {
					dialog({
						title: '提示',
						modal: true,
						content: "文件大小超过10M，请重新上传。",
						ok: function() {},
						cancel: false,
					}).width(320).show();
					this.value = "";
					return false;
				}
				var callback = function(data) {
					var data = JSON.parse(data);
					var img = '<a href="<%=data.url%>" target="_blank" style="position:relative"><img src="<%=data.url%>" class="add-column-img" style="margin-right:10px" ><span class="close-photo">X</span></a>';
					$("#addImage").append(_.template(img, {
						data: data
					}))
					$(".close-photo").bind("click", function(e) {
						$(this).parent("a").remove();
						e.preventDefault();
					})
				}
				common.fileUpload("returnForm", callback)
			})
		}
	}
	return controller;
});

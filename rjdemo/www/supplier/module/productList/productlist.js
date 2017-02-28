define(['text!module/productList/productList.html', 'text!module/productList/loadProductList.html', 'css!module/productList/style/productList.css', "pagination"], function(tpl, loadPage) {
	var controller = function(status) {
		var base = common.serverBaseUrl;
		var url = base + "/api/product/findProduct"; //商品列表
		var pageSize = 10;
		var requestData = {
			pageNo: 1,
			pageSize: pageSize,
			findModel: {
				status: status
			}
		};
		var callback = function(r) {
			if(r.code == "0000") {
				var data = {
					p: r.products,
					data: r,
				}
				appView.html(_.template(tpl, data));
				common.pageFun(r.total, 1, pageSize, page(requestData)); //页码初始化
				eventBind();
				if(r.hasOwnProperty("products") == false || r.products.length == 0) {
					$(".page-wrap").hide();
				} else {
					$(".page-wrap").show();
				}
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
		common.postData(url, requestData, callback, true)

		/*
		 * 分页回调函数设置
		 * @param {Object} data 添加的请求数据（默认请求pageNo及pageSize，且默认值不可更改）
		 * return {Function} 分页回调函数
		 * 
		 * */
		function page(data) {
			var pageCallback = function(index) {
				var baseData = {
					pageNo: index + 1,
					pageSize: pageSize
				}
				$.extend(data, baseData);
				var callback = function(r) {
					if(r.code == "0000") {
						var result = {
							p: r.products,
							data: r,
						}
						$("#productList").html(_.template(loadPage, result))
						window.scrollTo(0, 0);
						$("#productList .product-checkbox").bind("click", checkboxEventBind); //复选框时间绑定
						if(r.hasOwnProperty("products") == false || r.products.length == 0) {
							$(".page-wrap").hide();
						} else {
							$(".page-wrap").show();
						}
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
				}
				common.postData(url, data, callback, true)
			}
			return pageCallback;
		}

		/*
		 * 搜索,页面更新
		 * @param {Object} data 添加的请求数据（默认请求pageNo及pageSize，且默认值不可更改）
		 * */
		function pageUpdate(data) {
			var baseData = {
				pageNo: 1,
				pageSize: pageSize,
			};
			$.extend(data, baseData);
			var callback = function(r) {
				if(r.code == "0000") {
					var result = {
						p: r.products,
						data: r,
						url: common.imgUrl, //图片前缀
					}
					$("#productList").html(_.template(loadPage, result)); //列表更新
					$(".total-page-num").text(r.totalPages); //页面数更新
					common.pageFun(r.total, 1, pageSize, page(data)); //页码初始化
					$("#productList .product-checkbox").bind("click", checkboxEventBind); //复选框时间绑定
					if(r.hasOwnProperty("products") == false || r.products.length == 0) {
						$(".page-wrap").hide();
					} else {
						$(".page-wrap").show();
					}
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
			common.postData(url, data, callback, true) //数据请求
		}
		//商品前复选框时间绑定
		function checkboxEventBind() {
			$(this).toggleClass("product-checkbox-selected");
			if($("#productList .product-checkbox-selected").length == $("#productList .product-checkbox").length) {
				$(".product-check-all .product-checkbox").addClass("product-checkbox-selected");
			} else if($("#productList .product-checkbox-selected").length != $("#productList .product-checkbox").length) {
				$(".product-check-all .product-checkbox").removeClass("product-checkbox-selected");
			}
		}

		function eventBind() {
			//选项卡选取
			var $tags = $(".product-header-search li");
			var onBtn = $(".product-on");
			var offBtn = $(".product-off");
			switch(status) {
				case "2":
					$tags.eq(3).addClass("product-header-selected").siblings().removeClass("product-header-selected");
					onBtn.show();
					offBtn.hide();
					break;
				case "3":
					$tags.eq(1).addClass("product-header-selected").siblings().removeClass("product-header-selected");
					onBtn.hide();
					offBtn.show();
					break;
				case "4":
					$tags.eq(2).addClass("product-header-selected").siblings().removeClass("product-header-selected");
					onBtn.show();
					offBtn.hide();
					break;
				default:
					onBtn.show();
					offBtn.show();
			}

			//复选框勾选效果
			$("#productList .product-checkbox").bind("click", checkboxEventBind);
			$(".product-check-all .product-checkbox").bind("click", function() {
					$(this).toggleClass("product-checkbox-selected");
					if($(this).hasClass("product-checkbox-selected")) {
						$("#productList .product-checkbox").addClass("product-checkbox-selected");
						$(".product-check-all .product-checkbox").addClass("product-checkbox-selected");
					} else {
						$("#productList .product-checkbox").removeClass("product-checkbox-selected");
						$(".product-check-all .product-checkbox").removeClass("product-checkbox-selected");
					}
				})
				//批量上下架
			$(".product-shelve").bind("click", function() {
					var $elems = $("#productList .product-checkbox-selected");
					if($elems.length == 0) {
						dialog({
							title: '提示',
							modal: true,
							content: "您未选择商品。",
							ok: function() {},
							cancel: false,
						}).width(320).show();
						return false;
					} else {
						var txt = $(this).text();
						var arr = []; //存放数组
						var url = base + "/api/product/updateProductStatus"; //修改商品状态
						var data; //请求数据
						var keywords = $(".product-header-selected").text().trim();
						var callback = function(r) {
							if(r.code == "0000") {
								dialog({
									title: '提示',
									modal: true,
									content: "操作成功。",
									ok: function() {},
									cancel: false,
								}).width(320).show();

								$elems.each(function() {
									var $status = $(this).parents("td").siblings(".product-status").find(".product-item-status");
									var $preview=$(this).parents("td").siblings(".product-operate").find(".product-preview");
									if(keywords == "全部") {
										if(txt == "上架") {
											$status.text("已上架");
											$preview.removeClass('product-hide');
										} else {
											$status.text("已下架");
											$preview.addClass('product-hide');
										}
									} else {
										$status.parents("tr").remove();
									}
								});
								$(".product-checkbox").removeClass("product-checkbox-selected");
							} else {
								dialog({
									title: '提示',
									modal: true,
									content: "操作失败，请补充图片再操作。",
									ok: function() {},
									cancel: false,
								}).width(320).show();
								return false;
							}
						}
						$elems.each(function() {
							arr.push($(this).parents("td").siblings(".product-operate").find(".product-sn").val())
						});
						if(txt == "上架") {
							data = {
								productSns: arr,
								type: "ONLINE",
							}
							common.postData(url, data, callback, true)
						} else {
							data = {
								productSns: arr,
								type: "OFFLINE",
							}
							common.postData(url, data, callback, true)
						}
					}
				})
				//上架和未上架搜索
			$(".product-header-search li").bind("click", function() {
				$(this).addClass("product-header-selected").siblings().removeClass("product-header-selected")
				var text = $(this).text();
				var staus;
				switch(text) {
					case "已上架":
						status = 3;
						onBtn.hide();
						offBtn.show();
						break;
					case "已下架":
						status = 4;
						onBtn.show();
						offBtn.hide();
						break;
					case "未上架":
						status = 2;
						onBtn.show();
						offBtn.hide();
						break;
					default:
						status = null;
						onBtn.show();
						offBtn.show();
				};
				var data = {
					findModel: {
						status: status
					}
				};
				pageUpdate(data);
				$(".product-check-all .product-checkbox").removeClass("product-checkbox-selected");
			})

			//头部搜索
			$(".product-search-text").bind("click", function() {
				var key = $.trim($(".product-search-box").val());
				var status;
				var txt = $(".product-header-search .product-header-selected").text();
				switch(txt) {
					case "已上架":
						status = 3;
						break;
					case "已下架":
						status = 4;
						break;
					case "未上架":
						status = 2;
						break;
					default:
						status = null;
				}
				var data = {
					findModel: {
						search: key,
						status: status,
					}
				};
				pageUpdate(data)
			});
			//回车搜索
			$(".product-search-box").keydown(function(e) {
					if(e.keyCode == 13) {
						$(".product-search-text").click()
					}
				})
				//更多搜索
			$(".product-more-submit").bind("click", function() {
				var name = $.trim($(".product-more-name").val());
				var num = $.trim($(".product-more-number").val());
				var brand = $(".product-more-brand").val().trim();
				var data = {
					findModel: {}
				};
				if(name) {
					data.findModel.productName = name;
				};
				if(num) {
					data.findModel.productNum = num;
				};
				if(brand) {
					data.findModel.brandName = brand;
				};
				$(".product-header-search li").removeClass().eq(0).addClass("product-header-selected")
				pageUpdate(data)
			});
			//重置
			$(".product-more-reset").bind("click", function() {
				$(".product-more-name").val("");
				$(".product-more-number").val("");
				$(".product-more-brand").val("");
			});

			//更多搜索条件显示与隐藏
			$(".product-search-more").bind("click", function() {
				var txt = $(this).text();
				if(txt == "更多") {
					$(this).text("收起");
					$(".product-more").show();
				} else {
					$(this).text("更多");
					$(".product-more").hide();
				}
			})

			//首页和末页
			$(".product .head").click(function() {
				$("#pagination .prev").next().click()
			});
			$(".product .end").click(function() {
				$("#pagination .next").prev().click()
			});
			//左边“商品列表”选中
			common.tabFocus("商品列表");
		}
	}
	return controller;
});
/*create by lijinhua*/
define(['text!module/commodity/supplie_shop.html', 'text!module/header/search.html', 'module/commodity/commodity', 'module/commodity/supplie', 'text!module/commodity/loadSupplierCommodity.html', 'js/urls', 'common', 'css!module/home/style/style.css?', 'css!module/commodity/style/commodity_list.css', 'css!module/commodity/style/supplie.css'], function(tpl, searchHtml, commodity, supplie, loadHtml, urls, common) {
	var controller = function() {
		var supplierFun = (function() {
			var baseUrl = common.serverBaseUrl;
			var shoplieShopUrl = urls.allUrls.getProductList;
			var direction = "DESC";
			var so="MULTIPLE";

			/*商品分类接口地址*/
			var productCategory = urls.allUrls.getProductCategory;
			var pageIndex = 1;
			var supplierIds = parseInt(decodeURIComponent(common.getQueryString("id")));
			var supplierName = decodeURIComponent(common.getQueryString("name"));
			var keyWord=decodeURIComponent(common.getQueryString("keywords"));//商品详情页面关键字搜索跳转
			var categoryIndex=decodeURIComponent(common.getQueryString("index"));//商品详情页面商品分类点击跳转
			var findModel = {
				supplierIds: [supplierIds],
			};
			var categoryIds = [];
			var supplierDataId = {
				findModel: {
					supplierId: supplierIds,
				}
			};
			
			
			//价格三角形标识
			function activeTriangle(f){
				var triangleF= $(".commodity-sort-left.commodity-active").attr("data-flag");
				if(triangleF=="price"){
					if(f=="ASC"){
						$(".com-price-triangle .up-triangle").css({"border-bottom-color":"#008cd0"});
						$(".com-price-triangle .down-triangle").css({"border-top-color":"#ccc"});
					}else if(f=="DESC"){
						$(".com-price-triangle .down-triangle").css({"border-top-color":"#008cd0"});
						$(".com-price-triangle .up-triangle").css({"border-bottom-color":"#ccc"});
					}
					$(".com-sale-triangle .up-triangle").css({"border-bottom-color":"#ccc"});
					$(".com-sale-triangle .down-triangle").css({"border-top-color":"#ccc"});
				}else if(triangleF=="sale"){
					if(f=="ASC"){
						$(".com-sale-triangle .up-triangle").css({"border-bottom-color":"#008cd0"});
						$(".com-sale-triangle .down-triangle").css({"border-top-color":"#ccc"});
					}else if(f=="DESC"){
						$(".com-sale-triangle .down-triangle").css({"border-top-color":"#008cd0"});
						$(".com-sale-triangle .up-triangle").css({"border-bottom-color":"#ccc"});
					}
					$(".com-price-triangle .down-triangle").css({"border-top-color":"#ccc"});
					$(".com-price-triangle .up-triangle").css({"border-bottom-color":"#ccc"});
				}
			} 

			/*商品排列模式的状态*/
			var showModelFun = function() {

				if($(".find-active").find(".commodity-active").attr("data-flag") == "list") {
					$(".commodity-list-lists").css("display", "block");
					$(".commodity-list-pic").css("display", "none");
				} else {
					$(".commodity-list-lists").css("display", "none");
					$(".commodity-list-pic").css("display", "block");
				}
			};

			/*页码触发事件的回调函数*/
			var pageCallbackFun = function(datas) {
				if(datas.code == '0000') {
					$("#commodity-list").html(_.template(loadHtml, datas));
					common.pageFun(datas.total, datas.pageNo, datas.pageSize, pageselectCallback);
					showModelFun();
				} else {
					dialog({
							title: '提示',
							modal: true,
							content: datas.message,
							ok: function() {},
							cancel: false,
						}).width(320).show();
				}

				/*商品排序方式*/
				/*$(".commodity-sort-left").click(function() {
					$(".commodity-sort-left").removeClass("commodity-active");
					$(this).addClass("commodity-active");
					if($.trim($(this).text()) == "价格") {
						common.urlFun(additonCallbackFun, baseUrl + shoplieShopUrl, pageIndex, "PRICE", "DESC", true, findModel);
					} else if($.trim($(this).text()) == "销量") {
						common.urlFun(additonCallbackFun, baseUrl + shoplieShopUrl, pageIndex, "SALEAMOUNT", "DESC", true, findModel);
					} else if($.trim($(this).text()) == "综合排序") {
						common.urlFun(additonCallbackFun, baseUrl + shoplieShopUrl, pageIndex, "SALEAMOUNT", "DESC", true, findModel);
					}
				});*/
			};

			/*页码的触发事件*/
			var pageselectCallback = function(pageIndexs) {
				/*var t = $.trim($(".commodity-sort").children(".commodity-active").attr("data-flag"));
				var orders = "SALEAMOUNT";
				if(t == "price") {
					orders = "PRICE";
				} else if(t == "sale") {
					orders = "SALEAMOUNT";
				}*/
				common.urlFun(additonCallbackFun, baseUrl + shoplieShopUrl, pageIndexs + 1, so, direction, true, findModel);
			};

			/*添加筛选条件的回调函数*/
			var additonCallbackFun = function(datas) {
				if(datas.code == "0000") {
					if(datas.products != undefined && datas.products.length) {
						datas.flag = true;
					} else {
						datas.flag = false;
					}
					$("#commodity-list").html(_.template(loadHtml, datas));
					common.pageFun(datas.total, datas.pageNo, datas.pageSize, pageselectCallback);
					showModelFun();
					activeTriangle(direction);
					
				}
			};

			/*初始页面ajax回调函数*/
			var callbackSupplierFun = function(datas) {
				if(datas.code == "0000") {
					var supplierFun = function(supplierDadas) {
						if(supplierDadas.code == "0000") {
							if(datas.products != undefined && datas.products.length) {
								supplierDadas.flag = true;
							} else {
								supplierDadas.flag = false;
							}
							supplierDadas.datas=datas;
							supplierDadas.search = searchHtml;
							supplierDadas.supplierName = supplierName;
							supplierDadas.supplierIds = supplierIds;
							//console.log(supplierDadas);
							appView.html(_.template(tpl, supplierDadas));
							commodity();
							supplie();
							activeTriangle(direction);
							showModelFun();

							common.nav().search().searchKey();

							//购物车数量
							$("#basketNum").html($(".basket-num").html());

							//加载页码
							common.pageFun(supplierDadas.datas.total, supplierDadas.datas.pageNo, supplierDadas.datas.pageSize, pageselectCallback);

							/*商品排序方式*/
							$(".commodity-sort-left").click(function() {
								$(".commodity-sort-left").removeClass("commodity-active");
								$(this).addClass("commodity-active");
								var flag = $(this).attr("data-flag");
								if(flag == "price") {
									if($(this).hasClass("flag")) {
										$(".commodity-sort-left").addClass("flag");
										$(this).removeClass("flag");
										direction = "DESC";
										so="PRICE";
										common.urlFun(additonCallbackFun, baseUrl + shoplieShopUrl, pageIndex,so , direction, true, findModel);
									} else {
										$(this).addClass("flag");
										direction = "ASC";
										so="PRICE";
										common.urlFun(additonCallbackFun, baseUrl + shoplieShopUrl, pageIndex, so, direction, true, findModel);
									}

								} else if(flag == "sale") {
									if($(this).hasClass("flag")) {
										$(".commodity-sort-left").addClass("flag");
										$(this).removeClass("flag");
										direction = "DESC";
										so="SALEAMOUNT";
										common.urlFun(additonCallbackFun, baseUrl + shoplieShopUrl, pageIndex, so, direction, true, findModel);

									} else {
										$(this).addClass("flag");
										direction = "ASC";
										so="SALEAMOUNT";
										common.urlFun(additonCallbackFun, baseUrl + shoplieShopUrl, pageIndex, so, direction, true, findModel);

									}

								}
							});

							/*供应商商品搜索*/
							$("#search-btn").on("click", function() {
								var keyWord = $(this).prevAll(".key-word").val();
								findModel.search = keyWord;
								findModel.categoryIds = [];
								so="MULTIPLE";
								direction="DESC";
								common.urlFun(additonCallbackFun, baseUrl + shoplieShopUrl, pageIndex, so, direction, true, findModel);
							});

							/*商品分类搜索*/
							$(".classify-control").on("click", function() {
								if(categoryIds.length != 0) {
									categoryIds.splice(0, 1, $(this).nextAll(".category-value").val());
								} else {
									categoryIds.push($(this).nextAll(".category-value").val());
								}
								//categoryIds=$(this).nextAll (".category-value").val();
								findModel.categoryIds = categoryIds;
								findModel.search = '';
								so="SALEAMOUNT";
								direction="DESC";
								common.urlFun(additonCallbackFun, baseUrl + shoplieShopUrl, pageIndex, so , direction, true, findModel);
							});
							/*商品搜索*/
							if(keyWord&&keyWord!="关键字"){
								$(".key-word").val(keyWord);
								$("#search-btn").click();
							}
							/*商品分类点击效果*/
							if(categoryIndex||categoryIndex==0){
								$(".supplie-commodity-classify li").eq(parseInt(categoryIndex)).find("a").click();
							}
						}
					};

					/*获取供应商的商品分类*/
					common.postData(baseUrl + productCategory, supplierDataId, supplierFun, true);
				} else {
					$("#out").click();
				}

			};
			return {
				supplierMethod: function() {
					common.urlFun(callbackSupplierFun, baseUrl + shoplieShopUrl, pageIndex, so, direction, true, findModel);
				}
			}
		})();
		supplierFun.supplierMethod();

	};
	return controller;
});

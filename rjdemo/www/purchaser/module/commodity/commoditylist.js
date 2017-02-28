/*create by lijinhua*/
define(['jquery', 'text!module/commodity/commodityList.html', 'text!module/header/search.html', 'text!module/header/navigation.html', 'module/commodity/commodity', 'text!module/commodity/loadCommodity.html', 'text!module/commodity/brandsLoad.html', 'text!module/commodity/suppliersLoad.html', 'text!module/commodity/searchCon.html', 'css!module/home/style/style.css', 'css!module/commodity/style/commodity_list.css', 'domready!'], function($, tpl, searchHtml, navHtml, commodity, loadHtml, brandsHtml, supplierHtml, searchConHtml) {
	var controller = function() {
		var pageIndex = 1;
		var searchCom = decodeURIComponent(common.getQueryString("key"));
		var searchSupp = decodeURIComponent(common.getQueryString("supp"));
		var searchBran = decodeURIComponent(common.getQueryString("bran"));
		var searchFormat = decodeURIComponent(common.getQueryString("format"));
		var searchNum = decodeURIComponent(common.getQueryString("num"));
		var searchCate = decodeURIComponent(common.getQueryString("cate"));
		var categoryId = decodeURIComponent(common.getQueryString("id"));
		var searchFlag = decodeURIComponent(common.getQueryString("flag"));

		//根据id搜索
		var listFun = (function() {
			var baseUrl = common.serverBaseUrl;

			/*商品列表接口*/
			var commodityUrl = urls.allUrls.getProductList;
			var findModel = {
				search: searchCom
			};
			var direction = "DESC";
			var order = "MULTIPLE";

			/*如果有id则根据id查询*/
			if(categoryId) {
				findModel = {
					categoryIds: [categoryId]
				}
			};

			/*如果有供应商则根据供应商查询*/
			if(searchSupp != undefined && searchSupp != ' ' && searchSupp) {
				findModel = {
					suppName: searchSupp
				}
			};

			/*如果有品牌则根据品牌查询*/
			if(searchBran != undefined && searchBran != ' ' && searchBran) {
				findModel = {
					brandName: searchBran
				}
			};

			/*如果有规格则根据规格查询*/
			if(searchFormat != undefined && searchFormat != ' ' && searchFormat) {
				findModel = {
					specification: searchFormat
				}
			};

			/*如果有编码则根据编码查询*/
			if(searchNum != undefined && searchNum != ' ' && searchNum) {
				findModel = {
					productSn: searchNum
				}
			};

			/*如果有分类名则根据分类名查询*/
			if(searchCate != undefined && searchCate != ' ' && searchCate) {
				findModel = {
					categoryName: searchCate
				}
			};

			/*高级搜索*/
			var cat = $.cookie("cateId");;
			if(searchFlag != undefined && searchFlag != ' ' && searchFlag) {
				findModel = {
					search: decodeURIComponent(common.getQueryString("detailkey")),
					categoryIds: [parseInt(cat)],
					brandName: decodeURIComponent(common.getQueryString("brand")),
					suppName: decodeURIComponent(common.getQueryString("supplier")),
					lowPrice: decodeURIComponent(common.getQueryString("low")),
					highPrice: decodeURIComponent(common.getQueryString("high")),
				}

				if(!cat) {
					findModel.categoryIds = [];
				}
			}

			findModel.brandIds = [];
			findModel.supplierIds = [];

			function hideMoreFun() {
				//显示隐藏"更多"按钮
				var moreHeight = $(".catalog-brand").height();
				if(moreHeight < 40) {
					$(".more").hide();
				} else {
					$(".more").show();
				}
			}

			//价格三角形标识
			function activeTriangle(f) {
				var triangleF = $(".commodity-sort-left.commodity-active").attr("data-flag");
				if(triangleF == "price") {
					if(f == "ASC") {
						$(".com-price-triangle .up-triangle").css({
							"border-bottom-color": "#008cd0"
						});
						$(".com-price-triangle .down-triangle").css({
							"border-top-color": "#ccc"
						});
					} else if(f == "DESC") {
						$(".com-price-triangle .down-triangle").css({
							"border-top-color": "#008cd0"
						});
						$(".com-price-triangle .up-triangle").css({
							"border-bottom-color": "#ccc"
						});
					}
					$(".com-sale-triangle .up-triangle").css({
						"border-bottom-color": "#ccc"
					});
					$(".com-sale-triangle .down-triangle").css({
						"border-top-color": "#ccc"
					});
				} else if(triangleF == "sale") {
					if(f == "ASC") {
						$(".com-sale-triangle .up-triangle").css({
							"border-bottom-color": "#008cd0"
						});
						$(".com-sale-triangle .down-triangle").css({
							"border-top-color": "#ccc"
						});
					} else if(f == "DESC") {
						$(".com-sale-triangle .down-triangle").css({
							"border-top-color": "#008cd0"
						});
						$(".com-sale-triangle .up-triangle").css({
							"border-bottom-color": "#ccc"
						});
					}
					$(".com-price-triangle .down-triangle").css({
						"border-top-color": "#ccc"
					});
					$(".com-price-triangle .up-triangle").css({
						"border-bottom-color": "#ccc"
					});
				}
			}

			//清除品牌选中项
			function clearSelectedFun() {
				$("#brands .commodity-icon").find("label").html("").css({
					"border-color": "#ccc"
				});
				$("#brands .commodity-icon").find("input[type='checkbox']").prop("checked", false);
				$("#brands .commodity-icon").removeClass("flag");
			}

			//清除供应商选中项
			function clearSuppSelectedFun() {
				$("#suppliers .supplier-icon-span").find("label").html("").css({
					"border-color": "#ccc"
				});
				$("#suppliers .supplier-icon-span").find("input[type='checkbox']").prop("checked", false);
				$("#suppliers .supplier-icon-span").removeClass("flag");
			}

			/*判断筛选条件隐藏或显示*/
			var additionStatu = function(statuobj, obj) {
				if(!obj) {
					if(statuobj.attr("data-flag") == "brand") {
						statuobj.parent().parent().css("display", "none");
					} else {
						statuobj.parent().css("display", "none");
					}
					$(".commodity-catalog-next:eq(0)").css("border-top", "1px dotted #ccc");
				} else {
					if(statuobj.attr("data-flag") == "brand") {
						statuobj.parent().parent().css("display", "block");
					} else {
						statuobj.parent().css("display", "block");
					}
				}
			};

			/*页码的触发事件*/
			var pageselectCallback = function(pageIndexs) {
				/*var t = $.trim($(".commodity-sort").children(".commodity-active").attr("data-flag"));
				if(t == "price") {
					order = "PRICE";
				} else if(t == "sale") {
					order = "SALEAMOUNT";
				}*/
				common.urlFun(pageCallbackFun, baseUrl + commodityUrl, pageIndexs + 1, order, direction, true, findModel);
			};

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
			var getActive = function() {
				$(".commodity-sort-left").removeClass("commodity-active");
				$(".commodity-sort-left:eq(0)").addClass("commodity-active");
			};

			/*页码触发事件的回调函数*/
			function pageCallbackFun(datas) {
				if(datas.code == '0000') {
					datas.flag = true;
					$("#commodity-list").html(_.template(loadHtml, datas));
					common.pageFun(datas.total, datas.pageNo, datas.pageSize, pageselectCallback);
					showModelFun();

				} else if(datas.code == "1020") {
					$("#out").click();
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

			/*添加面包屑搜索*/
			function addBreadFun(e) {
				var currents = $(this);
				var h = $.trim($(this).text()) == "" ? "测试" : $.trim($(this).text());
				//if($(".breads-all:contains(" + h + ")").text()) {
				//	return false;
				//} else {
					getActive();
					var additionFun = (function() {
						var l = $.trim(currents.parent().parent().prev(".catalog01").attr("data-flag"));
						if(l == "supplier") {
							$(".breads-all").append("<span> &gt; <span class='commodity-filtrate'><span class='commodity-filtrate-inner'>" + currents.find(".checkbox-value").val() + "<input type='hidden' class='suppliers-class' value='" + currents.find('.supplies-value').val() + "'/><input type='hidden' class='del-flag-bread' value='suppliers'/></span><span class='del-filtrate'>X</span></span></span>");
							findModel.supplierIds.push(parseInt(currents.find(".supplies-value").val()));
						} else if(l == "brand") {
							$(".breads-all").append("<span> &gt; <span class='commodity-filtrate'><span class='commodity-filtrate-inner'>" + currents.find(".checkbox-value").val() + "<input class='brands-class' type='hidden' value='" + currents.find('.brands-value').val() + "'/><input type='hidden' class='del-flag-bread' value='brands'/></span><span class='del-filtrate'>X</span></span></span>");
							findModel.brandIds.push(parseInt(currents.find(".brands-value").val()));
						} else if(l == "price") {
							var currentsValue = currents.text();
							var currentsArr = currentsValue.split("-");
							$(".breads-all").append("<span> &gt; <span class='commodity-filtrate'><span class='commodity-filtrate-inner'>" + currentsValue + "<input type='hidden' value='" + currentsArr[0] + "'/><input type='hidden' value='" + currentsArr[1] + "'/><input type='hidden' class='del-flag-bread' value='prices'/></span><span class='del-filtrate'>X</span></span></span>");
							findModel.lowPrice = parseFloat(currentsArr[0]);
							findModel.highPrice = parseFloat(currentsArr[1]);
						}
						return {
							additionMethod: function() {
								order = "MULTIPLE";
								direction = "DESC";
								common.urlFun(additonCallbackFun, baseUrl + commodityUrl, pageIndex, order, direction, true, findModel);
							}
						}
					})();
					additionFun.additionMethod();
					e.stopPropagation();
				//}
			}

			/*添加筛选条件的回调函数*/
			var additonCallbackFun = function(datas) {
				if(datas.code == "0000") {

					//添加标志判断商品列表是否为空
					if(datas.products != undefined && datas.products.length) {
						datas.flag = true;

						$("#commodity-catalog-section").css("display", "block");

						additionStatu($(".catalog01:contains('品牌')"), datas.brands);
						additionStatu($(".catalog01:contains('供应商')"), datas.suppliers);
						if(/\d{1,10}-\d{0,10}/.test($(".breads-all").text())) {
							additionStatu($(".catalog01:contains('商品价格')"));
						}

						if(datas.suppliers) {
							$("#suppliers").html(_.template(supplierHtml, datas));
						}
						if(datas.brands) {
							$("#brands").html(_.template(brandsHtml, datas));
						}

						hideMoreFun();
						$(".brand-flag").css("height", "38px");
						$(".supplier-flag").css("height", "38px");
						$(".supplier-more-event").addClass("flag");
						$(".common-event").removeClass("flag");

						$("#commodity-list").html(_.template(loadHtml, datas));
						common.pageFun(datas.total, datas.pageNo, datas.pageSize, pageselectCallback);
						$("#total-com").html(datas.total);
						showModelFun();
						/*commodity();*/

					} else {
						datas.flag = false;
						//datas.empty=$("")
						$("#commodity-list").html(_.template(loadHtml, datas));
						$("#commodity-catalog-section").css("display", "none");
						$(".page").html(null);
					}

					hideMoreFun();
					activeTriangle(direction);
					//commodity(addBreadFun,clearSelectedFun,clearSuppSelectedFun);

					//$(".screen").on("click", ".breads", addBreadFun);
				} else if(datas.code == "1020") {
					$("#out").click();
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

			//商品列表初始ajax回调函数
			var callbackListFun = function(datas) {
				if(datas.code == '0000') {
					datas.search = searchHtml;
					datas.nav = navHtml;
					if(datas.products != undefined && datas.products.length) {
						datas.flag = true;
						appView.html(_.template(tpl, datas));
						$("#commodity-catalog-section").css("display", "block");
					} else {
						datas.flag = false;
						appView.html(_.template(tpl, datas));
						$("#commodity-catalog-section").css("display", "none");
						$(".page").html(null);
					}
					additionStatu($(".catalog01:contains('品牌')"), datas.brands);
					additionStatu($(".catalog01:contains('供应商')"), datas.suppliers);
					activeTriangle(direction);
					hideMoreFun();
					showModelFun();

					//分类搜索添加面包屑
					if(searchFlag != undefined && searchFlag != ' ' && searchFlag) {
						if($.cookie("cateName")) {
							$(".breads-all").append("<span> &gt; <span class='commodity-filtrate'><span class='commodity-filtrate-inner'>" + $.cookie("cateName") + "<input type='hidden' class='cate-class' value='" + cat + "'/><input type='hidden' class='del-flag-bread' value='cate'/></span><span class='del-filtrate'>X</span></span></span>");
						}
					}

					//搜索
					common.nav().search().searchKey();

					//购物车数量
					$("#basketNum").html($(".basket-num").html());

					//加载页码
					common.pageFun(datas.total, datas.pageNo, datas.pageSize, pageselectCallback);

					$(".screen").unbind().on("click", ".breads", addBreadFun);

					/*删除面包导航条件*/
					$(".commodity-header-bread").on("click", ".del-filtrate", function() {
						$(this).parent().parent().remove();
						var delValue = $(this).siblings(".commodity-filtrate-inner").find(".del-flag-bread").val();
						if(delValue == "prices") {
							findModel.lowPrice = '';
							findModel.highPrice = '';
							$(".catalog01:contains('商品价格')").parent().css("display", "block"); //显示商品价格栏
							order = "MULTIPLE";
							direction = "DESC";
							common.urlFun(additonCallbackFun, baseUrl + commodityUrl, pageIndex, order, direction, true, findModel);
						} else if(delValue == "suppliers") {
							findModel.supplierIds=[];
							/*var suppliersLen = [];
							suppliersLen = findModel.supplierIds;
							var scV = $(this).siblings(".commodity-filtrate-inner").find(".suppliers-class");
							for(var i = 0; i < suppliersLen.length; i++) {
								if(scV == suppliersLen[i]) {
									suppliersLen.splice(i, 1);
								}
							}*/
							order = "MULTIPLE";
							direction = "DESC";
							common.urlFun(additonCallbackFun, baseUrl + commodityUrl, pageIndex, order, direction, true, findModel);
						} else if(delValue == "brands") {
							findModel.brandIds=[];
							/*var brandsIdLen = [];
							brandsIdLen = findModel.brandIds;
							var bcV = parseInt($(this).nextAll(".brands-class").val());
							for(var i = 0; i < brandsIdLen.length; i++) {
								if(bcV == brandsIdLen[i]) {
									brandsIdLen.splice(i, 1);
								}
							}*/
							order = "MULTIPLE";
							direction = "DESC";
							common.urlFun(additonCallbackFun, baseUrl + commodityUrl, pageIndex, order, direction, true, findModel);
						} else if(delValue == "cate") {
							findModel.categoryIds.splice(0, 1);
							$.cookie("cateName", '', {
								path: '/'
							});
							$.cookie("cateId", '', {
								path: '/'
							});
							order = "MULTIPLE";
							direction = "DESC";
							common.urlFun(additonCallbackFun, baseUrl + commodityUrl, pageIndex, order, direction, true, findModel);
						}
					});

					/*商品排序方式*/
					$(".commodity-sort-left").unbind().click(function() {
						$(".commodity-sort-left").removeClass("commodity-active");
						$(this).addClass("commodity-active");
						//var that = $(this);
						if($(this).attr("data-flag") == "price") {
							if($(this).hasClass("price-sort-flag")) {
								$(".commodity-sort-left").removeClass("sale-sort-flag");
								$(this).removeClass("price-sort-flag");
								direction = "DESC";
								order = "PRICE";
								common.urlFun(additonCallbackFun, baseUrl + commodityUrl, pageIndex, order, direction, true, findModel);
							} else {
								$(this).addClass("price-sort-flag");
								direction = "ASC";
								order = "PRICE";
								common.urlFun(additonCallbackFun, baseUrl + commodityUrl, pageIndex, order, direction, true, findModel);
							}
						} else if($(this).attr("data-flag") == "sale") {
							if($(this).hasClass("sale-sort-flag")) {
								$(".commodity-sort-left").addClass("price-sort-flag");
								$(this).removeClass("sale-sort-flag");
								direction = "ASC";
								order = "SALEAMOUNT";
								common.urlFun(additonCallbackFun, baseUrl + commodityUrl, pageIndex, order, direction, true, findModel);
							} else {
								$(this).addClass("sale-sort-flag");
								direction = "DESC";
								order = "SALEAMOUNT";
								common.urlFun(additonCallbackFun, baseUrl + commodityUrl, pageIndex, order, direction, true, findModel);
							}
						}
					});

					/*品牌确定多选*/
					$("#commodity-catalog-section").on("click", ".brand-more-choose", function(e) {
						$(".commodity-catalog").css("height", 38 + "px");
						/*$(".commodity-icon label").css("visibility", "hidden");
						$(".catalog-brand").css({
							"overflow": "hidden",
							"height": muti_heigth + "px"
						});*/
						var arr = $("#brands input:checked");
						//arr.push($("input:checked").nextAll(".brands-value").val());
						var str = "";
						for(var i = 0; i < arr.length; i++) {
							findModel.brandIds.push(parseInt($(arr[i]).nextAll(".brands-value").val()));
							if(i == arr.length - 1) {
								str = str + $(arr[i]).val() + "<input type='hidden' class='del-flag-bread' value='brands'/><input class='brands-class' type='hidden' value='" + parseInt($(arr[i]).nextAll(".brands-value").val()) + "'/>";
							} else {
								str = str + $(arr[i]).val() + "<input type='hidden' class='del-flag-bread' value='brands'/><input class='brands-class' type='hidden' value='" + parseInt($(arr[i]).nextAll(".brands-value").val()) + "'/>，";
							}
						}
						$(".breads-all").append("<span> &gt; <span class='commodity-filtrate'><span class='commodity-filtrate-inner'>品牌：" + str + "</span><span class='del-filtrate'>X</span></span></span>");
						clearSelectedFun();
						direction = "DESC";
						order = "MULTIPLE";
						common.urlFun(additonCallbackFun, baseUrl + commodityUrl, pageIndex, order, direction, true, findModel);
						e.stopPropagation();
					});

					//供应商确定多选
					$("#commodity-catalog-section").on("click", ".supplier-more-choose", function(e) {
						$(".supplier-more-event").addClass("flag");
						$(".supplier-more-div,.supplier-more-span").css({
							"height": "38px"
						});
						var arr = $("#suppliers input:checked");
						var str = "";
						for(var i = 0; i < arr.length; i++) {
							findModel.supplierIds.push(parseInt($(arr[i]).nextAll(".supplies-value").val()));
							if(i == arr.length - 1) {
								str = str+ $(arr[i]).val() + "<input type='hidden' class='del-flag-bread' value='suppliers'/><input class='suppliers-class' type='hidden' value='" + parseInt($(arr[i]).nextAll(".supplies-value").val()) + "'/>";
							} else {
								str = str+ $(arr[i]).val() + "<input type='hidden' class='del-flag-bread' value='suppliers'/><input class='suppliers-class' type='hidden' value='" + parseInt($(arr[i]).nextAll(".supplies-value").val()) + "'/>，";
							}
						}
						$(".breads-all").append("<span> &gt; <span class='commodity-filtrate'><span class='commodity-filtrate-inner'>供应商："+str+"</span><span class='del-filtrate'>X</span></span></span>");
						clearSuppSelectedFun();
						direction = "DESC";
						order = "MULTIPLE";
						common.urlFun(additonCallbackFun, baseUrl + commodityUrl, pageIndex, order, direction, true, findModel);
						e.stopPropagation();
					});
					commodity(addBreadFun,clearSelectedFun,clearSuppSelectedFun);
				} else if(datas.code == "1020") {
					$("#out").click();
				} else {
					dialog({
						title: '提示',
						modal: true,
						content: datas.message,
						ok: function() {},
						cancel: false,
					}).width(320).show();
				}

				//common.mainNav().search().searchKey();
			};
			return {
				listMethod: function() {
					common.urlFun(callbackListFun, baseUrl + commodityUrl, pageIndex, order, direction, true, findModel);
				}
			}
		})();
		listFun.listMethod();
	};
	return controller;

});
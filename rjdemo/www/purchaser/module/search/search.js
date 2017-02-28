/**
 * Created by liumin on 2016/7/11.
 */
define(['text!module/search/search.html', 'text!module/header/search.html', 'text!module/header/navigation.html', 'css!module/search/style/style.css?', 'js/scroller', 'domready!'], function(tpl, searchHtml, navHtml) {
	var controller = function() {
		var categoryUrl = baseUrl + urls.allUrls.getProductCategory; //商品类别地址
		var detailSearchUrl = baseUrl + urls.allUrls.getDetailSearch; //高级搜索地址
		var allCate = baseUrl + urls.allUrls.getAllCate;
		function callbacks(r) {
			if(r.code == "0000") {
				var data = {
					search: searchHtml,
					c: r
				};
				appView.html(_.template(tpl, data));
				//购物车数量
				$("#basketNum").html($(".basket-num").html());
				common.nav(0).search();
				
				//选择分类
				$("#search-select-01").on("change", function() {
					var searchCategoryData = {
						"findModel": {
							"parentId": $(this).val()
						}
					};

					function callbackChangeFun(data) {
						if(data.code == "0000") {
							var str = "<option></option>";
							var d = data.categorys
							$.each(d, function(name, key) {
								str += '<option value="' + key.id + '">' + key.name + '</option>';
							});

							$("#search-select-02").html(str);

						} else if(data.code == "1020") {
							common.getOutFun();
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

					common.postData(categoryUrl, searchCategoryData, callbackChangeFun, true);
				});

				//提交搜索
				$("#search-info-btn").on("click", function() {
					if(!isNaN($.trim($("#low-price").val()).replace(/-/,'负数')) && !isNaN($.trim($("#high-price").val()).replace(/-/,'负数')) || !$.trim($("#high-price").val()) || !$.trim($("#low-price").val())){
						var productName = $.trim($("#product-name").val()),
						categoryIds = [$.trim($("#search-select-02").val())?$.trim($("#search-select-02").val()):$.trim($("#search-select-01").val())],
						categoryName = $.trim($("#search-select-02").find("option:selected").text())?$.trim($("#search-select-02").find("option:selected").text()):$.trim($("#search-select-01").find("option:selected").text()),
						brandName = $.trim($("#brand-name").val()),
						suppName = $.trim($("#supplier-name").val()),
						lowPrice = $.trim($("#low-price").val()),
						highPrice = $.trim($("#high-price").val());
						$.cookie("cateName",categoryName,{path:'/'});
						$.cookie("cateId",categoryIds,{path:'/'});
					window.location.href = "#commoditylist?flag=high&detailkey=" + productName + "&brand=" + brandName + "&supplier=" + suppName + "&low=" + lowPrice + "&high=" + highPrice ;
					}else{
						dialog({
						title: '提示',
						modal: true,
						content: "请检查价格是否为数字",
						ok: function() {},
						cancel: false,
				}).width(320).show();
					}
					
				});

			} else if(r.code == "1020") {
				common.getOutFun();
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

		common.postData(allCate, {
			flag: 0
		},callbacks, false);
	};
	return controller;
});
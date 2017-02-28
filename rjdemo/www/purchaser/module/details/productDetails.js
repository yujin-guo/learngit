define(function() {
	return function() {
		//富文本图片尺寸限制
		$(".details-product-info img").css("height", "");
		//购物车数量
		$("#basketNum").html($(".basket-num").html());
		//评论页面判断
		if($(".details-fourth-comment li").length == 0) {
			$("#pagination").hide();
			$(".details-no-comments").show();
		} else {
			$("#pagination").show();
			$(".details-no-comments").hide();
		}
		//进入店铺
		$(".details-second-right-enter").bind("click", function() {
			var shopId = $("#details-shop-id").val(),
				shopName = $(".details-second-right-title").text();
			window.location.href = "#supplie?id=" + encodeURIComponent(shopId) + "&name=" + encodeURIComponent(shopName);
		});

		//权限问题
		var purchaser_limit = userPermissions.indexOf('采购人中心');
		if(purchaser_limit == -1) {
			$(".details-second-car").addClass("detail-cart-gray");
			$(".details-second-attention").addClass("detail-interest-gray");
			$(".details-animation").remove();
		}
		//加入购物车
		$(".details-second-car").click(function() {
			var $that = $(this);
			var sku = parseInt($("#productSku").text());
			var buynum = parseInt($(".details-second-collect-input").val());
			if(sku == false || sku < buynum) {
				dialog({
					title: '提示',
					modal: true,
					content: '库存不足',
					ok: function() {},
					cancel: false,
				}).width(320).show();
				return false;
			}
			var url = common.serverBaseUrl + "/api/user/shoppingCart/SaveToShoppingCart"; //新增商品入购物车服务地址
			var data = {
				productSn: $("#detailsBrandId").val(),
				amount: $(".details-second-collect-input").val(),
				isSet: false,
			};

			function callback(r) {
				if(r.code == "0000") {
					//购物车动画
					/*var $span=$that.find(".details-animation span");
				    $span.addClass("demo");
				    $span.css({'backgroundImage':'url("module/details/style/images/fullcar.svg")'});
				    setTimeout(function(){
				        $span.css({'backgroundImage':'url("module/details/style/images/car.png")'});
				    },600);
				    setTimeout(function(){
				        $span.removeClass("demo");
				    },1000);*/
					//IE10以下的另作处理
					var matchArr = navigator.userAgent.match(/MSIE\s(\d*)/);
					if(matchArr && matchArr[1] < 10) {
						var productNum = $(".details-second-collect-input").val();
						$that.append("<em>+" + productNum + "</em>");
						var $em = $that.find("em");
						setTimeout(function() {
							$em.remove();
						}, 1000);
					} else {
						var productNum = $(".details-second-collect-input").val();
						$that.append("<em>+" + productNum + "</em>");
						var $em = $that.find("em");
						$em.animate({
							top: '-70px',
							opacity: 0
						}, 0, 'linear');
					};
					//监听购物车数量
					common.postData(baseUrl + urls.allUrls.getCartList, {
						showData: false
					}, function(d) {
						if(d.total) {
							$(".basket-num").html("(" + d.total + ")");
							$("#basketNum").html("(" + d.total + ")");
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
			
			if(purchaser_limit == -1){
				window.location.href="403.html";
			}else{
				common.postData(url, data, callback, true);
			}
		});
		common.nav().search().searchKey();

		// 图片切换效果
		$(".details-second-gallery li img").bind("click", function() {
			var href = $(this).attr("src");
			var alt = $(this).attr("alt");
			if(href) {
				$(".details-second-big").attr({
					"src": href,
					"alt": alt
				});
			}
		})

		// 数字增减效果
		$(".details-second-collect-cal p").bind("click", function() {
			var input = $(".details-second-collect-input");
			var txt = parseInt(input.val());
			if($(this).text() == "+") {
				txt++;
				input.val(txt);
			}
			if($(this).text() == "-") {
				txt--;
				input.val(txt);
				if(txt <= 1) {
					input.val(1)
				}
			}

		})

		//输入框占位符效果
		$(".details-fourth-search input").focus(function() {
				this.val = "关键字";
				if($(this).val() == this.val) {
					$(this).val(" ");
				}
			}).blur(function() {
				if($(this).val() == " ") {
					$(this).val(this.val)
				}
			})
			// 商品介绍评论部分动态效果
		$(".details-fourth-tab li").bind("click", function() {
			$(this).addClass("details-fourth-highlight").siblings().removeClass("details-fourth-highlight");
			var index = $(this).index();
			$(".details-fourth-content>li").eq(index).show().siblings().hide();
		}).eq(0).click();

		//商品分类和搜索点击效果
		var categoryIndex;
		$(".details-fourth-category li").bind("click", function() {
			categoryIndex = $(this).index();
			var shopId = $("#details-shop-id").val(),
				shopName = $(".details-second-right-title").text();
			var key = $("#keyWord").val();
			window.location.href = "#supplie?id=" + encodeURIComponent(shopId) + "&name=" + encodeURIComponent(shopName)+"&index=" + encodeURIComponent(categoryIndex);
		
		})
		$(".details-fourth-search-btn").bind("click", function() {
			var shopId = $("#details-shop-id").val(),
				shopName = $(".details-second-right-title").text();
			var key = $("#keyWord").val();
			window.location.href = "#supplie?id=" + encodeURIComponent(shopId) + "&name=" + encodeURIComponent(shopName) + "&keywords=" + encodeURIComponent(key);
		})

		//加入关注
		$(".details-second-attention").bind("click", function() {
			var url = common.serverBaseUrl + "/api/user/buyer/updateInterestProduct";
			var arr = [];
			arr.push($("#sn").text());
			var data = {
				productSns: arr,
				isInteresting: true
			};
			var callback = function(r) {
				if(r.code == "0000") {
					dialog({
						title: '提示',
						modal: true,
						content: '商品关注成功。',
						ok: function() {},
						cancel: false,
					}).width(320).show();
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
			
			if(purchaser_limit == -1){
				window.location.href="403.html";
				$(this).addClass("detail-interest-gray");
			}else{
				common.postData(url, data, callback, true)
			}
			
		});
	}
})
/*create by lijinhua*/
define(function() {
	var control = function(addBreadFun,clearSelectedFun,clearSuppSelectedFun) {
		$(".hide").hide();
		$(".pull-down").attr("more-flag", "true");
		$(".pull-down").on("click", function() {
			if($(this).attr("more-flag") == 'true') {
				$(".hide").show();
				$(this).attr("more-flag", "false");
			} else {
				$(".hide").hide();
				$(this).attr("more-flag", "true");
			}

		});

		//品牌展示(更多)
		function mutiFunShow(param) {
			$(".commodity-icon label").css("visibility", "visible");
			$(".commodity-catalog").css("height", param + 10 + "px");
		}

		function mutiFunHide(param) {
			$(".commodity-icon label").css("visibility", "hidden");
			$(".commodity-catalog").css("height", param + "px");
		}
		$(".catalog-control").on("click", ".common-event", function(e) {
			if($(this).attr("data-flag") == "choose") {
				if($(this).hasClass("flag") && $(".more").hasClass("flag")) {
					/*$(".catalog").css("height", $(".catalog-brand").height()-8 + "px");
					var current_height = $(".commodity-catalog-inner").height();
					mutiFunShow(current_height);
					$(this).removeClass("flag");*/
					$(".more").removeClass("flag");
					$(".commodity-catalog").css("height", 39 + "px");
					$(".commodity-icon label").css("visibility", "hidden");
					$(this).removeClass("flag");
					clearSelectedFun();
					$("#brands").unbind("click", addBreadFun).on("click", ".breads", addBreadFun);
				} else if($(this).hasClass("flag") && !$(".more").hasClass("flag")) {
					/*$(".commodity-catalog").css("height", 39 + "px");
					$(".commodity-icon label").css("visibility", "hidden");
					$(this).removeClass("flag");*/
					$(".commodity-catalog").css("height", 39 + "px");
					$(".commodity-icon label").css("visibility", "hidden");
					$(this).removeClass("flag");
					clearSelectedFun();
					$("#brands").unbind("click", addBreadFun).on("click", ".breads", addBreadFun);
				} else if(!$(this).hasClass("flag") && $(".more").hasClass("flag")) {
					$(".catalog").css("height", $(".catalog-brand").height() - 8 + "px");
					var current_height = $(".commodity-catalog-inner").height();
					mutiFunShow(current_height);
					$(this).addClass("flag");
					$("#brands").unbind("click", addBreadFun);
				} else if(!$(this).hasClass("flag") && !$(".more").hasClass("flag")) {
					$(".catalog").css("height", $(".catalog-brand").height() - 8 + "px");
					var current_height = $(".commodity-catalog-inner").height();
					mutiFunShow(current_height);
					$(this).addClass("flag");
					$("#brands").unbind("click", addBreadFun);
				}
			} else {
				if($(this).hasClass("flag") && $(".multichoose").hasClass("flag")) {
					$(".commodity-catalog").css("height", 39 + "px");
					$(".commodity-icon label").css("visibility", "hidden");
					/*var current_h = $(".catalog-brand").height();
					$(".catalog").css("height", current_h + "px");*/
					mutiFunHide(current_h);
					$(this).removeClass("flag");
					clearSelectedFun();
					$("#brands").unbind("click", addBreadFun).on("click", ".breads", addBreadFun);
				} else if($(this).hasClass("flag") && !$(".multichoose").hasClass("flag")) {
					var current_h = $(".catalog-brand").height();
					$(".commodity-catalog").css("height", 39 + "px");
					$(".commodity-icon label").css("visibility", "hidden");
					$(this).removeClass("flag");
					clearSelectedFun();
					$("#brands").unbind("click", addBreadFun).on("click", ".breads", addBreadFun);

				} else if(!$(this).hasClass("flag") && $(".multichoose").hasClass("flag")) {
					var current_h = $(".catalog-brand").height();
					$(".catalog").css("height", current_h + "px");
					mutiFunHide(current_h);
					$(this).addClass("flag");
					clearSelectedFun();
					$("#brands").unbind("click", addBreadFun).on("click", ".breads", addBreadFun);
				} else if(!$(this).hasClass("flag") && !$(".multichoose").hasClass("flag")) {
					var current_h = $(".catalog-brand").height();
					$(".catalog").css("height", current_h + "px");
					mutiFunHide(current_h);
					$(this).addClass("flag");
					clearSelectedFun();
					$("#brands").unbind("click", addBreadFun).on("click", ".breads", addBreadFun);
				}
			}
			e.stopPropagation();
		});

		//品牌‘确定’/‘取消’关闭更多
		$(".catalog-btn,.supplie-catalog-btn").on("click", "a", function(e) {
			var parentClass = $(this).parent().prop("class");
			if(parentClass == "catalog-btn") {
				$(".commodity-catalog").css("height", 39 + "px");
				$(".commodity-icon label").css("visibility", "hidden");
				$(".common-event").removeClass("flag");
				$("#brands").unbind("click", addBreadFun).on("click", ".breads", addBreadFun);
				if(!$(this).hasClass("brand-more-choose")){
					clearSelectedFun();
				}
			} else if(parentClass == "supplie-catalog-btn") {
				$(".supplier-more-event").addClass("flag");
				$(".supplier-icon-span label").css("visibility", "hidden");
				$(".supplier-more-div,.supplier-more-span").css({
					"height": "38px"
				});
				$("#suppliers").unbind("click", addBreadFun).on("click", ".breads", addBreadFun);
				if(!$(this).hasClass("supplier-more-choose")){
					clearSuppSelectedFun();
				}
			}
			//e.stopPropagation();
		});

		//供应商多选展示
		$(".supplier-more-event").on("click", function(e) {
			if($(this).hasClass("flag")) {
				$(this).removeClass("flag");
				var supplierH = $("#suppliers").height();
				$(".supplier-more-div").css({
					"height": supplierH + 51 + "px"
				});
				$(".supplier-more-span").css({
					"height": supplierH + "px"
				});
				$(".supplier-icon-span label").css("visibility", "visible");
				$("#suppliers").unbind("click", addBreadFun);

			} else {
				$(this).addClass("flag");
				$(".supplier-more-div,.supplier-more-span").css({
					"height": "38px"
				});
				clearSuppSelectedFun();
				$(".supplier-icon-span label").css("visibility", "hidden");
				$("#suppliers").unbind("click", addBreadFun).on("click", ".breads", addBreadFun);
			}
			e.stopPropagation();
		});

		//品牌/供应商勾选
		$("#brands,#suppliers").on("click", ".supplier-icon-span,.commodity-icon", function(event) {
			if(!$(this).hasClass("flag")) {
				$(this).find("label").html("√").css({
					"border-color": "#008cd0"
				});
				$(this).find("input[type='checkbox']").prop("checked", true);
				$(this).addClass("flag");
			} else {
				$(this).find("label").html("").css({
					"border-color": "#ccc"
				});
				$(this).find("input[type='checkbox']").prop("checked", false);
				$(this).removeClass("flag");
			}
			event.stopPropagation();

		});

		//商品展示模式
		$(".commodity-sort-right").bind("click", function() {
			$(".commodity-sort-right").removeClass("commodity-active");
			$(this).addClass("commodity-active");
			var f = $(this).attr("data-flag");
			if(f == "list") {
				$(this).children("span").css("background-position", "-232px -529px");
				$(".pic-icon").css("background-position", "-139px -488px");
				$(".commodity-list-lists").css("display", "block");
				$(".commodity-list-pic").css("display", "none");
			} else {
				$(this).children("span").css("background-position", "-139px -529px");
				$(".list-icon").css("background-position", "-232px -488px")
				$(".commodity-list-lists").css("display", "none");
				$(".commodity-list-pic").css("display", "block");
			}
		});
	}
	return control;
});
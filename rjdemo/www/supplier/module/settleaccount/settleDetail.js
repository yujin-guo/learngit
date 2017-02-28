define(['text!module/settleaccount/settleDetail.html', 'css!module/settleaccount/style/accountDetail.css', 'css!module/settleaccount/style/settleaccount.css'], function(tpl) {
	var controller = function() {
        common.tabFocus("结算中");
		var url = common.serverBaseUrl + urls.allUrls.getSummary; //汇总单详情
		var detailData = {
			id: common.getQueryString("id")
		};

		var callback = function(r) {
			if(r.code=="0000") {
				appView.html(_.template(tpl, r));
                animate();
			}else if(r.code=="1020"){
                $("#out-provider").click();
            }else{
                dialog({
                    title: '提示',
                    modal: true,
                    content: r.message,
                    ok: function() {},
                    cancel: false
                }).width(320).show();
            }
		};
		common.postData(url, detailData, callback, true);
        function animate(){
            //列表展示、收起
            $(".settleDetail-icon01,.settleDetail-icon02").on("click", function() {
                var p = $(this).parent().prop("class");
                if(p == "settleDetail-jiesuan") {
                    if(!$(this).hasClass("settleDetail-icon-active01")) {
                        $(this).nextAll(".settleDetail-order").hide("normal");
                        $(this).addClass("settleDetail-icon-active01");
                    } else {
                        $(this).nextAll(".settleDetail-order").show("normal");
                        $(this).removeClass("settleDetail-icon-active01");
                    }

                } else if(p == "settleDetail-order") {
                    if(!$(this).hasClass("settleDetail-icon-active02")) {
                        $(this).nextAll(".settleDetail-order-list").hide("normal");
                        $(this).addClass("settleDetail-icon-active02");
                    } else {
                        $(this).nextAll(".settleDetail-order-list").show("normal");
                        $(this).removeClass("settleDetail-icon-active02");
                    }
                }
            });
        }
	}
	return controller;
});

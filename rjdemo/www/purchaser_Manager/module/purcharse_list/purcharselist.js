define(['text!module/purcharse_list/purcharselist.html', 'text!module/purcharse_list/loadPurcharseList.html', 'js/libs/laydate.dev', 'css!module/home/style/style.css?', 'css!module/purcharse_list/style/purcharselist.css?'], function(tpl, loadHTML) {
	var controller = function() {
		var listFunc = (function() {
			var pageIndex = 1;
			var pageSize=common.pageSize;
			var listData={};
			var commonFun=function(callback,listData){
				common.postData(baseUrl+urls.allUrls.getPurcharseList,listData,callback,true);
			};
			var pageCallbackFun = function(pageIndexs) {
				listData.pageNo=pageIndexs+1;
				commonFun(callbackStatusFun,listData);
				//common.listUrlFun(baseUrl + "/api/order/getPurchaseApplyList", callbackStatusFun, pageIndexs + 1, search, status);
			};

			/*审批状态回调函数*/
			var callbackStatusFun = function(datas) {
				if(datas.code == "0000") {
					$("#list-tbody").html(_.template(loadHTML, datas));
					common.pageFun(datas.pageSize * datas.totalPages, datas.pageNo, common.pageSize, pageCallbackFun);
				} else {
					$("#outLogin").click();
				}
			};

			//获取当天时间
			function nowTime(){
				var mydate=new Date();
				var y=mydate.getFullYear();
				var m=mydate.getMonth()+1;
				var d=mydate.getDate();
				m=m<10?"0"+m:m;
				d=d<10?"0"+d:d;
				return y+"-"+m+"-"+d;
			}

			/*初始状态的ajax回调函数*/
			var callbackFun = function(datas) {
				if(datas.code == "0000") {
					//模块内容
					$('#right-container').html(_.template(tpl, datas));			
					common.tabFocus("我的采购");			
					//面包屑导航
					$(".bread").html("<span class='bread-span'><a href='index.html' class='purchase-bread'>管理中心</a></span><span class='bread-span'>&gt;&nbsp;我的采购</span>");

					//页码
					common.pageFun(datas.pageSize * datas.totalPages, datas.pageNo, common.pageSize, pageCallbackFun);

					/*审批状态*/
					$(".list-header-left").on("click", "span", function() {
						$(".list-header-left span").removeClass("list-active");
						$(this).addClass("list-active");
						if($.trim($(this).text()) == "审批通过") {
							listData = {};
							listData.status=4;
							//status = 4;
							commonFun(callbackStatusFun,listData);
							//common.listUrlFun(baseUrl + "/api/order/getPurchaseApplyList", callbackStatusFun, pageIndex, search, status);
						} else if($.trim($(this).text()) == "审批中") {
							listData = {};
							listData.status = 1;
							commonFun(callbackStatusFun,listData);
							//common.listUrlFun(baseUrl + "/api/order/getPurchaseApplyList", callbackStatusFun, pageIndex, search, status);
						} else if($.trim($(this).text()) == "全部") {
							listData={};
							commonFun(callbackStatusFun,listData);
							//common.listUrlFun(baseUrl + "/api/order/getPurchaseApplyList", callbackStatusFun, pageIndex, search, status);
						} else if($.trim($(this).text()) == "审批驳回") {
							listData = {};
							listData.status = 3;
							commonFun(callbackStatusFun,listData);
							//common.listUrlFun(baseUrl + "/api/order/getPurchaseApplyList", callbackStatusFun, pageIndex, search, status);
						}
					});
					
					$(".single-staus,.single-dep").on("click",function(){
						if($(this).hasClass("single-flag")){
							$(this).children(".single-status-absolute").addClass("show");
							$(this).removeClass("single-flag");
						}else{
							$(this).addClass("single-flag");
							$(this).children(".single-status-absolute").removeClass("show");
						}
					});
					$(".stu dt").on("click",function(){
						$(".single-status-absolute").removeClass("show");
						listData={};
						listData.status=$(this).attr("data-value");
						commonFun(callbackStatusFun,listData);
					});
					
					$(".dep dt").on("click",function(){
						$(".single-status-absolute").removeClass("show");
						listData={};
						listData.search=$.trim($(this).text());
						commonFun(callbackStatusFun,listData);
					});
					

					/*采购申请搜索*/
					$("#search").on("click", function() {
						listData={};
						listData.search = $.trim($(this).prev("input").val());
						commonFun(callbackStatusFun,listData);
						//common.listUrlFun(baseUrl + "/api/order/getPurchaseApplyList", callbackStatusFun, pageIndex, search, status);
					});

					//展开更多
					$(".more-content").attr("flag", "true").hide();
					$(".more-search").click(function() {
						if($(".more-content").attr("flag") == "true") {
							$(this).text("收起").nextAll(".direction-icon").css("background-position", "-343px -29px");
							$(".more-content").attr("flag", "false").show();
						} else {
							$(this).text("更多").nextAll(".direction-icon").css("background-position", "-300px -29px");
							$(".more-content").attr("flag", "true").hide();
						}
					});

					/*详细搜索*/
					$("#detail-search").on("click", function() {
						listData = {};
						listData.status = $.trim($("#order-recon").val());
						listData.fbuyapplicationno = $.trim($("#order-number").val());
						listData.fbuydepartment = $.trim($("#order-per").val());
						listData.startDate = $.trim($("#begin-time").val())||"1975-01-01";
						listData.endDate = $.trim($("#over-time").val())||nowTime();
						//console.log(listData);
						commonFun(callbackStatusFun,listData);
					});
					
					//采购状态下拉列表状态
					$(".status-change-icon,#order-per,#order-cell-text").click(function(){
						if($(this).nextAll(".status-absolute").hasClass("show")){
							$(this).nextAll(".status-absolute").removeClass("show");
						}else{
							$(this).nextAll(".status-absolute").addClass("show");
						}
					});
					$("dt").click(function(){
						var dataValue=$(this).attr("data-value");
						var dataText=$(this).html();
						$(this).parent().siblings("input[type='hidden']").prop("value",dataValue);
						$(this).parent().siblings(".search-cell").prop("value",dataText);
						$(this).parent().removeClass("show");
					});
					

                    $('#begin-time,#over-time').focus(function(){
                //       setTimeout('$(this).attr("disabled",true)',5000);
                    });
                    $('#begin-time,#over-time').blur(function(){
                       $(this).attr("disabled",false); 
                    });
                    /*时间控件*/
					laydate({
						elem: '#begin-time',
                        choose:function(dates){
                            $("#begin-time").attr("disabled",false);
                        }
					});
					laydate({
						elem: '#over-time',
                        choose:function(dates){
                            $("#over-time").attr("disabled",false);
                        }
					});
				}else if(datas.code=="1020"){
					$("#outLogin").click();
				}else{
                    dialog({
                        title: '提示',
                        modal: true,
                        content: datas.message,
                        ok: function() {},
                        cancel: false
                    }).width(320).show();    
                }

			};
			return {
				listMethod: function() {
					commonFun(callbackFun,listData);
					//common.listUrlFun(baseUrl + "/api/order/getPurchaseApplyList", callbackFun, pageIndex, search, status);
				}
			}
		})();
		listFunc.listMethod();

	};
	return controller;
});
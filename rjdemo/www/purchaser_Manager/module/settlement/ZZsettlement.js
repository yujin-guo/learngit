define(['text!module/settlement/ZZsettlement.html','text!module/settlement/loadZZSettle.html','css!module/settlement/style/settlement.css',"pagination","js/libs/laydate.dev"],function(tpl,loadSettle){
	var controller=function(){
		var	pageSize=20,
		    data={
		    	pageNo:1,
	    		pageSize:pageSize,
		    },
		    totalNum;//结算单总条数
		var url=baseUrl+urls.allUrls.getSYXStatements;//浙肿和孙逸仙同一个接口
		common.postData(url,data,getCallback(1),true);
		common.tabFocus("结算列表");//tab选中
		
		/*
		 * 回调函数
		 *@param {Number} flag 1为页面初次加载，2为分页回调函数，3为页面搜索刷新
		 *@param {Object} requestData 分页回调函数参数
		 *@return {Function} 回调函数
		 * */
		function getCallback(flag,requestData){
			var callback=function(r){
				if(r.code=="0000"){
		    		totalNum=(r.totalPages||r.totalPage)*pageSize;
		    		var data={};
		    		data.statement=r.rows;
		    		if(flag==1){
		    			$("#right-container").html(_.template(tpl,data))
		    			loadSettlement();//一次绑定事件
		    		}else{		    			
		    			$(".settle-content").html(_.template(loadSettle,data));//ajax局部刷新
		    			$(".settle-header-btn .settle-checkbox").removeClass("settle-checkbox-selected");//全选框重置
		    		}
					$(".total-page-num").text(r.totalPages||r.totalPage);
					eventBind();//刷新页面后需重新绑定的事件
					if(flag==1||flag==3){
						common.pageFun(totalNum,1,pageSize,page(requestData||{}));//页面初始化
						if(data.statement.length){
							$(".list-page").show();//分页标签
							$(".settle-header-btn").show();//全选标签
						}else{
							$(".list-page").hide();
							$(".settle-header-btn").hide();
						};
					}
		    	}else{
		    		dialog({
	                    title: '提示',
	                    modal:true,
	                    content: r.message,
	                    ok: function () {},
	                    cancel: false,
	                }).width(320).show();
		    	}
			};
			return callback;
		}
		/**
		 * 分页回调函数
		 * @param {Object} data 搜索条件
		 * @return {function} 分页回调函数
		 * */
		function page(data){
			var pageCallback=function(i){
				var baseData={
					pageSize:pageSize,
					pageNo:i+1,
				};
				$.extend(data,baseData);
				common.postData(url,data,getCallback(2),true);
			};
			return pageCallback;
		}
		
		//页面局部刷新后需要绑定的事件
		function eventBind(){
			//结算勾选效果
			$(".settle-content .settle-checkbox").bind("click",function(){
				$(this).toggleClass("settle-checkbox-selected");
				var boxNum=$(".settle-content .settle-checkbox").length,
					selectNum=$(".settle-content .settle-checkbox-selected").length;
				if(boxNum==selectNum){
					$(".settle-header-btn .settle-checkbox").addClass("settle-checkbox-selected");
				}else{
					$(".settle-header-btn .settle-checkbox").removeClass("settle-checkbox-selected");
				}
			});

			//查看结算详情单
			$(".settle-title-e").on("click",'.settle-content-check',function(){
				var num=$(this).parents(".settle-content-item").find(".settle-balance-number").text().trim();//结算单号
				var status=$(this).siblings(".settle-statement-id").attr("data-status");
				var id=$(this).siblings(".settle-statement-id").val();
				window.location.hash="zzsettlementdetails?status="+encodeURIComponent(status)+"&num="+encodeURIComponent(num)+"&id="+encodeURIComponent(id);
			});
		}
		function loadSettlement(){
			//面包屑导航
			$(".bread").html("<span class='bread-span'><a href='index.html' class='purchase-bread'>管理中心</a></span><span class='bread-span'>&gt;&nbsp;结算列表</span>");
			//搜索
			$(".settle-more-btn-search").bind("click",function(){
				supplierName=$.trim($(".settle-more-supplier").val()),
				status=$.trim($(".settle-more-status").val()),
				startTime=$.trim($("#startTime").val())||"1975-01-01",
				endTime=$.trim($("#endTime").val())||"2100-01-01",
				queryTerm=$(".settle-more-search-input").val().trim(),
				SYXData={
					pageNo:1,
		    		pageSize:pageSize,
		    		endDate:endTime,
		    		startDate:startTime
				};//孙逸仙医院请求参数
				var searchData=SYXData;//判断请求参数
				if(status!=""&&status!="全部"){
					switch(status){
						case "待提交验收单":status=4;
						break;
						case "待提交供应商":status=5;
						break;
						case "待开票":status=0;
						break;
						case "待填发票":status=6;
						break;
						case "待递送":status=7;
						break;
						case "待审核":status=1;
						break;
						case "待付款":status=2;
						break;
						case "已完成":status=3;
						break;
					}
					searchData.status=status;
				};
				if(queryTerm){
					searchData.term=queryTerm;
				};
				common.postData(url,searchData,getCallback(3,searchData),true);
			});
			//时间控件
			laydate({
				elem:"#startTime"
			});
			laydate({
				elem:"$endTime"
			})
			//状态选择
			$(".settle-more-status").focus(function(){
				$(".settle-status-choices").slideDown("slow")
			}).blur(function(){
				$(".settle-status-choices").delay(200).slideUp("slow")
			});
			$(".settle-status-choices li").bind("click",function(){
				var txt=$(this).text();
				$(".settle-more-status").val(txt);
			});
			//全部勾选
			$(".settle-header-btn .settle-checkbox").bind("click",function(){
				$(this).toggleClass("settle-checkbox-selected");
				var $elems=$(".settle-content .settle-checkbox");
				if($(this).hasClass("settle-checkbox-selected")){
					$elems.addClass("settle-checkbox-selected");
				}else{
					$elems.removeClass("settle-checkbox-selected");
				}
			});
		}
	}
	return controller;
});

define(['text!module/statistic/summary.html', 'text!module/statistic/header.html', 'text!module/statistic/nav.html', 'css!module/statistic/style/statistic.css',"js/libs/laydate.dev"], function(tpl, header, nav) {
	var controller = function() {
		userPermissions=JSON.parse($.cookie("permissions"))
		appView.html(_.template(header));
		var mydate=new Date(),
		startTime=common.getOneMonthDate(),
		endTime=common.getDate(),
		department;
		var statementUrl=testUrl+urls.allUrls.statementSummary,
			orderUrl=testUrl+urls.allUrls.orderSummary,
			applicationUrl=testUrl+urls.allUrls.applicationSummary,
            checkUrl=testUrl+urls.allUrls.approvalSummary
			datas={},//返回数据
			requestData={
				startTime:startTime,
				endTime:endTime,
				department:null
			},
			statementCallback=function(r){
				if(r.code=="0000"){
					datas.statement=r;
					common.postData(orderUrl,requestData,orderCallback,true);
				}
			},
			orderCallback=function(r){
				if(r.code=="0000"){
					datas.order=r;
					common.postData(checkUrl,requestData,checkCallback,true);
				}
			},
            
            checkCallback=function(r){
				if(r.code=="0000"){
					datas.check=r;
					common.postData(applicationUrl,requestData,applicationCallback,true);
				}
			},
			applicationCallback=function(r){
				datas.application=r;
				datas.nav=nav;
				$('#right-container').html(_.template(tpl,datas));
				$(".secondary-title").eq(0).addClass("secondary-active").siblings().removeClass("secondary-active");
				$(".secondary-title").eq(0).bind("click",function(){window.location.reload()});
				eventBind();

			};
		common.postData(statementUrl,requestData,statementCallback,true);
		
		function eventBind(){
			//时间设置
			$("#summaryStartTime").val(startTime);
			$("#summaryEndTime").val(endTime);
			$(".search-input").val(department);
			$(".search-btn").bind("click",function(){
				startTime=$("#summaryStartTime").val();
				endTime=$("#summaryEndTime").val();
				department=$(".search-input").val().trim();
				requestData={
					startTime:startTime,
					endTime:endTime,
					department:department||null
				};
			common.postData(statementUrl,requestData,statementCallback,true)
			})

			laydate({
				elem:"#summaryStartTime"
			});
			laydate({
				elem:"#summaryEndTime"
			});
		}
	};
	return controller;
});
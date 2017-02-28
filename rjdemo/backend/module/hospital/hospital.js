define(['text!module/hospital/hospital.html', 'text!module/hospital/header.html', 'text!module/hospital/nav.html', 'text!module/hospital/loadHtml.html', 'css!module/hospital/style/hospital.css?'], function(tpl, header, nav, loadHtml) {
	var controller = function() {
		appView.html(_.template(header));
		$("#right-container").html(_.template(nav));
        $(".secondary-title").eq(0).addClass("secondary-active").siblings().removeClass("secondary-active");
		var publishUrl = omsUrl + urls.allUrls.hospitalPublish; //医院发布
		var hospitalUrl = omsUrl + urls.allUrls.getHospitalList; //医院列表

		var hospitalData = {
			currentPage: 1,
			pageSize: common.pageSize
		};
		var pageIndex = 1;

		var callbackMemberFun = function(datas) {
			if(datas.resultCode === "0000") {
				if(datas.entities.length) {
					datas.flag = true;
				} else {
					datas.flag = false;
				}

				//模块内容
				$('#right-container').append(_.template(tpl, datas));

				$(".secondary-active a").click(function() {
					window.location.reload();
				});

				//页面回调函数
				var callbackPageFun = function(datasP) {
					if(datasP.resultCode === "0000") {
						if(datasP.entities.length) {
							datasP.flag = true;
						} else {
							datasP.flag = false;
						}
						$("#list").html(_.template(loadHtml, datasP));

						common.pageFun(datasP.pageSize * datasP.totalPage, datasP.currentPage, datasP.pageSize, pageEvent);
					} else if(datasP.resultCode === "1001") {
						common.getOutFun();
					} else {
						dialog({
							title: '提示',
							modal: true,
							content: datasP.msg,
							ok: function() {},
							cancel: false
						}).width(320).show();
					}
				};

				//页码触发事件
				var pageEvent = function(pageIndexs) {
					hospitalData.currentPage = pageIndexs + 1;
					common.postData(hospitalUrl, hospitalData, callbackPageFun, true);
				};

				//页码
				common.pageFun(datas.pageSize * datas.totalPage, datas.currentPage, datas.pageSize, pageEvent);

				//首页/尾页
				common.endsFun(pageIndex, datas.totalPage, pageEvent);

				//查询条件
				$("#search-btn").on("click", function() {
					if($("#search-value").val()) {
						hospitalData = {
							currentPage: 1,
							pageSize: common.pageSize
						}
						hospitalData.orgName = $("#search-value").val();
						common.postData(hospitalUrl, hospitalData, callbackPageFun, true);
					} else {
						dialog({
							title: '提示',
							modal: true,
							content: "请输入查询条件",
							ok: function() {},
							cancel: false
						}).width(320).show();
					}
				});

				$("#search-value").keydown(function(event) {
					if(event.keyCode == 13) {
						$("#search-btn").click();
					}
				});

				$("#status-select").on("change", function() {
					hospitalData = {
						currentPage: 1,
						pageSize: common.pageSize
					}
					hospitalData.status = $(this).val();
					common.postData(hospitalUrl, hospitalData, callbackPageFun, true);
				});

				//禁用/启用
				$("#list").on("click", ".status-link-event", function() {
					var publishId = $(this).attr("data-id");
					var callbackStatusFun = function(dataS) {
						if(dataS.resultCode === "0000") {
							hospitalData = {
								currentPage: 1,
								pageSize: common.pageSize,
							}
							dialog({
								title: '提示',
								modal: true,
								content: "发布成功",
								ok: function() {
									common.postData(hospitalUrl, hospitalData, callbackPageFun, true,false);
								},
								cancel: false,
							}).width(320).show();
						} else if(dataS.resultCode === "1001") {
							common.getOutFun();
						} else {
							dialog({
								title: '提示',
								modal: true,
								content: dataS.msg,
								ok: function() {},
								cancel: false
							}).width(320).show();
						}
					};
					common.postData(publishUrl + "/" + publishId, null, callbackStatusFun, true,false);
				});

				//批量导入
				$(".batch-file").on("change", function() {
					var callback = function(r) {
						if(r.resultCode === "0000") {
							$("#infomation").html(_.template(batchHtml, r));
						} else {
							dialog({
								title: '提示',
								modal: true,
								content: r.msg,
								ok: function() {},
								cancel: false
							}).width(320).show();
						}
					};
					//$("#form").submit();
					common.fileUpload("form", callback);
				});
			} else if(datas.resultCode === "1001") {
				common.getOutFun();
			} else {
				dialog({
					title: '提示',
					modal: true,
					content: datas.msg,
					ok: function() {},
					cancel: false
				}).width(320).show();
			}
		};
		common.postData(hospitalUrl, hospitalData, callbackMemberFun, true,false);
	};
	return controller;
});
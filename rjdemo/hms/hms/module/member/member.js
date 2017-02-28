define(['text!module/member/member.html', 'text!module/member/header.html', 'text!module/member/nav.html', 'text!module/member/loadHtml.html', 'text!module/member/batch.html', 'css!module/member/style/member.css?'], function(tpl, header, nav, loadHtml, batchHtml) {
	var controller = function() {
		userPermissions = JSON.parse($.cookie("permissions"));
		appView.html(_.template(header));
		$("#right-container").html(_.template(nav));

		var memberData = {
			pageNo: 1,
			pageSize: common.pageSize,
			orgUserListQuerySet: {
				queryTerm: null,
				status: null
			}
		};
		var pageIndex = 1;

		var callbackMemberFun = function(datas) {
			if(datas.code === "0000") {
				datas.URL = common.serverBaseUrl;
				if(datas.userList.length) {
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
					if(datasP.code === "0000") {
						if(datasP.userList.length) {
							datasP.flag = true;
						} else {
							datasP.flag = false;
						}
						$("#list").html(_.template(loadHtml, datasP));
						common.pageFun(datasP.pageSize * datasP.totalPages, datasP.pageNo, datasP.pageSize, pageEvent);
					}
				};

				//页码触发事件
				var pageEvent = function(pageIndexs) {
					memberData.pageNo = pageIndexs + 1;
					common.postData(testUrl + urls.allUrls.getMemberList, memberData, callbackPageFun, true);
				};

				//页码
				common.pageFun(datas.pageSize * datas.totalPages, datas.pageNo, datas.pageSize, pageEvent);

				//首页/尾页
				common.endsFun(pageIndex, datas.totalPages, pageEvent);

				//查询条件
				$("#search-btn").on("click", function() {
					if($("#search-value").val()) {
						memberData.orgUserListQuerySet.status = null;
						memberData.orgUserListQuerySet.queryTerm = $("#search-value").val();
						common.postData(testUrl + urls.allUrls.getMemberList, memberData, callbackPageFun, true);
					} else {
						dialog({
							title: '提示',
							modal: true,
							content: "请输入查询条件",
							ok: function() {},
							cancel: false,
						}).width(320).show();
					}
				});
				
				$("#search-value").keydown(function(event){
					if(event.keyCode == 13) {
						$("#search-btn").click();
					}
				});
				
				$("#status-select").on("change", function() {
					memberData.orgUserListQuerySet.queryTerm = null;
					memberData.orgUserListQuerySet.status = $(this).val();
					common.postData(testUrl + urls.allUrls.getMemberList, memberData, callbackPageFun, true);
				});

				//禁用/启用
				$("#list").on("click", ".status-link-event", function() {
					var statusData = {
						userId: parseInt($(this).attr("data-id")),
						status: $(this).attr("data-flag")
					};
					var callbackStatusFun = function(dataS) {
						if(dataS.code === "0000") {
							common.postData(testUrl + urls.allUrls.getMemberList, memberData, callbackPageFun, true);
						} else {
							dialog({
								title: '提示',
								modal: true,
								content: dataS.message,
								ok: function() {},
								cancel: false,
							}).width(320).show();
						}
					};
					common.postData(testUrl + urls.allUrls.updateStatus, statusData, callbackStatusFun, true);
				});

				//下载人员模板
				$(".get-template").prop("href", testUrl + urls.allUrls.loadTemplate);

				//批量导入
				$(".batch-file").on("change", function() {
					var callback = function(r) {
						if(r.code === "0000") {
							$("#infomation").html(_.template(batchHtml, r));
						} else {
							dialog({
								title: '提示',
								modal: true,
								content: r.message,
								ok: function() {},
								cancel: false,
							}).width(320).show();
						}
					};
					//$("#form").submit();
					common.fileUpload("form", callback);
				});
			} else if(datas.code === "1020") {
				window.location.href = "index.html";
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
		common.postData(testUrl + urls.allUrls.getMemberList, memberData, callbackMemberFun, true);
	};
	return controller;
});